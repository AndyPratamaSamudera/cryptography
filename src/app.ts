import express from 'express';
import path from 'path';
import { registerRoutes } from './routes';

const app = express();
const port = Number(process.env.PORT) || 3000;

const projectRoot = path.join(__dirname, '..');

app.set('view engine', 'ejs');
app.set('views', path.join(projectRoot, 'views'));

app.use(express.json({ limit: '512kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(projectRoot, 'public')));

registerRoutes(app);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
