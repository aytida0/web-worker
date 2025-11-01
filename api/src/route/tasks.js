import express from 'express';
import { getTasks, createTask, getStatus, deleteTask, setupTable} from '../controllers/tasks.js';

const router = express.Router();

// Create and Get tasks
router
    .route('/tasks')
    .get(getTasks) // Retrieve all tasks
    .post(createTask); // Create a new task
  

// Check the status of a specific task by ID
router
    .route('/tasks/:taskId')
    .get(getStatus)
    .delete(deleteTask);

router.get('/setup', setupTable);

// Export the router
export default router;
