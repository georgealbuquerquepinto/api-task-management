import { HandlerFunc, Context } from 'https://deno.land/x/abc@v1.0.0-rc2/mod.ts'
import db from '../../config/database.ts'
import { ErrorHandler } from '../../utils/handleError.ts'
import Tasks from './task.ts'
import { messages } from './../../utils/messages.ts'

const database = db.getDatabase
const Task     = database.collection('tasks')

const getTasks: HandlerFunc = async (data: Context) => {
  try {
    const tasks: Tasks[] = await Task.find()

    if (tasks) {
      const tasksList = tasks.length ?
        tasks.map((task: any) => {
          const { _id: { $oid }, title, description } = task
          
          return { _id: $oid, title, description }
        })
        :
        []
        
      return data.json(tasksList, 200)
    }
  } catch (error) {
    throw new ErrorHandler(error.message, error.status || 500)
  }
}

const getTask: HandlerFunc = async (data: Context) => {
  try {
    const { _id } = data.params as { _id: string }

    const task = await Task.findOne({ _id: { '$oid': _id } })

    if (task) {
      const { _id: { $oid }, title, description } = task
      
      return data.json({ _id: $oid, title, description }, 200)
    }

    throw new ErrorHandler(messages.notFound, 404)
  } catch (error) {
    throw new ErrorHandler(error.message, error.status || 500)
  }
}

const createTask: HandlerFunc = async (data: Context) => {
  try {
    if (data.request.headers.get('content-type') !== 'application/json') {
      throw new ErrorHandler(messages.invalidBody, 422)
    }

    const body = await (data.body())

    if (!Object.keys(body).length) {
      throw new ErrorHandler(messages.emptyBody, 400)
    }
    
    const { title, description } = body

    await Task.insertOne({ title, description })

    return data.json({ message: messages.registerSuccessfully }, 201)
  } catch (error) {
    throw new ErrorHandler(error.message, error.status || 500)
  }
}

const updateTask: HandlerFunc = async (data: Context) => {
  try {
    const { _id } = data.params as { _id: string }

    if (data.request.headers.get('content-type') !== 'application/json') {
      throw new ErrorHandler(messages.invalidBody, 422)
    }

    const body = await (data.body()) as {
      title?: string
      description?: string
    }

    if (!Object.keys(body).length) {
      throw new ErrorHandler(messages.emptyBody, 400)
    }

    const task = await Task.findOne({ _id: { '$oid': _id } })
    
    if (task) {
      const { matchedCount } = await Task.updateOne(
        { _id: { '$oid': _id } },
        { $set: body }
      )

      if (matchedCount) {
        return data.json({ message: messages.updateSuccessfully }, 201)
      }
      return data.json({ message: messages.updateFailed }, 400)
    }
    throw new ErrorHandler(messages.notFound, 404)
  } catch (error) {
    throw new ErrorHandler(error.message, error.status || 500)
  }
}

const deleteTask: HandlerFunc = async (data: Context) => {
  try {
    const { _id } = data.params as { _id: string }

    const task = await Task.findOne({ _id: { '$oid': _id } })

    if (task) {
      const deleted = await Task.deleteOne({ _id: { '$oid': _id } })

      if (deleted) {
        return data.json({ message: messages.deleteSuccessfully }, 201)
      }

      throw new ErrorHandler(messages.deleteFailed, 400)
    }

    throw new ErrorHandler(messages.notFound, 404)
  } catch (error) {
    throw new ErrorHandler(error.message, error.status || 500)
  }
}

export { getTasks, getTask, createTask, updateTask, deleteTask }