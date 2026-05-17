<div align="center">

```
░██████╗██╗░░░██╗██████╗░░█████╗░██╗░░██╗░█████╗░██╗
██╔════╝██║░░░██║██╔══██╗██╔══██╗██║░██╔╝██╔══██╗██║
╚█████╗░██║░░░██║██║░░██║██║░░██║█████═╝░███████║██║
░╚═══██╗██║░░░██║██║░░██║██║░░██║██╔═██╗░██╔══██║██║
██████╔╝╚██████╔╝██████╔╝╚█████╔╝██║░╚██╗██║░░██║██║
╚═════╝░░╚═════╝░╚═════╝░░╚════╝░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝
```

**Судоку нового поколения с AI-подсказками, лидербордом и пиксельным дизайном**

[![Открыть сайт](https://img.shields.io/badge/🎮_Играть-7c6af8?style=for-the-badge)](https://noradillova.github.io/sudokai)
[![AI](https://img.shields.io/badge/AI-Claude_API-f0c040?style=for-the-badge)](#)
[![Stack](https://img.shields.io/badge/Stack-HTML_·_CSS_·_JS_·_Node.js-5edb8f?style=for-the-badge)](#)

</div>

---

## 💡 О проекте

**SudoKai** — это веб-приложение для игры в судоку с японской пиксельной эстетикой. Проект создан как полноценный продукт с продуманным UI, геймплейными механиками и интеграцией искусственного интеллекта.

Основная идея — сделать судоку не просто игрой, а полноценным опытом: с уровнями, XP, лидербордом и AI-тренером, который помогает решать головоломки.

---

## ⚙️ Что реализовано

- 🎮 **Игровая логика** — полностью рабочее судоку с валидацией, нотами, отменой ходов
- 🤖 **AI-тренер KAI** — чат с Claude API, который даёт подсказки по текущей доске
- 🏆 **Лидерборд** — сохранение результатов через localStorage, фильтрация по сложности
- ⚡ **XP и уровни** — система опыта, комбо-множители, прогресс-бар
- 🌙 **Темы** — тёмная (ночь) и светлая (день) с пиксельными фонами
- 📖 **How to Play** — интерактивная страница обучения с шорткатами клавиатуры
- 📝 **Режим заметок** — карандашные пометки в ячейках
- 🌸 **Сакура** — анимированные падающие лепестки

---

## 🛠️ Технологии

| Часть | Технологии |
|---|---|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Node.js, Express |
| **AI** | Anthropic Claude API |
| **Хранилище** | localStorage |
| **Деплой** | GitHub Pages |

---

## 🚀 Запуск локально

```bash
# 1. Клонировать репозиторий
git clone https://github.com/noradillova/sudokai.git
cd sudokai

# 2. Установить зависимости
npm install

# 3. В server.js вставить свой API ключ Claude
# apiKey: 'your-anthropic-key'

# 4. Запустить сервер
node server.js

# 5. Открыть index.html в браузере
```

---

## 📁 Структура проекта

```
sudokai/
├── index.html       # Всё приложение в одном файле
├── server.js        # Бэкенд: Express + Claude AI
├── package.json     # Зависимости
├── bg-dark.png      # Ночной пиксельный фон
└── bg-light.png     # Дневной пиксельный фон
```

---

## 🎯 Чему я научилась в ходе работы

- Работа с **REST API** и асинхронными запросами (`fetch`, `async/await`)
- Интеграция **Anthropic Claude API** в реальный продукт
- Построение **игровой логики** с нуля (валидация, undo, notes, таймер)
- Работа с **localStorage** для хранения данных без базы данных
- **Анимации и UI/UX** — как сделать интерфейс живым и отзывчивым
- Деплой через **GitHub Pages**

---

## 👩‍💻 Автор

<div align="center">

**Нурайым Адилова**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/nuraiym-adilova-706051241)
[![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/noradillova)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/noradillova)

</div>

---

<div align="center">
Сделано с 🌸 · © 2025 SudoKai
</div>
