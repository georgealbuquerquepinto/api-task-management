# API Task Management

_This application is a API, which helps to plan and manage the tasks._

## Technologies:
* [Deno](https://deno.land/)
* [MongoDB](https://www.mongodb.com/)
* [abc](https://deno.land/x/abc) - For router
* [dotenvc](https://deno.land/x/dotenv) - Variables globals in root file
* [mongo](https://deno.land/x/mongo) - MongoDB connection

## Endpoint Router
`GET /tasks`: Returns all registered tasks

`GET /tasks/{ID}`: Returns the task with `_id` = `ID`

`POST /tasks`: Register a task

`PUT /tasks/{ID}`: Update the task with `_id` = `ID`

`DELETE /tasks/{ID}`: Delete the task with `_id` = `ID`

### Format data
```
{
  "title": "Task One",
  "description": "Task One's description"
}
```
##### Note
The requisitions `POST` and `UPDATE` has validation for Header type, if content-type is `application/json`, and validation if body data this empty

## .ENV
```
DATABASE_NAME=<DATABASE_NAME>
DATABASE_HOST=<URI_MONGO>
```

## Start server
```
deno run --allow-write --allow-read --allow-plugin --allow-net --allow-env --unstable ./server.ts
```

## Note
This API is in progress