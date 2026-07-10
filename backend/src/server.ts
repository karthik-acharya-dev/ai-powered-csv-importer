import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import uploadRouter from './routes/upload';
import extractRouter from './routes/extract';
import orgRouter from './routes/org';
import usersRouter from './routes/users';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Routes
app.use('/api/upload', uploadRouter);
app.use('/api/extract', extractRouter);
app.use('/api/org', orgRouter);
app.use('/api/users', usersRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
