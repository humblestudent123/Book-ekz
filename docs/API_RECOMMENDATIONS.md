# API сервиса рекомендаций (`recommendation-api`)

Базовый URL по умолчанию: `http://localhost:4000`

## `GET /health`

Проверка работоспособности.

Пример ответа:

```json
{
  "status": "ok",
  "service": "recommendation-api",
  "redis": "connected",
  "uptimeSec": 42
}
```

Поле `redis`: `connected` | `degraded` | `disabled` | `skipped` (если `SKIP_REDIS=1`).

## `POST /api/recommendations`

Тело запроса (JSON):

| Поле | Тип | Описание |
|------|-----|----------|
| `favoriteIds` | `number[]` | ID книг из избранного (как в `src/data.js`) |
| `limit` | `number` | Максимум рекомендуемых книг (1–20, по умолчанию 8) |

Ответ:

| Поле | Тип | Описание |
|------|-----|----------|
| `bookIds` | `number[]` | Упорядоченный список ID книг для каталога |
| `courses` | `object[]` | До 3 онлайн-курсов (заглушки с внешними ссылками) |
| `meta` | `object` | `cache`: `HIT` / `MISS`, `latencyMs`, при MISS — `computeMs`, `favoriteCount` |

Пример:

```bash
curl -s -X POST http://localhost:4000/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{"favoriteIds":[1,2],"limit":6}' | jq .
```

## `GET /api/recommendations`

Те же данные, что и у POST; избранное передаётся query-параметром `favoriteIds` (через запятую):

```text
GET /api/recommendations?favoriteIds=1,2&limit=6
```

## Кэш Redis

Ключ кэша строится из отсортированного списка `favoriteIds` и `limit`. TTL задаётся переменной `CACHE_TTL_SEC` (по умолчанию 120 секунд).
