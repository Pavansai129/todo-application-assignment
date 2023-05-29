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
  const { search_q, priority, status, category, date } = request.query;
  let getTodosQuery;
  let getTodosResult = "";
  if (search_q !== undefined) {
    getTodosQuery = `
    SELECT
      id, todo, priority, status, category, due_date AS dueDate
    FROM
        todo
    WHERE
        todo LIKE "%${search_q}%"; 
    `;
    getTodosResult = await db.all(getTodosQuery);
    response.send(getTodosResult);
  } else if (
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
            id, todo, priority, status, category, due_date AS dueDate
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
            id, todo, priority, status, category, due_date AS dueDate
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
            id, todo, priority, status, category, due_date AS dueDate
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
            id, todo, priority, status, category, due_date AS dueDate
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
            id, todo, priority, status, category, due_date AS dueDate
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
            id, todo, priority, status, category, due_date AS dueDate
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
            id, todo, priority, status, category, due_date AS dueDate
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
        id, todo, priority, status, category, due_date AS dueDate
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

//API 4
app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status, category, dueDate } = request.body;
  if (priorityList.includes(priority)) {
    if (statusList.includes(status)) {
      if (categoryList.includes(category)) {
        if (isValid(new Date(dueDate))) {
          const addTodoQuery = `
    INSERT INTO
        todo (id, todo, category, priority, status, due_date)
    VALUES (${id}, "${todo}", "${category}" ,"${priority}", "${status}", "${format(
            new Date(dueDate),
            "yyyy-MM-dd"
          )}");
    `;
          await db.run(addTodoQuery);
          response.send("Todo Successfully Added");
        } else {
          response.status(400);
          response.send("Invalid Due Date");
        }
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }
    } else {
      response.status(400);
      response.send("Invalid Todo Status");
    }
  } else {
    response.status(400);
    response.send("Invalid Todo Priority");
  }
});

//API 5

app.put("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const { status, priority, category, todo, dueDate } = request.body;
  if (status !== undefined) {
    if (statusList.includes(status)) {
      const updateStatusQuery = `UPDATE todo SET status = "${status}" WHERE id = ${todoId};`;
      await db.run(updateStatusQuery);
      response.send("Status Updated");
    } else {
      response.status(400);
      response.send("Invalid Todo Status");
    }
  } else if (priority !== undefined) {
    if (priorityList.includes(priority)) {
      const updatePriorityQuery = `UPDATE todo SET priority = "${priority}" WHERE id = ${todoId};`;
      await db.run(updatePriorityQuery);
      response.send("Priority Updated");
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
    }
  } else if (category !== undefined) {
    if (categoryList.includes(category)) {
      const updateCategoryQuery = `UPDATE todo SET category = "${category}" WHERE id = ${todoId};`;
      await db.run(updateCategoryQuery);
      response.send("Category Updated");
    } else {
      response.status(400);
      response.send("Invalid Todo Category");
    }
  } else if (todo !== undefined) {
    const updateTodoQuery = `UPDATE todo SET todo = "${todo}" WHERE id = ${todoId};`;
    await db.run(updateTodoQuery);
    response.send("Todo Updated");
  } else if (dueDate !== undefined) {
    if (isValid(new Date(dueDate))) {
      const updateDueDateQuery = `UPDATE todo SET due_date = "${format(
        new Date(dueDate),
        "yyyy-MM-dd"
      )}" WHERE id = ${todoId};`;
      await db.run(updateDueDateQuery);
      response.send("Due Date Updated");
    } else {
      response.status(400);
      response.send("Invalid Due Date");
    }
  }
});

//API 6
app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteTodoQuery = `
    DELETE FROM todo WHERE id = ${todoId};
    `;
  await db.run(deleteTodoQuery);
  response.send("Todo Deleted");
});

module.exports = app;
