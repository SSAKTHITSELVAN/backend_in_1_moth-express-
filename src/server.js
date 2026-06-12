import express from 'express';
import dotenv from 'dotenv';
import router from './routes/authRoutes.js';

const app = express();
dotenv.config();
app.use(express.json());
app.use('/api/auth', router);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});