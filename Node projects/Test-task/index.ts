import express from 'express';
import dotenv from "dotenv";
import { router } from './router/router';

dotenv.config();
const app = express();
const port = 3003;
app.use(express.json());

app.use('/', router);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});