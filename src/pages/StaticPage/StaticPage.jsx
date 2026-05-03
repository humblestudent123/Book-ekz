import { memo } from 'react';
import './StaticPage.css';

const STATIC_PAGES = {
  about: {
    title: 'Что такое ReadNext?',
    content: (
      <div className="static-page__content">
        <h2>Наша миссия</h2>
        <p>
          <strong>ReadNext</strong> - это платформа для чтения и публикации книг.
        </p>
        <p>
          Мы помогаем авторам находить аудиторию, а читателям - открывать новые миры
          через книги.
        </p>

        <div className="static-page__section">
          <h2>Как это работает?</h2>
          <ul>
            <li>Читайте тысячи книг в удобном интерфейсе</li>
            <li>Авторы публикуют свои произведения без посредников</li>
            <li>Система рекомендует книги под ваш вкус</li>
          </ul>
        </div>

        <div className="static-page__section">
          <h2>Безопасность данных</h2>
          <p>
            Ваши данные хранятся в зашифрованном виде. Мы не продаем информацию
            третьим лицам и даем вам полный контроль над контентом.
          </p>
        </div>
      </div>
    ),
  },
  help: {
    title: 'Помощь',
    content: (
      <div className="static-page__content">
        <h2>Как мы можем помочь?</h2>
        <p>
          У вас возникли вопросы? Вот несколько способов найти ответ:
        </p>

        <div className="static-page__section">
          <h3>Частые вопросы</h3>
          <ul>
            <li><a href="/faq">Как оформить подписку?</a></li>
            <li><a href="/faq">Можно ли читать офлайн?</a></li>
            <li><a href="/faq">Как уйти из подписки?</a></li>
          </ul>
        </div>

        <div className="static-page__section">
          <h3>Контакт с поддержкой</h3>
          <p>Напишите нам в Telegram: <a href="https://t.me/readnext">@readnext</a></p>
          <p>Или на почту: <a href="mailto:support@readnext.com">support@readnext.com</a></p>
        </div>
      </div>
    ),
  },
  docs: {
    title: 'Документация',
    content: (
      <div className="static-page__content">
        <h2>Разработчикам</h2>
        <p>Официальная документация для интеграции ReadNext API.</p>
        <ul>
          <li><a href="/api-docs">API-спецификацию</a></li>
          <li><a href="/guides">Руководства по интеграции</a></li>
          <li><a href="/changelog">Список изменений</a></li>
        </ul>
      </div>
    ),
  },
  pricing: {
    title: 'Тарифы и подписки',
    content: (
      <div className="static-page__content">
        <h2>Выберите удобный тариф</h2>
        <p>
          Читайте без рекламы, с офлайн-режимом и эксклюзивным контентом.
        </p>

        <div className="static-page__section">
          <h3>Free - forever</h3>
          <ul>
            <li>Доступ к базовой библиотеке, более 10 000 книг</li>
            <li>Облако для сохранения прогресса</li>
            <li>Базовая персонализация</li>
          </ul>
        </div>

        <div className="static-page__section">
          <h3>Pro - за 199 руб./мес.</h3>
          <ul>
            <li>Все книги без ограничений</li>
            <li>Офлайн-режим и закладки</li>
            <li>Умные рекомендации</li>
            <li>Без рекламы</li>
          </ul>
          <p className="static-page__cta">
            <a href="/pricing/pro">Оформить подписку</a>
          </p>
        </div>
      </div>
    ),
  },
  privacy: {
    title: 'Политика конфиденциальности',
    content: (
      <div className="static-page__content">
        <h2>Защищаем вашу приватность</h2>
        <p>
          Мы уважаем вашу приватность. Вот как мы обрабатываем данные:
        </p>

        <div className="static-page__section">
          <h3>Что мы собираем?</h3>
          <ul>
            <li>Личные данные при регистрации: имя и email</li>
            <li>Информацию о прочитанных книгах и прогрессе</li>
            <li>Данные устройства и браузера для оптимизации работы</li>
          </ul>
        </div>

        <div className="static-page__section">
          <h3>Как используем?</h3>
          <p>Чтобы:</p>
          <ul>
            <li>Предоставлять сервис</li>
            <li>Персонализировать рекомендации</li>
            <li>Улучшать интерфейс</li>
          </ul>
        </div>

        <div className="static-page__section">
          <h3>Данные - только в облаке</h3>
          <p>
            Вся личная информация хранится на защищенных серверах. Мы не передаем ее
            третьим лицам без вашего согласия.
          </p>
        </div>
      </div>
    ),
  },
  dmca: {
    title: 'Правообладателям',
    content: (
      <div className="static-page__content">
        <h2>Защита авторских прав</h2>
        <p>
          Если вы считаете, что чья-то работа опубликована без разрешения:
        </p>

        <div className="static-page__section">
          <h3>Как подать заявку?</h3>
          <ol>
            <li>Предоставьте доказательства авторства</li>
            <li>Укажите ссылку на страницу с контентом</li>
            <li>Опишите, что требуется удалить</li>
          </ol>
        </div>

        <div className="static-page__section">
          <p>
            Мы рассматриваем заявки в течение 24 часов и удаляем спорный контент
            до проверки.
          </p>
          <p>Пишите на: <a href="mailto:dmca@readnext.com">dmca@readnext.com</a></p>
        </div>
      </div>
    ),
  },
  publish: {
    title: 'Опубликовать книгу',
    content: (
      <div className="static-page__content">
        <h2>Авторам - просто и быстро</h2>
        <p>Загрузите свою книгу за 5 минут, без посредников.</p>

        <div className="static-page__section">
          <h3>Как это сделать?</h3>
          <ol>
            <li>Зарегистрируйтесь как автор</li>
            <li>Загрузите manuscript в PDF или EPUB</li>
            <li>Настройте обложку и аннотацию</li>
            <li>Выберите цену или сделайте бесплатно</li>
          </ol>
        </div>

        <div className="static-page__section">
          <h3>Рекомендации для авторов</h3>
          <ul>
            <li>Качественная верстка повышает оценку книги</li>
            <li>Хороший анонс увеличивает скачивания</li>
            <li>Добавьте цитаты в аннотацию для привлечения внимания</li>
          </ul>
        </div>
      </div>
    ),
  },
  error: {
    title: 'Страница не найдена',
    content: (
      <div className="static-page__content">
        <h2>Ой! Страница временно недоступна</h2>
        <p>
          Возможно, она находится в разработке или вы перешли по устаревшей ссылке.
        </p>
        <a href="/library">Вернуться на главную</a>
      </div>
    ),
  },
};

function StaticPage({ pageKey }) {
  const page = STATIC_PAGES[pageKey] || STATIC_PAGES.error;

  return (
    <div className="static-page">
      <h1>{page.title}</h1>
      {page.content}
    </div>
  );
}

export default memo(StaticPage);
