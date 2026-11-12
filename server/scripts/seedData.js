/**
 * Синтетические демоданные. Никаких реальных персональных данных.
 *
 * Каждая настоящая пара "потеряно-найдено" имеет общий seedPairId вида
 * "pair-N" -- по нему строится разметка для скрипта оценки качества
 * (scripts/evaluate.js). Дистракторы -- похожие, но не совпадающие вещи --
 * имеют уникальный seedPairId вида "distractor-N", чтобы никогда не
 * считаться правильным совпадением ни для одной пары.
 *
 * Формулировки внутри одной пары намеренно разные (как писали бы два
 * разных человека о потере и о находке одной и той же вещи), часть пар —
 * межъязыковые (на русском и на английском), чтобы проверить именно
 * многоязычную модель, а не точное совпадение слов.
 */

const CATEGORY = {
  ELECTRONICS: "electronics",
  DOCUMENTS: "documents",
  KEYS: "keys",
  BAGS: "bags",
  CLOTHING: "clothing",
  OTHER: "other",
};

const LOCATIONS = {
  LIBRARY: "Библиотека",
  CAFETERIA: "Столовая",
  HALL: "Холл",
  CLASSROOM: "Аудитория",
  GYM: "Спортивный зал",
};

export const PAIRS = [
  {
    pairId: "pair-1",
    lost: {
      title: "Потерян чёрный iPhone 13",
      description:
        "Вчера днём в библиотеке на втором этаже оставил чёрный iPhone 13 без чехла, на экране небольшая трещина в углу.",
      category: CATEGORY.ELECTRONICS,
      location: LOCATIONS.LIBRARY,
      eventDate: "2026-11-05",
    },
    found: {
      title: "Найден телефон в библиотеке",
      description:
        "На столе у окна на втором этаже библиотеки нашли чёрный смартфон, похоже на iPhone, экран немного треснут с одной стороны.",
      category: CATEGORY.ELECTRONICS,
      location: LOCATIONS.LIBRARY,
      eventDate: "2026-11-05",
    },
  },
  {
    pairId: "pair-2",
    lost: {
      title: "Lost laptop charger",
      description:
        "Left my white laptop charger (MacBook type, USB-C) in the cafeteria near the window seats yesterday evening.",
      category: CATEGORY.ELECTRONICS,
      location: LOCATIONS.CAFETERIA,
      eventDate: "2026-11-08",
    },
    found: {
      title: "Found a charger in the cafeteria",
      description:
        "Someone left a white USB-C power adapter with a cable on one of the tables near the windows in the cafeteria.",
      category: CATEGORY.ELECTRONICS,
      location: LOCATIONS.CAFETERIA,
      eventDate: "2026-11-08",
    },
  },
  {
    pairId: "pair-3",
    lost: {
      title: "Потерян студенческий билет",
      description:
        "Потеряла студенческий билет Нархоз где-то в холле главного корпуса, была утром на входе, фамилия начинается на И.",
      category: CATEGORY.DOCUMENTS,
      location: LOCATIONS.HALL,
      eventDate: "2026-11-02",
    },
    found: {
      title: "Нашли студенческий билет в холле",
      description:
        "Подняли с пола в холле корпуса пластиковую карточку студента Narxoz University, лежала у турникетов утром.",
      category: CATEGORY.DOCUMENTS,
      location: LOCATIONS.HALL,
      eventDate: "2026-11-02",
    },
  },
  {
    pairId: "pair-4",
    lost: {
      title: "Потеряна зачётная книжка",
      description:
        "Забыла зачётку в аудитории после пары, синяя обложка, лежала на последней парте у окна.",
      category: CATEGORY.DOCUMENTS,
      location: LOCATIONS.CLASSROOM,
      eventDate: "2026-11-10",
    },
    found: {
      title: "Найдена зачётная книжка в аудитории",
      description:
        "После занятий на задней парте у окна осталась небольшая синяя книжка с записями об оценках, забрал на хранение.",
      category: CATEGORY.DOCUMENTS,
      location: LOCATIONS.CLASSROOM,
      eventDate: "2026-11-10",
    },
  },
  {
    pairId: "pair-5",
    lost: {
      title: "Lost car keys",
      description:
        "Dropped my car keys somewhere near the gym entrance, they have a black leather keychain with a small silver star.",
      category: CATEGORY.KEYS,
      location: LOCATIONS.GYM,
      eventDate: "2026-11-01",
    },
    found: {
      title: "Found keys near the gym",
      description:
        "Picked up a bunch of keys by the sports hall doors, attached to a dark leather fob with a tiny metal star charm.",
      category: CATEGORY.KEYS,
      location: LOCATIONS.GYM,
      eventDate: "2026-11-01",
    },
  },
  {
    pairId: "pair-6",
    lost: {
      title: "Потеряны ключи от квартиры",
      description:
        "Потерял связку ключей от квартиры в столовой, на кольце синий брелок в виде ленты.",
      category: CATEGORY.KEYS,
      location: LOCATIONS.CAFETERIA,
      eventDate: "2026-10-28",
    },
    found: {
      title: "Нашла ключи в столовой",
      description:
        "На одном из столиков в столовой лежала связка ключей с голубым текстильным брелоком-лентой, передала на вахту.",
      category: CATEGORY.KEYS,
      location: LOCATIONS.CAFETERIA,
      eventDate: "2026-10-29",
    },
  },
  {
    pairId: "pair-7",
    lost: {
      title: "Потерян чёрный рюкзак с ноутбуком",
      description:
        "Оставила чёрный рюкзак с ноутбуком внутри в аудитории после пары, очень срочно нужен, внутри учебные тетради.",
      category: CATEGORY.BAGS,
      location: LOCATIONS.CLASSROOM,
      eventDate: "2026-11-06",
    },
    found: {
      title: "Found a backpack with a laptop inside",
      description:
        "A black backpack was left behind in one of the classrooms after class, there is a laptop and some notebooks inside.",
      category: CATEGORY.BAGS,
      location: LOCATIONS.CLASSROOM,
      eventDate: "2026-11-06",
    },
  },
  {
    pairId: "pair-8",
    lost: {
      title: "Lost sports bag",
      description:
        "Left my grey sports duffel bag in the gym changing room, has my training clothes and a water bottle inside.",
      category: CATEGORY.BAGS,
      location: LOCATIONS.GYM,
      eventDate: "2026-11-09",
    },
    found: {
      title: "Found a duffel bag in the locker room",
      description:
        "There is a grey gym bag sitting on the bench in the changing room, contains workout clothes and a bottle of water.",
      category: CATEGORY.BAGS,
      location: LOCATIONS.GYM,
      eventDate: "2026-11-09",
    },
  },
  {
    pairId: "pair-9",
    lost: {
      title: "Потеряна чёрная зимняя куртка",
      description:
        "Повесила чёрную зимнюю куртку на вешалку в холле и забыла забрать, с капюшоном, размер S.",
      category: CATEGORY.CLOTHING,
      location: LOCATIONS.HALL,
      eventDate: "2026-11-03",
    },
    found: {
      title: "Найдена куртка в холле",
      description:
        "В холле на вешалке осталась чёрная куртка с капюшоном, небольшого размера, никто не забрал до конца дня.",
      category: CATEGORY.CLOTHING,
      location: LOCATIONS.HALL,
      eventDate: "2026-11-03",
    },
  },
  {
    pairId: "pair-10",
    lost: {
      title: "Lost a scarf and a hat",
      description:
        "Left a grey knitted scarf together with a matching hat on a chair in the cafeteria during lunch.",
      category: CATEGORY.CLOTHING,
      location: LOCATIONS.CAFETERIA,
      eventDate: "2026-10-30",
    },
    found: {
      title: "Нашли шарф и шапку в столовой",
      description:
        "На одном из стульев в столовой остался серый вязаный шарф и шапка в тон, сложены вместе.",
      category: CATEGORY.CLOTHING,
      location: LOCATIONS.CAFETERIA,
      eventDate: "2026-10-30",
    },
  },
];

/** Похожие, но не совпадающие объявления -- чтобы поиск не был тривиальным. */
export const DISTRACTORS = [
  {
    seedPairId: "distractor-1",
    type: "lost",
    title: "Потерян белый iPhone 14",
    description: "Потерял белый iPhone 14 с голубым чехлом где-то в аудитории на третьем этаже.",
    category: CATEGORY.ELECTRONICS,
    location: LOCATIONS.CLASSROOM,
    eventDate: "2026-11-04",
  },
  {
    seedPairId: "distractor-2",
    type: "found",
    title: "Found wireless earbuds",
    description: "A pair of white wireless earbuds in a small case was left on a bench in the gym.",
    category: CATEGORY.ELECTRONICS,
    location: LOCATIONS.GYM,
    eventDate: "2026-11-07",
  },
  {
    seedPairId: "distractor-3",
    type: "found",
    title: "Найден чужой студенческий билет",
    description: "В аудитории на полу нашли студенческий билет другого факультета, фамилия на К.",
    category: CATEGORY.DOCUMENTS,
    location: LOCATIONS.CLASSROOM,
    eventDate: "2026-11-01",
  },
  {
    seedPairId: "distractor-4",
    type: "lost",
    title: "Lost a passport copy",
    description: "Dropped a folder with a photocopy of my passport somewhere near the library entrance.",
    category: CATEGORY.DOCUMENTS,
    location: LOCATIONS.LIBRARY,
    eventDate: "2026-10-27",
  },
  {
    seedPairId: "distractor-5",
    type: "lost",
    title: "Потеряны ключи от велосипеда",
    description: "Потерял маленький ключ от велосипедного замка, был на красном шнурке, в холле.",
    category: CATEGORY.KEYS,
    location: LOCATIONS.HALL,
    eventDate: "2026-11-02",
  },
  {
    seedPairId: "distractor-6",
    type: "found",
    title: "Found a single key",
    description: "A single small key without any keychain was found on the floor in the cafeteria.",
    category: CATEGORY.KEYS,
    location: LOCATIONS.CAFETERIA,
    eventDate: "2026-11-05",
  },
  {
    seedPairId: "distractor-7",
    type: "lost",
    title: "Потерян серый рюкзак",
    description: "Потеряла серый рюкзак, внутри были спортивная форма и бутылка воды, была в спортзале.",
    category: CATEGORY.BAGS,
    location: LOCATIONS.GYM,
    eventDate: "2026-11-09",
  },
  {
    seedPairId: "distractor-8",
    type: "found",
    title: "Found a small handbag",
    description: "A small brown handbag with a long strap was left in the library reading room.",
    category: CATEGORY.BAGS,
    location: LOCATIONS.LIBRARY,
    eventDate: "2026-10-31",
  },
  {
    seedPairId: "distractor-9",
    type: "lost",
    title: "Потерян синий шарф",
    description: "Потерял тёмно-синий шарф без шапки, скорее всего в аудитории после последней пары.",
    category: CATEGORY.CLOTHING,
    location: LOCATIONS.CLASSROOM,
    eventDate: "2026-11-06",
  },
  {
    seedPairId: "distractor-10",
    type: "found",
    title: "Found a jacket in the gym",
    description: "A blue sports jacket, size M, was left hanging in the gym changing room.",
    category: CATEGORY.CLOTHING,
    location: LOCATIONS.GYM,
    eventDate: "2026-11-08",
  },
];
