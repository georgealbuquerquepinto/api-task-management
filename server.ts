import { Application } from 'https://deno.land/x/abc@v1.0.0-rc2/mod.ts'
import { ErrorMiddleware } from './utils/handleError.ts'

import { getTasks, getTask, createTask, updateTask, deleteTask } from './modules/Task/taskService.ts'

const app = new Application()

app.use(ErrorMiddleware)

app
  .get('/tasks', getTasks)
  .get('/tasks/:_id', getTask)
  .post('/tasks', createTask)
  .put('/tasks/:_id', updateTask)
  .delete('/tasks/:_id', deleteTask)
  .start({ port: 3000 });

console.log(`server listening on http://localhost:3000`)