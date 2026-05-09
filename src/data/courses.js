import { GENRES } from '../genres';

const COURSE_COVER_BASE = `${process.env.PUBLIC_URL || ''}/course-covers`;
const coverUrl = (filename) => `${COURSE_COVER_BASE}/${filename}`;

export const COURSES = [
  {
    id: 'frontend-react',
    title: 'React: современная разработка интерфейсов',
    author: 'ReadNext Academy',
    category: GENRES.FRONTEND,
    image: coverUrl('frontend-react.png'),
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
    image: coverUrl('frontend-ui-systems.png'),
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
    image: coverUrl('backend-node.png'),
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
    image: coverUrl('algorithms-foundation.png'),
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
    image: coverUrl('philosophy-critical-thinking.png'),
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
    image: coverUrl('fantasy-worldbuilding.png'),
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
    image: coverUrl('antiutopia-media.png'),
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
    image: coverUrl('realism-literature.png'),
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
    image: coverUrl('history-roman.png'),
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
    image: coverUrl('magical-realism.png'),
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
    image: coverUrl('adventure-storytelling.png'),
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
    image: coverUrl('family-saga.png'),
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
    image: coverUrl('classic-reading.png'),
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
    image: coverUrl('satire-language.png'),
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
    image: coverUrl('learning-roadmap.png'),
    lessons: 12,
    duration: '4 часа',
    rating: 4.6,
    description:
      'Как сочетать книги и курсы, вести прогресс и строить учебный план без перегруза.',
  },
];
