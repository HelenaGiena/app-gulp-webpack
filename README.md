# app-gulp-webpack
### 
### структура папок в проекте
- app
  - common
    - styles
    - scripts
    - imagies
    - fonts
  - pages
    - index
    - ...
  - layouts
    - header
    - footer
  - components
    - logo
      - html
      - css
    - 
- .dist (сборка будет находиться здесь)
### 
### основные команды для запуска
*упрощаем жизнь:*
#### npm start - запускает скрипт "start" из паркета package.json (запускает сервер)
#### npm run production - запускает скрипт "production" из пакета package.json (собирает версию в продакшн)
*прописываются в package.json:*
```"scripts": {
    "start": "gulp default",
    "production": "cross-env process.env.NODE_env=production gulp production"
  }
```