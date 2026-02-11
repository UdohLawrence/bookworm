import express from 'express';
import 'dotenv/config';
import authRoutes from './routes/authRoutes.js';
import logger from './middlewares/loggerMiddleware.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});