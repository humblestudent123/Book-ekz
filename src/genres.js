export const GENRES = {
  ROMAN: "roman",
  CRIME: "crime",
  ANTIUTOPIA: "antiutopia",
  SATIRE: "satire",
  FANTASY_EPIC: "fantasy_epic",
  FANTASY_HIGH: "fantasy_high",
  SOCIAL_SCI_FI: "social_scifi",
  PHILOSOPHY: "philosophy",
  MAGICAL_REALISM: "magical_realism",
  CLASSIC_PROSE: "classic_prose",
  WAR_NOVEL: "war_novel",
  ANTI_WAR: "anti_war",
  REALISM: "realism",
  HISTORIC_ROMAN: "historic_roman",
  EPIC_POETRY: "epic_poetry"
};


export const GENRE_LABELS = {
  roman: "Роман",
  crime: "Криминальный жанр",
  antiutopia: "Антиутопия",
  satire: "Сатира",
  fantasy_epic: "Эпическое фэнтези",
  fantasy_high: "Высокое фэнтези",
  social_scifi: "Социальная фантастика",
  philosophy: "Философский роман",
  magical_realism: "Магический реализм",
  classic_prose: "Классическая проза",
  war_novel: "Военный роман",
  anti_war: "Антивоенный роман",
  realism: "Реализм",
  historic_roman: "Исторический роман",
  epic_poetry: "Эпическая поэма"
};

export const getGenreLabel = (key) => GENRE_LABELS[key] || key;