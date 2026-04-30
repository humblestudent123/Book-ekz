

import { GENRES } from "./genres";


export const SAMPLE_BOOKS = [
 

  {
    id: 1,
    title: "Преступление и наказание",
    author: "Фёдор Достоевский",
    year: 1866,
    genres: [GENRES.ROMAN, GENRES.CRIME],
    description:
      "Бедный студент Родион Раскольников совершает убийство старухи-процентщицы, чтобы проверить свою теорию о «право имеющих» людях, но в итоге сталкивается с невыносимыми муками совести и находит путь к искуплению через страдание и любовь.",
      cover: "../covers/Fedor-Dostoevsky-Prestyplenie-i-nakazanie.jpg",
    content: "/books/преступление-и-наказание111.txt",
    featured: false,
    isNew: false,
    isPopular: true
  },


  {
    id: 2,
    title: "1984",
    author: "Джордж Оруэлл",
    year: 1949,
    genres: [GENRES.ANTIUTOPIA, GENRES.SATIRE],
    description:
      "Мрачное будущее под властью тоталитарного режима, где «Большой Брат» всегда наблюдает.",
      cover: "/covers/Jorge-Oryel-1984.jpg",
    content: "/books/Оруэлл-Джордж.-1984.txt",
    featured: false,
    isNew: false,
    isPopular: true
  },

  {
    id: 3,
    title: "Дж. Р. Р. Толкин",
    author: "Властелин колец",
    year: 1955,
    genres: [ GENRES.FANTASY_EPIC, GENRES.FANTASY_HIGH ],
  
    description:
      "Хоббит Фродо Бэггинс и его верные спутники отправляются в опасное путешествие через всё Средиземье, чтобы уничтожить древний артефакт абсолютной власти и остановить Тёмного Властелина.",
      cover: "/covers/Vlastelin-Colec.jpg",
    content: "/books/Дж. Р. Р. Толкин — Властелин колец.txt",
    featured: false,
    isNew: true,
    isPopular: false
  },


  {
    id: 4,
    title: "Сто лет одиночества",
    author: "Габриэль Гарсиа Маркес",
    year: 1967,
    genres: [GENRES.MAGICAL_REALISM],
    description:
      "Сага о нескольких поколениях семьи Буэндиа, чья судьба неразрывно связана с мистическим городком Макондо и фатальным, повторяющимся одиночеством.",
      cover: "/covers/Gabriel-Garcia-100let.jpg",
    content: "/books/Markes_Gabriel_Garsia_Sto_let_odinochestva.txt",
    featured: false,
    isNew: true,
    isPopular: false
  },


  {
    id: 5,
    title: "451 градус по Фаренгейту",
    author: "Рэй Брэдбери",
    year: 1953,
    genres: [GENRES.SOCIAL_SCI_FI, GENRES.PHILOSOPHY],
    description:
      "История о пожарном, который в мире запретных знаний перестаёт сжигать книги и начинает их спасать.",
      cover: "/covers/451-gradus-po-foringeity.jpg",
    content: "/books/Fahrenheit-451.txt",
    featured: false,
    isNew: true,
    isPopular: false
  },

  {
    id: 6,
    title: "Мастер и Маргарита",
    author: "Михаил Булгаков",
    year: 1940,
    genres: [GENRES.ROMAN, GENRES.MAGICAL_REALISM, GENRES.SATIRE],
    description:
      "Визит сатаны и его свиты в предвоенную Москву переворачивает жизнь горожан и дает шанс на спасение гениальному автору и его верной возлюбленной.",
      cover: "/covers/master-i-margarita-bulgakov.jpg",
    content: "/books/Булгаков-Михаил-Мастер-и-Маргарита.txt",
    featured: false,
    isNew: false,
    isPopular: true
  },

  {
    id: 7,
    title: "На Западном фронте без перемен",
    author: "Эрих Мария Ремарк",
    year: 1929,
    genres: [ GENRES.WAR_NOVEL,  GENRES.ANTI_WAR,  GENRES.REALISM ],
    tags: ["ПерваяМироваяВойна", "ОкопнаяПравда", "ПотерянноеПоколение"],
    description:
      "История о вчерашних школьниках, которые сталкиваются с беспощадной реальностью Первой мировой войны, превращаясь из восторженных добровольцев в «потерянное поколение» внутри кровавого ада окопов.",
      cover: "/covers/Na-zapodnom-fronte-bez-peremen.jpg",
    content: "/books/Erig-maria-remark-na-zapadnom-fronte.txt",
    featured: true,
    isNew: false,
    isPopular: false
  },


  {
    id: 8,
    title: "Над пропастью во ржи",
    author: "Джером Д. Сэлинджер",
    year: 2004,
    genres: [GENRES.CLASSIC_PROSE],
    tags: ["ПерваяМироваяВойна", "ОкопнаяПравда", "ПотерянноеПоколение"],
    description:
      "История о вчерашних школьниках, которые сталкиваются с беспощадной реальностью Первой мировой войны, превращаясь из восторженных добровольцев в «потерянное поколение» внутри кровавого ада окопов.",
      cover: "/covers/nad_propasiy_rji.jpg",
    content: "/books/nad-propastyu-vo-rzhi.txt",
    featured: true,
    isNew: false,
    isPopular: false
  },


  
  {
    id: 9,
    title: "Тихий Дон",
    author: "Михаил Шолохов",
    year: 1940,
    genres: [GENRES.REALISM],
    tags: ["ТихийДон", "Казачество", "Реализм"],
    description:
      "«Тихий Дон» — масштабная эпопея о трагедии казачества и запретной любви Григория Мелехова в годы Гражданской войны.",
      cover: "/covers/tihiy-don.jpg",
    content: "/books/Шолохов Михаил Александрович. Тихий Дон (Книги 1 и 2).txt",
    featured: true,
    isNew: false,
    isPopular: false
  },



  {
    id: 10,
    title: "Сага о Форсайтах",
    author: "Джон Голсуорси",
    year: 1922,
    genres: [GENRES.REALISM],
    tags: ["Англия", "СемейнаяСага", "Собственничество", "Реализм"],
    description:
      "«Сага о Форсайтах» — монументальный цикл о жизни нескольких поколений буржуазной семьи, запертой в тисках собственнических инстинктов, и о разрушительной силе красоты в мире холодного расчета.",
      cover: "/covers/saga-forsaity.jpg",
    content: "/books/Шолохов Михаил Александрович. Тихий Дон (Книги 1 и 2).txt",
    featured: false,
    isNew: true,
    isPopular: false
  },


  {
    id: 11,
    title: "Отверженные",
    author: "Виктор Гюго",
    year: 1862,
    genres: [GENRES.REALISM], 
    tags: ["ЖанВальжан", "Франция", "Милосердие", "Революция"],
    description:
      "«Отверженные» — грандиозная эпопея о судьбе беглого каторжника Жана Вальжана, силе человеческого духа, борьбе добра со злом и жестокости законов парижского общества.",
      cover: "/covers/gugo-otverjenie.jpg",
      content: "/books/Шолохов Михаил Александрович. Тихий Дон (Книги 1 и 2).txt",
    featured: true,
    isNew: false,
    isPopular: false

  },


{
    id: 12,
    title: "Унесенные ветром. Том 1",
    author: "Маргарет Митчелл",
    year: 1936,
    genres: [GENRES.ROMAN], 
    tags: ["СкарлеттОХара", "ГражданскаяВойна", "США", "Любовь"],
    description:
      "«Унесенные ветром» — легендарный роман о судьбе южанки Скарлетт О’Хара, чья беззаботная молодость оборвалась с началом Гражданской войны в США, заставив ее бороться за выживание, любовь и родное поместье Тара.",
    cover: "/covers/vetrom.jpg",
    content: "/books/vetrom.txt",
    featured: false,
    isNew: false,
    isPopular: true
},

{
    id: 13,
    title: "Жизнь и удивительные приключения Робинзона Крузо",
    author: "Даниэль Дефо",
    year: 1719,
    genres: [GENRES.REALISM], 
    tags: ["НеобитаемыйОстров", "Выживание", "Пятница", "Приключения"],
    description:
      "Знаменитая история о британском моряке, который в результате кораблекрушения оказывается на необитаемом острове и благодаря силе духа, труду и изобретательности выживает там в полном одиночестве на протяжении 28 лет.",
    cover: "/covers/robinzon-kruzo.jpg",
    content: "/books/robinzon-kruzo.txt",
    featured: false,
    isNew: true,
    isPopular: false
},


{
    id: 14, 
    title: "Божественная комедия",
    author: "Данте Алигьери",
    year: 1320, 
    genres: [GENRES.EPIC_POETRY],
    tags: ["Ад", "Чистилище", "Рай", "Беатриче", "Италия"],
    description:
      "Монументальная поэма и вершина средневековой литературы, в которой автор отправляется в грандиозное путешествие по загробному миру через ужасы Ада, испытания Чистилища и блаженство Рая в поисках божественной истины и своей возлюбленной.",
    cover: "/covers/comedia.jpg", 
    content: "/books/Алигьери Данте. Божественная комедия.txt",
    featured: false,
    isNew: true,
    isPopular: false
},




];
