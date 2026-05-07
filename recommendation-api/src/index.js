require('dotenv').config();

const express = require('express');
const cors = require('cors');
const Redis = require('ioredis');
const { computeRecommendations } = require('./recommendEngine');

const PORT = Number(process.env.PORT) || 4000;
const CACHE_TTL_SEC = Number(process.env.CACHE_TTL_SEC) || 120;
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

const app = express();
app.use(express.json({ limit: '32kb' }));
app.use(
  cors({
    origin: CORS_ORIGIN.split(',').map((s) => s.trim()),
    methods: ['GET', 'POST', 'OPTIONS'],
  })
);

let redis;
let redisReady = false;

function getRedis() {
  if (process.env.SKIP_REDIS === '1') return null;
  if (redis) return redis;
  try {
    redis = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 1,
      lazyConnect: true,
      enableOfflineQueue: false,
    });
    redis.on('ready', () => {
      redisReady = true;
    });
    redis.on('error', (err) => {
      console.warn('[redis]', err.message);
      redisReady = false;
    });
    return redis;
  } catch (e) {
    console.warn('[redis] init failed', e.message);
    return null;
  }
}

function cacheKey(favoriteIds, limit) {
  const sorted = [...favoriteIds].map(Number).filter(Number.isFinite).sort((a, b) => a - b);
  return `rec:v1:${sorted.join(',')}:${limit}`;
}

async function getCached(key) {
  const client = getRedis();
  if (!client) return null;
  try {
    if (client.status === 'wait') await client.connect();
    const raw = await client.get(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function setCached(key, payload) {
  const client = getRedis();
  if (!client) return;
  try {
    await client.set(key, JSON.stringify(payload), 'EX', CACHE_TTL_SEC);
  } catch {
    
  }
}

app.get('/health', (req, res) => {
  const client = getRedis();
  res.json({
    status: 'ok',
    service: 'recommendation-api',
    redis: process.env.SKIP_REDIS === '1' ? 'skipped' : redisReady ? 'connected' : client ? 'degraded' : 'disabled',
    uptimeSec: Math.round(process.uptime()),
  });
});

function parseFavoriteIds(body, query) {
  if (body && Array.isArray(body.favoriteIds)) {
    return body.favoriteIds.map(Number).filter(Number.isFinite);
  }
  const q = query.favoriteIds || query.favorites;
  if (typeof q === 'string' && q.trim()) {
    return q
      .split(',')
      .map((s) => Number(s.trim()))
      .filter(Number.isFinite);
  }
  return [];
}

async function handleRecommendations(req, res) {
  const started = Date.now();
  const favoriteIds = parseFavoriteIds(req.body, req.query);
  const limit = Math.min(20, Math.max(1, Number(req.query.limit) || Number(req.body?.limit) || 8));

  const key = cacheKey(favoriteIds, limit);
  const cached = await getCached(key);
  if (cached) {
    return res.json({
      ...cached,
      meta: {
        ...(cached.meta || {}),
        cache: 'HIT',
        latencyMs: Date.now() - started,
      },
    });
  }

  const t0 = Date.now();
  const result = computeRecommendations({ favoriteIds, limit });
  const computeMs = Date.now() - t0;
  const payload = {
    bookIds: result.bookIds,
    courses: result.courses,
    meta: {
      cache: 'MISS',
      computeMs,
      favoriteCount: favoriteIds.length,
    },
  };

  await setCached(key, {
    bookIds: payload.bookIds,
    courses: payload.courses,
    meta: { favoriteCount: favoriteIds.length },
  });

  res.json({
    ...payload,
    meta: {
      ...payload.meta,
      latencyMs: Date.now() - started,
    },
  });
}

app.post('/api/recommendations', handleRecommendations);
app.get('/api/recommendations', handleRecommendations);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

const server = app.listen(PORT, () => {
  console.log(`recommendation-api listening on http://0.0.0.0:${PORT}`);
  getRedis();
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
