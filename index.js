const cors = require("cors")
const express = require('express');
const { sequelize, loadModels } = require('./db');
const routes = require("./routes");

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));
app.use("/api", routes)

const PORT = 3000;

async function setupDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Подключение к PostgreSQL установлено');

    const models = loadModels();
    console.log('Модели загружены:', Object.keys(models));

    await sequelize.sync();
    console.log('Все таблицы созданы');

    
  } catch (error) {
    console.error('Ошибка при настройке БД:', error);
    process.exit(1);
  }
}


app.get('/', (req, res) => {
  res.send('Магазин 3D моделей работает');
});

app.listen(PORT, async () => {
  console.log(`\n Сервер запущен на http://localhost:${PORT}`);
  await setupDatabase();
});