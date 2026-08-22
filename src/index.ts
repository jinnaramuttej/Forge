import express from 'express';
import dotenv from 'dotenv';
import hiringRoutes from './routes/hiring';
import legalRoutes from './routes/legal';
import financeRoutes from './routes/finance';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/hiring', hiringRoutes);
app.use('/api/legal', legalRoutes);
app.use('/api/finance', financeRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
