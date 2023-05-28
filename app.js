const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "todoApplication.db");

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000");
    });
  } catch (error) {
    console.log(`DB error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const priorityList = ["HIGH", "MEDIUM", "LOW"];
const statusList = ["TO DO", "IN PROGRESS", "DONE"];
const categoryList = ["WORK", "HOME", "LEARNING"];

app.get("/todos/", async (request, response) => {
  const { search_q, priority, status, category, date } = request.query;
  let getTodoQuery;
  let getTodoResult = "";
  switch (true) {
    case hasStatus(request.query):
      if(statusList.includes(status) === undefined){
        response.status(400);
        response.send("Invalid Todo Status");
      }  else{
             getTodosQuery = `SELECT * FROM todo WHERE status = "%${status}%"`;
      getTodosResult = await db.all(getTodosQuery);
      response.send(getTodosResult);
      console.log(getTodosResult);
      }
      break;
   
    case hasPriority(request.query):
        if(priorityList.includes(priority) === undefined){
            response.status(400);
        response.send("Invalid Todo Priority");
        }else{
            getTodosQuery = `SELECT * FROM todo WHERE priority = "%${priority}%"`;
      getTodosResult = await db.all(getTodosQuery);
      response.send(getTodosResult);
      console.log(getTodosResult);
        }
        break;
      
    case hasPriorityStatus(request.query):
        if(priorityList.includes(priority) === undefined){
            response.status(400);
        response.send("Invalid Todo Priority");
        }else if(statusList.includes(status) === undefined){
            response.status(400);
        response.send("Invalid Todo Status");
        }
        else{
            getTodosQuery = `SELECT * FROM todo WHERE priority = "%${priority}%" AND status = "%${status}%"`;
      getTodosResult = await db.all(getTodosQuery);
      response.send(getTodosResult);
      console.log(getTodosResult);
        }
        break;
      
    case hasTodo(request.query):
        if(){

        }else{
             getTodosQuery = `SELECT * FROM todo WHERE todo = "%${search_q}%"`;
        getTodosResult = await db.all(getTodosQuery);
        response.send(getTodosResult);
        console.log(getTodosResult);
        }
        break;
       
    case hasCategoryStatus(request.query):
        if(){

        }else{
            getTodosQuery = `SELECT * FROM todo WHERE category = "%${category}%" AND status = "%${status}%"`;
        getTodosResult = await db.all(getTodosQuery);
        response.send(getTodosResult);
        console.log(getTodosResult);
        }
        break;
        
    case hasCategory(request.query):
        if(){

        }else{
            getTodosQuery = `SELECT * FROM todo WHERE category = "%${category}%"`;
        getTodosResult = await db.all(getTodosQuery);
        response.send(getTodosResult);
        console.log(getTodosResult);
        }
        break;
    case hasCategoryPriority(request.query):
        if(){

        }else{
             getTodosQuery = `SELECT * FROM todo WHERE category = "%${category}%" AND priority = "%${priority}%"`;
        getTodosResult = await db.all(getTodosQuery);
        response.send(getTodosResult);
        console.log(getTodosResult);
        }
        break;
  }
});
