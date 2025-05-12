import express  from 'express';
import mongoose from 'mongoose';
import cors     from 'cors';
import helmet   from 'helmet';
import dotenv   from 'dotenv';
import authRoutes from './routes/auth.routes.js';

dotenv.config();                    // читает .env

const app  = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (_, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT        || 4000;
const DB   = process.env.MONGODB_URI;

if (!DB) {
  console.error(' MONGODB_URI не указан в .env');
  process.exit(1);
}

mongoose.connect(DB, { dbName: 'fitness' })
  .then(() => {
    console.log(' MongoDB подключена');
    app.listen(PORT, '0.0.0.0', () =>
      console.log(`🚀  API доступен на http://localhost:${PORT}`),
    );
  })
  .catch(err => {
    console.error(' Ошибка подключения MongoDB\n', err);
    process.exit(1);
  });
