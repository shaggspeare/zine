// Landing page copy, EN and UA (spec section 14.1). The Ukrainian is a working
// translation and needs a native review, like the booklet copy.
import type { Lang } from './themes';

export interface MarketingCopy {
  nav: { samples: string; how: string; faq: string; other: string };
  hero: {
    kicker: string; headline: string; deck: string; cta: string; placeholder: string;
    note: string; thanks: string; duplicate: string; invalid: string; error: string;
  };
  how: { title: string; steps: [string, string][] };
  samples: { title: string; deck: string; reading: string; print: string; view: string };
  photo: { title: string; deck: string; cta: string; hint: string };
  price: {
    title: string; free: string; freeBody: string; paid: string; paidBody: string;
    per: string; cta: string; reserved: string; honest: string;
  };
  faq: { title: string; items: [string, string][] };
  footer: { credits: string; placeholder: string };
}

export const MARKETING: Record<Lang, MarketingCopy> = {
  en: {
    nav: { samples: 'Samples', how: 'How it works', faq: 'FAQ', other: 'Українською' },
    hero: {
      kicker: 'Before the trip',
      headline: 'Your trip, printed like a magazine',
      deck: 'Tell us where you are going. We design a small A5 guide to your days, you print it at home on one sheet of A4, fold it, and put it in a pocket. No signal, no battery, no tabs.',
      cta: 'Join the waitlist',
      placeholder: 'you@example.com',
      note: 'One email when it opens. Nothing else.',
      thanks: 'You are on the list. We will write once, when it opens.',
      duplicate: 'You are already on the list.',
      invalid: 'That does not look like an email address.',
      error: 'Something went wrong. Try again in a moment.',
    },
    how: {
      title: 'How it works',
      steps: [
        ['Tell us your trip', 'City, dates, how fast you like to move, and what you care about: markets, viewpoints, quiet churches.'],
        ['We design your guide', 'Days split into morning, afternoon and evening, with real addresses, hours where we have them, and maps.'],
        ['Print, fold, go', 'Two PDFs: one to read on the phone, one imposed for A4 duplex. Fold, staple twice, done.'],
      ],
    },
    samples: {
      title: 'Three samples',
      deck: 'Real output from the renderer, not mockups. Flip through, or take the PDFs.',
      reading: 'Reading PDF',
      print: 'Print A4',
      view: 'Flip through',
    },
    photo: {
      title: 'Printed one?',
      deck: 'We want to see it on a real table. Send a photo and we will put the good ones on this page, with your name if you want it.',
      cta: 'Send a photo',
      hint: 'Opens your mail app.',
    },
    price: {
      title: 'What it will cost',
      free: 'Free',
      freeBody: 'Up to two days, eight pages, full print quality. Always.',
      paid: 'Full trip',
      paidBody: 'Up to five days, twenty pages, curated city themes, your own photos.',
      per: 'per trip',
      cta: 'Reserve this price',
      reserved: 'Noted. You will get this price when it opens.',
      honest: 'Not live yet. The button tells us the price is right.',
    },
    faq: {
      title: 'Questions',
      items: [
        ['Does it work without signal?', 'It is paper. That is the point. The QR codes need a phone, everything else does not.'],
        ['What printer do I need?', 'Any home printer that does double-sided, or one where you can flip the stack yourself. Plain A4 is fine; 100–120 gsm feels like a magazine.'],
        ['Which cities?', 'We are starting with a handful in Europe where the open map data is good enough to trust. The waitlist decides the order.'],
        ['Which languages?', 'The booklet comes in English or Ukrainian. Place names stay in the local language, so signs still match.'],
        ['Where do the places come from?', 'OpenStreetMap and Overture, not invented. The writing is ours; the addresses and hours are data.'],
      ],
    },
    footer: {
      credits: 'Photographs by their authors, see each booklet colophon. Map data © OpenStreetMap contributors.',
      placeholder: 'Sample content: hours and dates are placeholders, not verified facts.',
    },
  },

  uk: {
    nav: { samples: 'Зразки', how: 'Як це працює', faq: 'Питання', other: 'In English' },
    hero: {
      kicker: 'Перед подорожжю',
      headline: 'Ваша подорож, надрукована як журнал',
      deck: 'Скажіть, куди їдете. Ми зробимо невеликий путівник A5 на ваші дні, ви надрукуєте його вдома на аркуші A4, складете й покладете в кишеню. Без мережі, без батареї, без вкладок.',
      cta: 'Долучитися до списку',
      placeholder: 'you@example.com',
      note: 'Один лист, коли запустимося. Більше нічого.',
      thanks: 'Ви у списку. Напишемо один раз, коли запустимося.',
      duplicate: 'Ви вже у списку.',
      invalid: 'Це не схоже на адресу пошти.',
      error: 'Щось пішло не так. Спробуйте ще раз за мить.',
    },
    how: {
      title: 'Як це працює',
      steps: [
        ['Розкажіть про подорож', 'Місто, дати, темп і те, що вам цікаво: ринки, краєвиди, тихі церкви.'],
        ['Ми зробимо путівник', 'Дні поділені на ранок, день і вечір, зі справжніми адресами, годинами роботи, де вони є, і картами.'],
        ['Надрукуйте, складіть, ідіть', 'Два PDF: один читати з телефона, другий зверстаний під двобічний друк на A4. Скласти, зшити двома скобами, готово.'],
      ],
    },
    samples: {
      title: 'Три зразки',
      deck: 'Це справжній результат рендерера, а не макети. Погортайте або заберіть PDF.',
      reading: 'PDF для читання',
      print: 'Друк A4',
      view: 'Погортати',
    },
    photo: {
      title: 'Надрукували?',
      deck: 'Хочемо побачити це на справжньому столі. Надішліть фото — найкращі поставимо на цю сторінку, з вашим іменем, якщо схочете.',
      cta: 'Надіслати фото',
      hint: 'Відкриє вашу поштову програму.',
    },
    price: {
      title: 'Скільки це коштуватиме',
      free: 'Безкоштовно',
      freeBody: 'До двох днів, вісім сторінок, повна якість друку. Завжди.',
      paid: 'Уся подорож',
      paidBody: 'До п’яти днів, двадцять сторінок, міські теми, власні світлини.',
      per: 'за подорож',
      cta: 'Зарезервувати ціну',
      reserved: 'Записали. Ви отримаєте цю ціну на старті.',
      honest: 'Ще не запущено. Кнопка каже нам, що ціна влучна.',
    },
    faq: {
      title: 'Питання',
      items: [
        ['Чи працює це без мережі?', 'Це папір. У цьому й суть. QR-коди потребують телефона, усе інше — ні.'],
        ['Який принтер потрібен?', 'Будь-який домашній, що друкує з двох боків, або такий, де ви самі перевернете стос. Звичайний A4 годиться; 100–120 г/м² відчувається як журнал.'],
        ['Які міста?', 'Починаємо з кількох європейських, де відкритим картографічним даним можна довіряти. Список очікування визначить черговість.'],
        ['Які мови?', 'Буклет буває англійською або українською. Назви місць лишаються місцевою мовою, щоб збігалися з вивісками.'],
        ['Звідки беруться місця?', 'З OpenStreetMap і Overture, а не з вигадок. Тексти наші; адреси й години — це дані.'],
      ],
    },
    footer: {
      credits: 'Світлини — їхніх авторів, див. вихідні дані кожного буклета. Картографічні дані © OpenStreetMap contributors.',
      placeholder: 'Зразковий вміст: години й дати — заповнювачі, а не перевірені дані.',
    },
  },
};

/** Price shown in the fake door. Not charged: nothing is live (spec section 14.1). */
export const FAKE_DOOR_PRICE = { amount: 7, currency: 'USD', display: '$7' };
