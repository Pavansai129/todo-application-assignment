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

app.get("/todos/", async (request, response) => {
  const { search_q, priority, status, category, date } = request.query;
  let getTodoQuery;
  let getTodoResult = "";
  switch (true) {
    case hasTodoPriorityStatusCategory():
      getTodosQuery = `SELECT * FROM todo WHERE todo LIKE "%${search_q}%
        " AND priority = "%${priority}%" AND status = "%${status}%" AND category = "%${category}%"`;
      getTodosResult = await db.all(getTodosQuery);
      response.send(getTodosResult);
      console.log(getTodosResult);
  }
});
