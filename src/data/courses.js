import { GENRES } from '../genres';

export const COURSES = [
  {
    id: 'frontend-react',
    title: 'React: современная разработка интерфейсов',
    author: 'ReadNext Academy',
    category: GENRES.FRONTEND,
    image:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200&auto=format&fit=crop',
    lessons: 42,
    duration: '18 часов',
    rating: 4.9,
    description:
      'Практический курс по компонентной архитектуре, hooks, роутингу, состоянию и production-подходу к React-приложениям.',
  },
  {
    id: 'frontend-ui-systems',
    title: 'UI-системы и дизайн интерфейсов',
    author: 'Мария Орлова',
    category: GENRES.FRONTEND,
    image:
      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1200&auto=format&fit=crop',
    lessons: 30,
    duration: '12 часов',
    rating: 4.8,
    description:
      'Как проектировать переиспользуемые компоненты, сетки, состояния, адаптивность и визуальный язык продукта.',
  },
  {
    id: 'backend-node',
    title: 'Backend на Node.js без лишней магии',
    author: 'Алексей Морозов',
    category: GENRES.BACKEND,
    image:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
    lessons: 38,
    duration: '16 часов',
    rating: 4.7,
    description:
      'HTTP, REST, авторизация, работа с данными и архитектура серверной части для frontend-разработчиков.',
  },
  {
    id: 'algorithms-foundation',
    title: 'Алгоритмы для собеседований и реальных задач',
    author: 'Игорь Ковалев',
    category: GENRES.ALGORITHMS,
    image:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop',
    lessons: 48,
    duration: '22 часа',
    rating: 4.9,
    description:
      'Структуры данных, сложность, графы, динамическое программирование и задачи с понятными разбором и практикой.',
  },
  {
    id: 'philosophy-critical-thinking',
    title: 'Критическое мышление и философия выбора',
    author: 'Елена Соколова',
    category: GENRES.PHILOSOPHY,
    image:
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1200&auto=format&fit=crop',
    lessons: 24,
    duration: '9 часов',
    rating: 4.8,
    description:
      'Философские идеи, которые помогают читать сложные тексты, спорить честнее и принимать решения осознаннее.',
  },
  {
    id: 'fantasy-worldbuilding',
    title: 'Миростроение в фэнтези',
    author: 'Антон Лисин',
    category: GENRES.FANTASY_EPIC,
    image:
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=1200&auto=format&fit=crop',
    lessons: 26,
    duration: '10 часов',
    rating: 4.6,
    description:
      'Создание культур, карт, магических систем и конфликтов для больших эпических историй.',
  },
  {
    id: 'antiutopia-media',
    title: 'Антиутопии: власть, язык и медиа',
    author: 'Ольга Данилова',
    category: GENRES.ANTIUTOPIA,
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
    lessons: 18,
    duration: '7 часов',
    rating: 4.7,
    description:
      'Разбор антиутопий через темы контроля, пропаганды, наблюдения и устройства общества будущего.',
  },
  {
    id: 'realism-literature',
    title: 'Реализм: как читать социальный роман',
    author: 'Никита Воронов',
    category: GENRES.REALISM,
    image:
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop',
    lessons: 20,
    duration: '8 часов',
    rating: 4.5,
    description:
      'Исторический контекст, психологизм, конфликт личности и общества, приемы анализа классической прозы.',
  },
  {
    id: 'history-roman',
    title: 'Исторический роман: эпоха как герой',
    author: 'Вера Каменская',
    category: GENRES.HISTORIC_ROMAN,
    image:
      'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1200&auto=format&fit=crop',
    lessons: 22,
    duration: '9 часов',
    rating: 4.6,
    description:
      'Как авторы соединяют документальность, сюжет и частную судьбу на фоне больших исторических событий.',
  },
  {
    id: 'magical-realism',
    title: 'Магический реализм: невозможное как норма',
    author: 'Софья Рамирес',
    category: GENRES.MAGICAL_REALISM,
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop',
    lessons: 19,
    duration: '7 часов',
    rating: 4.8,
    description:
      'Курс о повествовании, где бытовая реальность и чудо живут в одном пространстве без объяснений.',
  },
  {
    id: 'adventure-storytelling',
    title: 'Приключенческий сюжет: темп, риск, путь',
    author: 'Дмитрий Нестеров',
    category: GENRES.ADVENTURE,
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    lessons: 21,
    duration: '8 часов',
    rating: 4.5,
    description:
      'Как строить путешествие героя, держать напряжение и превращать препятствия в развитие персонажа.',
  },
  {
    id: 'family-saga',
    title: 'Семейная сага: поколения, память, конфликт',
    author: 'Ксения Белова',
    category: GENRES.FAMILY_SAGA,
    image:
      'https://images.unsplash.com/photo-1519682577862-22b62b24e493?q=80&w=1200&auto=format&fit=crop',
    lessons: 17,
    duration: '6 часов',
    rating: 4.4,
    description:
      'Разбор семейных хроник, наследуемых травм, повторяющихся мотивов и больших романных структур.',
  },
  {
    id: 'classic-reading',
    title: 'Как читать классику без страха',
    author: 'ReadNext Academy',
    category: GENRES.CLASSIC_PROSE,
    image:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200&auto=format&fit=crop',
    lessons: 16,
    duration: '5 часов',
    rating: 4.7,
    description:
      'Медленное чтение, работа с контекстом, заметками, цитатами и личной интерпретацией сложных текстов.',
  },
  {
    id: 'satire-language',
    title: 'Сатира и язык иронии',
    author: 'Павел Ершов',
    category: GENRES.SATIRE,
    image:
      'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=1200&auto=format&fit=crop',
    lessons: 14,
    duration: '5 часов',
    rating: 4.3,
    description:
      'Инструменты сатиры, гротеск, скрытая критика и способы видеть второй слой текста.',
  },
  {
    id: 'learning-roadmap',
    title: 'Личная образовательная траектория',
    author: 'ReadNext Lab',
    category: GENRES.ETC,
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
    lessons: 12,
    duration: '4 часа',
    rating: 4.6,
    description:
      'Как сочетать книги и курсы, вести прогресс и строить учебный план без перегруза.',
  },
];
