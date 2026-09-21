// Booklet copy, extracted verbatim from the Claude Design export.
import type { Lang } from './themes';

export interface CoverCopy {
  city: string; echo: string; issue: string; deck: string; inside: string;
  dedication: string; items: { title: string; page: string }[];
  hA: number; hB: number; hC: number;
}
export interface DayCopy {
  section: string; date: string; dayLabel: string; num: string; title: string;
  echo: string; walk: string; notes: string; credit: string; intro: string;
  stops: { n: string; slot: string; name: string; meta: string; blurb: string }[];
}
export interface PlaceItem {
  n: string; name: string; cat: string; addr: string; hours: string;
  hasHours: boolean; hasPhoto: boolean; duo?: string; bw?: string; blurb: string;
}
export interface PlacesCopy {
  section: string; page: string; echo: string; hours: string; dir: string;
  places: PlaceItem[];
}

export const COVER_LISBON: Record<Lang, CoverCopy> = {
  "en": {
    "city": "LISBON",
    "echo": "Lisboa",
    "issue": "Issue: Lisboa · 4 days · October 2026 · 18–24 °C",
    "deck": "Tiles, trams and a pastel de nata a day",
    "inside": "Inside",
    "dedication": "For Olia — happy birthday",
    "items": [
      {
        "title": "A city that climbs",
        "page": "02"
      },
      {
        "title": "Day by day",
        "page": "04"
      },
      {
        "title": "What, where",
        "page": "12"
      }
    ],
    "hA": 160,
    "hB": 104,
    "hC": 170
  },
  "uk": {
    "city": "ЛІСАБОН",
    "echo": "Lisboa",
    "issue": "Випуск: Lisboa · 4 дні · жовтень 2026 · 18–24 °C",
    "deck": "Плитка, трамваї і паштел-де-ната щодня",
    "inside": "Зміст",
    "dedication": "Для Олі — з днем народження",
    "items": [
      {
        "title": "Місто, що дереться вгору",
        "page": "02"
      },
      {
        "title": "День за днем",
        "page": "04"
      },
      {
        "title": "Що, де",
        "page": "12"
      }
    ],
    "hA": 134,
    "hB": 86,
    "hC": 142
  }
};

export const COVER_TOKYO: Record<Lang, CoverCopy> = {
  "en": {
    "city": "TOKYO",
    "echo": "東京",
    "issue": "Issue: 東京 · 4 days · April 2027 · 12–19 °C",
    "deck": "Lanterns, towers and a konbini snack at midnight",
    "inside": "Inside",
    "dedication": "",
    "items": [
      {
        "title": "Lanterns and alleys",
        "page": "02"
      },
      {
        "title": "Day by day",
        "page": "04"
      },
      {
        "title": "What, where",
        "page": "12"
      }
    ],
    "hA": 190,
    "hB": 118,
    "hC": 180
  },
  "uk": {
    "city": "ТОКІО",
    "echo": "東京",
    "issue": "Випуск: 東京 · 4 дні · квітень 2027 · 12–19 °C",
    "deck": "Ліхтарі, вежі й нічний снек із конбіні",
    "inside": "Зміст",
    "dedication": "",
    "items": [
      {
        "title": "Ліхтарі та провулки",
        "page": "02"
      },
      {
        "title": "День за днем",
        "page": "04"
      },
      {
        "title": "Що, де",
        "page": "12"
      }
    ],
    "hA": 200,
    "hB": 128,
    "hC": 190
  }
};

export const DAY_ALFAMA: Record<Lang, DayCopy> = {
  "en": {
    "section": "Lisbon · Day 02",
    "date": "TUE 20 OCT",
    "dayLabel": "Day",
    "num": "02",
    "title": "Alfama and the viewpoints",
    "echo": "Lisboa",
    "walk": "Today’s walk",
    "notes": "Notes",
    "credit": "© OpenStreetMap contributors",
    "intro": "Alfama is Lisbon’s oldest tangle of lanes, and the best way through it is uphill first. Start at the castle, drift down through the lanes to a viewpoint, and end the day with dinner and fado. Wear good shoes.",
    "stops": [
      {
        "n": "04",
        "slot": "Morning",
        "name": "Castelo de São Jorge",
        "meta": "Castle · Alfama",
        "blurb": "Go early, before the tour groups. Walk the walls, then just sit: the whole grid of Baixa lies below you, with the river beyond."
      },
      {
        "n": "05",
        "slot": "Afternoon",
        "name": "Miradouro de Santa Luzia",
        "meta": "Viewpoint · Alfama",
        "blurb": "A small terrace draped in bougainvillea and framed by blue tiles. Come for the red rooftops and the river, stay for a coffee nearby."
      },
      {
        "n": "06",
        "slot": "Evening",
        "name": "Fado dinner",
        "meta": "Jantar de fado · Alfama",
        "blurb": "Book ahead and go late. Dinner comes first, then the lights drop and the guitar starts. Keep your phone in your pocket."
      }
    ]
  },
  "uk": {
    "section": "Лісабон · День 02",
    "date": "ВТ 20 ЖОВТ",
    "dayLabel": "День",
    "num": "02",
    "title": "Алфама і краєвиди",
    "echo": "Lisboa",
    "walk": "Маршрут дня",
    "notes": "Нотатки",
    "credit": "© OpenStreetMap contributors",
    "intro": "Алфама — найстарший клубок лісабонських провулків, і найкраще проходити його спершу вгору. Почніть із замку, спустіться провулками до оглядового майданчика й завершіть день вечерею з фаду. Візьміть зручне взуття.",
    "stops": [
      {
        "n": "04",
        "slot": "Ранок",
        "name": "Castelo de São Jorge",
        "meta": "Замок · Алфама",
        "blurb": "Приходьте рано, поки немає екскурсій. Пройдіться стінами, а тоді просто сядьте: усю Байшу видно як на долоні, а за нею — річку."
      },
      {
        "n": "05",
        "slot": "День",
        "name": "Miradouro de Santa Luzia",
        "meta": "Оглядовий майданчик · Алфама",
        "blurb": "Невелика тераса, обвита бугенвілеєю й обрамлена блакитною плиткою. Приходьте по червоні дахи й річку, лишайтесь по каву поруч."
      },
      {
        "n": "06",
        "slot": "Вечір",
        "name": "Fado dinner",
        "meta": "Jantar de fado · Алфама",
        "blurb": "Бронюйте заздалегідь і приходьте пізно. Спершу вечеря, потім згасає світло й починає грати гітара. Телефон — у кишеню."
      }
    ]
  }
};

export const PLACES_LISBON: Record<Lang, PlacesCopy> = {
  "en": {
    "section": "What, where",
    "page": "12",
    "echo": "Lisboa",
    "hours": "Hours",
    "dir": "Directions",
    "places": [
      {
        "n": "01",
        "name": "Miradouro da Senhora do Monte",
        "cat": "Viewpoint · Graça",
        "addr": "Rua da Senhora do Monte",
        "hours": "Daily [10:00–18:00]",
        "hasHours": true,
        "hasPhoto": true,
        "duo": "/assets/lisbon-rooftops-river-duotone.jpg",
        "bw": "/assets/lisbon-rooftops-river-bw.jpg",
        "blurb": "The highest viewpoint in town and the least rushed. Come twenty minutes before sunset and claim a spot on the wall."
      },
      {
        "n": "02",
        "name": "Pastéis de Belém",
        "cat": "Pastry shop · Belém",
        "addr": "Rua de Belém",
        "hours": "",
        "hasHours": false,
        "hasPhoto": true,
        "duo": "/assets/lisbon-bridge-duotone.jpg",
        "bw": "/assets/lisbon-bridge-bw.jpg",
        "blurb": "Yes, there’s a queue. It moves fast. Eat two warm, one with cinnamon, standing by the counter."
      },
      {
        "n": "03",
        "name": "Museu Nacional do Azulejo",
        "cat": "Museum · Madre de Deus",
        "addr": "Rua da Madre de Deus",
        "hours": "Tue–Sun [10:00–18:00]",
        "hasHours": true,
        "hasPhoto": false,
        "blurb": "Five centuries of tiles in a former convent. The long panorama of pre-earthquake Lisbon is the reason to come."
      }
    ]
  },
  "uk": {
    "section": "Що, де",
    "page": "12",
    "echo": "Lisboa",
    "hours": "Години роботи",
    "dir": "Дорога",
    "places": [
      {
        "n": "01",
        "name": "Miradouro da Senhora do Monte",
        "cat": "Оглядовий майданчик · Граса",
        "addr": "Rua da Senhora do Monte",
        "hours": "Щодня [10:00–18:00]",
        "hasHours": true,
        "hasPhoto": true,
        "duo": "/assets/lisbon-rooftops-river-duotone.jpg",
        "bw": "/assets/lisbon-rooftops-river-bw.jpg",
        "blurb": "Найвищий оглядовий майданчик міста і найспокійніший. Приходьте за двадцять хвилин до заходу сонця й займайте місце на парапеті."
      },
      {
        "n": "02",
        "name": "Pastéis de Belém",
        "cat": "Кондитерська · Белень",
        "addr": "Rua de Belém",
        "hours": "",
        "hasHours": false,
        "hasPhoto": true,
        "duo": "/assets/lisbon-bridge-duotone.jpg",
        "bw": "/assets/lisbon-bridge-bw.jpg",
        "blurb": "Так, тут черга. Вона рухається швидко. З’їжте два теплих, одне з корицею, просто біля стійки."
      },
      {
        "n": "03",
        "name": "Museu Nacional do Azulejo",
        "cat": "Музей · Мадре-де-Деуш",
        "addr": "Rua da Madre de Deus",
        "hours": "Вт–Нд [10:00–18:00]",
        "hasHours": true,
        "hasPhoto": false,
        "blurb": "П’ять століть плитки в колишньому монастирі. Довга панорама Лісабона до землетрусу — головна причина прийти."
      }
    ]
  }
};

