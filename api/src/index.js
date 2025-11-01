import express from 'express';
import taskRoute from './route/tasks.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', taskRoute);


app.listen(PORT, (error) => {
  if (error) {
    console.error('Error starting the server:', errror);
    return;
  }
  console.log(`Server is running on http://localhost:${PORT}`);
});