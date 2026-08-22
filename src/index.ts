import express from 'express';
import dotenv from 'dotenv';
import hiringRoutes from './routes/hiring';
import legalRoutes from './routes/legal';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/hiring', hiringRoutes);
app.use('/api/legal', legalRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
