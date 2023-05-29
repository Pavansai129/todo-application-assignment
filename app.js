const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const isValid = require("date-fns/isValid");
const format = require("date-fns/format");

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
//API 1
app.get("/todos/", async (request, response) => {
  const { search_q = "", priority, status, category, date } = request.query;
  let getTodosQuery;
  let getTodosResult = "";
  if (
    priority !== undefined &&
    status !== undefined &&
    category !== undefined
  ) {
    if (
      priorityList.includes(priority) &&
      statusList.includes(status) &&
      categoryList.includes(category)
    ) {
      getTodoQuery = `
          SELECT 
            *
        FROM 
            todo
        WHERE 
            priority = "${priority}" 
            AND status = "${status}" 
            AND category = "${category}";
          `;
      getTodosResult = await db.all(getTodosQuery);
      response.send(getTodosResult);
    }
  } else if (priority !== undefined && status !== undefined) {
    if (priorityList.includes(priority) && statusList.includes(status)) {
      getTodosQuery = `
          SELECT 
            *
        FROM 
            todo
        WHERE 
            priority = "${priority}" 
            AND status = "${status}";
          `;
      getTodosResult = await db.all(getTodosQuery);
      response.send(getTodosResult);
    }
  } else if (priority !== undefined && category !== undefined) {
    if (priorityList.includes(priority) && categoryList.includes(category)) {
      getTodosQuery = `
          SELECT 
            *
        FROM 
            todo
        WHERE 
            priority = "${priority}" 
            AND category = "${category}" ;
          `;
      getTodosResult = await db.all(getTodosQuery);
      response.send(getTodosResult);
    }
  } else if (status !== undefined && category !== undefined) {
    if (statusList.includes(status) && categoryList.includes(category)) {
      getTodosQuery = `
          SELECT 
            *
        FROM 
            todo
        WHERE 
            status = "${status}" 
            AND category = "${category}"; 
          `;
      getTodosResult = await db.all(getTodosQuery);
      response.send(getTodosResult);
    }
  } else if (priority !== undefined) {
    if (priorityList.includes(priority)) {
      getTodosQuery = `
          SELECT 
            *
        FROM 
            todo
        WHERE 
            priority = "${priority}";
        `;
      getTodosResult = await db.all(getTodosQuery);
      response.send(getTodosResult);
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
    }
  } else if (status !== undefined) {
    if (statusList.includes(status)) {
      getTodosQuery = `
          SELECT 
            *
        FROM 
            todo
        WHERE 
            status = "${status}";
        `;
      getTodosResult = await db.all(getTodosQuery);
      response.send(getTodosResult);
    } else {
      response.status(400);
      response.send("Invalid Todo Status");
    }
  } else if (category !== undefined) {
    if (categoryList.includes(category)) {
      getTodosQuery = `
          SELECT 
            *
        FROM 
            todo
        WHERE 
            category = "${category}";
        `;
      getTodosResult = await db.all(getTodosQuery);
      response.send(getTodosResult);
    } else {
      response.status(400);
      response.send("Invalid Todo Category");
    }
  }
});

//API 2
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getTodoQuery = `
    SELECT
        *
    FROM
        todo
    WHERE
        id = ${todoId};
    `;
  const getTodoResult = await db.get(getTodoQuery);
  response.send(getTodoResult);
});

//API 3
app.get("/agenda", async (request, response) => {
  const { date } = request.query;
  if (isValid(new Date(date))) {
    const getTodoWithDateQuery = `
        SELECT 
            id, todo, category, priority, status, due_date AS dueDate
        FROM 
            todo
        WHERE 
            due_date LIKE '${format(new Date(date), "yyyy-MM-dd")}';
        `;
    const todoWithDateResult = await db.all(getTodoWithDateQuery);
    response.send(todoWithDateResult);
  } else {
    response.status(400);
    response.send("Invalid Due Date");
  }
});
