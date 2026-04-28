/* src/data.js – способ добавленния книг. */

import { GENRES } from "./genres";


export const SAMPLE_BOOKS = [
  /* ---------- Преступление и наказание ----------  */

  {
    id: 1,
    title: "Преступление и наказание",
    author: "Фёдор Достоевский",
    year: 1866,
    genres: [GENRES.ROMAN, GENRES.CRIME],
    description:
      "Бедный студент Раскольников убивает старуху‑процентщицу…",
      cover: "../covers/Fedor-Dostoevsky-Prestyplenie-i-nakazanie.jpg",
    content: "/books/преступление-и-наказание111.txt",
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
    content: "/books/Дж. Р. Р. Толкин — Властелин колец.txt" 
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
    content: "/books/Markes_Gabriel_Garsia_Sto_let_odinochestva.txt"
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
    content: "/books/Fahrenheit-451.txt"
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
    content: "/books/Булгаков-Михаил-Мастер-и-Маргарита.txt"
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
    content: "/books/Erig-maria-remark-na-zapadnom-fronte.txt"
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
    content: "/books/nad-propastyu-vo-rzhi.txt"
  },



  /* книги */
  // {
  //   id: 5,
  //   title: "...",
  //   author: "...",
  //   year: ...,
  //   genres: [...],
  //   tags: [...],
  //   description: "...",
  //   content: "..." 
  // },



//  КАК ТЕПЕРЬ ДОБАВЛЯТЬ КНИГУ

//  Очень просто:

//   {
//   id: 9,
//   title: "Новая книга",
//   author: "Автор",
//   year: 2026,

//   genres: [
//     GENRES.ROMAN,
//     GENRES.REALISM
//   ],

//   description: "...",
//   cover: "...",
//   content: "..."
// }



];
