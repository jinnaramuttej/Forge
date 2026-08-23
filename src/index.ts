import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import hiringRoutes from './routes/hiring';
import legalRoutes from './routes/legal';
import financeRoutes from './routes/finance';
import marketingRoutes from './routes/marketing';
import candidatesRoutes from './routes/candidates';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Prevent annoying CSP/404 errors in browser DevTools
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.json({});
});

app.use('/api/hiring', hiringRoutes);
app.use('/api/legal', legalRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/candidates', candidatesRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
