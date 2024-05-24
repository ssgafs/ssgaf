const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Используем middleware для разбора тела запроса
app.use(bodyParser.urlencoded({ extended: true }));

// Используем middleware для сессий
app.use(session({
  secret: 'secret-key', // Секретный ключ для подписи cookie-файла
  resave: false,
  saveUninitialized: true
}));

// Страница регистрации
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/register.html');
});

// Обработка POST-запроса для регистрации
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Сохраняем имя пользователя в сессии
  req.session.username = username;

  res.send('Регистрация успешна!');
});

// Защищенная страница
app.get('/profile', (req, res) => {
  // Проверяем, есть ли имя пользователя в сессии
  if (req.session.username) {
    res.send(`Добро пожаловать, ${req.session.username}!`);
  } else {
    res.redirect('/register'); // Перенаправляем на страницу регистрации, если пользователь не зарегистрирован
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
