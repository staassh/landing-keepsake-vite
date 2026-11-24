# Keepsake — Responsive Landing Page (Vite + Pug + Modular SCSS)

🔗 **Live Demo (GitHub Pages):** https://staassh.github.io/landing-keepsake-vite/

Автоматизована статична верстка односторінкового сайту агентства **Keepsake** (макет із Лабораторної роботи №7), переведена на сучасний стек розробки: **Vite**, **Pug**, модульний **SCSS (БЕМ)**, **PostCSS (Autoprefixer + Browserslist)**, генерацію адаптивних зображень **AVIF / WebP / JPEG** через **Sharp** та автоматичний контроль якості коду (**Prettier**, **Stylelint**, **husky**, **lint-staged**).

---

## Вимоги до середовища та команди

- **Node.js:** v20 LTS або новіша (`node -v`)
- **npm:** v10+ (`npm -v`)

```bash
# 1. Встановлення залежностей (також автоматично ініціалізує husky)
npm install

# 2. Генерація адаптивних зображень AVIF, WebP і JPEG у ширинах 400w та 800w
npm run images

# 3. Запуск локального сервера розробки
npm run dev

# 4. Продакшн-збірка у папку dist/ (HTML + мініфікований CSS із префіксами)
npm run build

# 5. Локальний перегляд зібраної продакшн-версії
npm run preview

# 6. Форматування коду (Prettier + @prettier/plugin-pug)
npm run format

# 7. Перевірка якості стилів та форматування (Stylelint + Prettier)
npm run lint
```

---

## Структура проєкту

```text
landing-keepsake-vite/
├── .github/workflows/deploy.yml   # CI/CD збірка та публікація на GitHub Pages
├── .husky/pre-commit              # Pre-commit хук (npx lint-staged)
├── public/assets/images/          # Згенеровані AVIF, WebP та JPEG (400w і 800w)
├── scripts/optimize-images.js     # Sharp-скрипт конвертації та ресайзу зображень
├── src/
│   ├── assets/
│   │   ├── fonts/                 # Каталог для локальних WOFF2-шрифтів
│   │   └── images/raw/            # Вихідні растрові зображення портфоліо
│   ├── components/
│   │   ├── header.pug             # Шапка та мобільне меню без JS (<details>)
│   │   ├── footer.pug             # Футер із формою підписки (:has/:user-invalid)
│   │   └── sections/              # Секції: hero, works, cta, services, stats, clients, journal
│   ├── data/                      # Дані секцій у вигляді масивів об'єктів (Pug)
│   ├── includes/                  # Підключувані блоки (head.pug)
│   ├── layouts/                   # Базовий макет main.pug (block, extends)
│   ├── mixins/                    # Pug-міксини: +btn, +icon, +picture, +work-card, +section-title
│   ├── pages/                     # Точка входу сторінок (index.pug)
│   └── styles/
│       ├── abstracts/             # Змінні, функція rem(), міксини mq(), flex-center, focus-ring
│       ├── base/                  # Генерація :root через @each, reset, хелпери
│       ├── layout/                # Контейнер, сітки секцій, header, footer
│       ├── components/            # Окремі БЕМ-блоки (_btn, _hero, _works, _services тощо)
│       └── main.scss              # Єдина точка входу стилів
├── .browserslistrc                # Цільові браузери для Autoprefixer
├── .prettierrc                    # Конфігурація Prettier + @prettier/plugin-pug
├── .stylelintrc.json              # Правила Stylelint під БЕМ і вкладеність <= 3
├── postcss.config.js              # Підключення Autoprefixer
└── vite.config.js                 # Конфігурація Vite + Vituum + Pug (base для GitHub Pages)
```

---

## Архітектура Pug та SCSS

- **Pug:** Базовий шаблон `src/layouts/main.pug` визначає блоки `meta`, `title`, `styles`, `content`, `scripts`. Сторінка `src/pages/index.pug` розширює його через `extends` та доповнює Open Graph метатеги через `block append meta`. Дані винесено у `src/data/*.pug` і рендеряться через `each`. Повторювані елементи інкапсульовано у міксинах (`+btn`, `+icon`, `+picture`, `+work-card`, `+section-title`).
- **SCSS:** Використовуються виключно сучасні модулі `@use` та `@forward` (без `@import`). Кольори описано в мапі `$colors`, з якої циклом `@each` генеруються CSS-змінні `--color-*` у `:root`. Адаптивність реалізовано за підходом Mobile-First через міксин `@include mq(md)` (`768px`) та `@include mq(lg)` (`1280px`).

---

## Використані інструменти

| Інструмент                                       | Призначення                                                                             |
| :----------------------------------------------- | :-------------------------------------------------------------------------------------- |
| **Vite + Vituum**                                | Швидкий dev-сервер (HMR) і продакшн-бандлер із мініфікацією CSS через `esbuild`         |
| **Pug (`@vituum/vite-plugin-pug`)**              | Шаблонізація HTML із наслідуванням, циклами, умовами та міксинами                       |
| **Dart Sass (`sass`)**                           | Модульний SCSS із `@use`/`@forward`, функціями (`math.div`) та міксинами                |
| **PostCSS + Autoprefixer + Browserslist**        | Автоматичне додавання вендорних префіксів під цільові браузери                          |
| **Sharp**                                        | Конвертація вихідних зображень у сучасні формати AVIF і WebP у ширинах `400w` і `800w`  |
| **Prettier + `@prettier/plugin-pug`**            | Єдине автоформатування `.pug`, `.scss`, `.js`, `.json`, `.md`                           |
| **Stylelint + `stylelint-config-standard-scss`** | Контроль БЕМ-іменування, глибини вкладеності ($\le 3$) та заборона `!important` / `#id` |
| **husky + lint-staged**                          | Блокування комітів із помилками лінтера перед записом у Git-історію                     |

---

## Цільові браузери (Browserslist) та оптимізація ресурсів

**Browserslist (`.browserslistrc`):**
`last 2 Chrome versions`, `last 2 Firefox versions`, `last 2 Edge versions`, `last 2 Safari versions`, `last 2 iOS versions`.

**Порівняння розміру зображень (9 робіт портфоліо):**

| Формат / Набір                                 | Сумарний розмір | Примітка                                            |
| :--------------------------------------------- | :-------------- | :-------------------------------------------------- |
| Вихідні растрові PNG (`800×633`)               | `305.5 KB`      | Неоптимізовані оригінали у `src/assets/images/raw/` |
| Оптимізовані JPEG (`400w` + `800w`, 18 файлів) | `131.2 KB`      | Запасний формат для старих браузерів (`-57%`)       |
| Оптимізовані WebP (`400w` + `800w`, 18 файлів) | `53.2 KB`       | Сучасний формат зі збереженням чіткості (`-83%`)    |
| Оптимізовані AVIF (`400w` + `800w`, 18 файлів) | `~38.0 KB`      | Пріоритетний формат у `<picture>` (`-87%`)          |

**CSS:** у режимі `npm run build` Vite автоматично об'єднує всі SCSS-модулі, додає вендорні префікси через Autoprefixer і стискає вихідний бандл (`dist/assets/main-*.css` до `~11 KB` / `~3.1 KB` gzip).
