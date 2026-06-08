import express from 'express';
import dotenv from 'dotenv';
import pool from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();


async function startserver(){
  try{
    await pool.query("SELECT NOW()");
    console.log('Database connected!');
    app.listen(PORT, () => {
      console.log(`myapp listening on port ${PORT}!`);
    });
  }catch(error){
    console.error('Database connection error:', error);
  }
}

startserver();
