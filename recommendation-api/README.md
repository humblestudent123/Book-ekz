# recommendation-api

Мини-сервис рекомендаций для диплома: **Express**, опционально **Redis** (кэш), данные книг — `data/book-features.json`, курсы — `data/courses.json`.

## Команды

```bash
npm install
npm start          # порт 4000 по умолчанию
npm test
```

## Переменные окружения

См. `.env.example`. Для локального запуска без Redis: `SKIP_REDIS=1`.

## Эндпоинты

- `GET /health`
- `POST /api/recommendations` — тело `{ "favoriteIds": [1,2], "limit": 8 }`
- `GET /api/recommendations?favoriteIds=1,2`

Подробнее: [docs/API_RECOMMENDATIONS.md](../docs/API_RECOMMENDATIONS.md).
