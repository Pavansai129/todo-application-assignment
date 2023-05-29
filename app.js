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
  const { search_q = "", priority, status, category, date } = request.query;
  let getTodoQuery;
  let getTodoResult = "";
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
      getTodoResult = await db.all(getTodoQuery);
      response.send(getTodoResult);
    }
  } else if (priority !== undefined && status !== undefined) {
    if (priorityList.includes(priority) && statusList.includes(status)) {
      getTodoQuery = `
          SELECT 
            *
        FROM 
            todo
        WHERE 
            priority = "${priority}" 
            AND status = "${status}";
          `;
      getTodoResult = await db.all(getTodoQuery);
      response.send(getTodoResult);
    }
  } else if (priority !== undefined && category !== undefined) {
    if (priorityList.includes(priority) && categoryList.includes(category)) {
      getTodoQuery = `
          SELECT 
            *
        FROM 
            todo
        WHERE 
            priority = "${priority}" 
            AND category = "${category}" ;
          `;
      getTodoResult = await db.all(getTodoQuery);
      response.send(getTodoResult);
    }
  } else if (status !== undefined && category !== undefined) {
    if (statusList.includes(status) && categoryList.includes(category)) {
      getTodoQuery = `
          SELECT 
            *
        FROM 
            todo
        WHERE 
            status = "${status}" 
            AND category = "${category}"; 
          `;
      getTodoResult = await db.all(getTodoQuery);
      response.send(getTodoResult);
    }
  } else if (priority !== undefined) {
    if (priorityList.includes(priority)) {
      getTodoQuery = `
          SELECT 
            *
        FROM 
            todo
        WHERE 
            priority = "${priority}";
        `;
      getTodoResult = await db.all(getTodoQuery);
      response.send(getTodoResult);
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
    }
  } else if (status !== undefined) {
    if (statusList.includes(status)) {
      getTodoQuery = `
          SELECT 
            *
        FROM 
            todo
        WHERE 
            status = "${status}";
        `;
      getTodoResult = await db.all(getTodoQuery);
      response.send(getTodoResult);
    } else {
      response.status(400);
      response.send("Invalid Todo Status");
    }
  } else if (category !== undefined) {
    if (categoryList.includes(category)) {
      getTodoQuery = `
          SELECT 
            *
        FROM 
            todo
        WHERE 
            category = "${category}";
        `;
      getTodoResult = await db.all(getTodoQuery);
      response.send(getTodoResult);
    } else {
      response.status(400);
      response.send("Invalid Todo Category");
    }
  }
});
