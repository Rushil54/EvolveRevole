import 'dotenv/config'; // Make sure this is at the very top
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './utils/supabase';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend up and running!');
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
