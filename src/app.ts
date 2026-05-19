import express from 'express';
import path from 'path';
import { registerRoutes } from './routes';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.set('view engine', 'ejs');

const isDev = __dirname.endsWith('src') || __dirname.includes('/src');
const viewsPath = isDev ? path.join(__dirname, '../views') : path.join(__dirname, 'views');
const publicPath = isDev ? path.join(__dirname, '../public') : path.join(__dirname, 'public');

app.set('views', viewsPath);

app.use(express.json({ limit: '512kb' }));
app.use(express.urlencoded({ extended: true }));

app.use(express.static(publicPath));

registerRoutes(app);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});