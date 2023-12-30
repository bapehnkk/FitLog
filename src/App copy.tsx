import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import Database from "@tauri-apps/plugin-sql";


function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }
  
  async function checkAndCreateTable(db) {
    try {
      // Попытка выполнить SELECT запрос, который вернет ошибку, если таблицы не существует
      await db.select("SELECT * FROM todos LIMIT 1");
  
      // Если запрос выполнен успешно, таблица существует
    } catch (e) {
      // Ошибка выполнения запроса, возможно, таблицы не существует, создаем ее
      await db.execute(
        "CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, status TEXT NOT NULL)"
      );
    }
  }
  async function testDB() {
    // sqlite. The path is relative to `tauri::api::path::BaseDirectory::App`.
    const db = await Database.load("sqlite:test.db");
    await checkAndCreateTable(db);

    const todos = {
      id: 1,
      title: "New Todo Todo",
      status: "incomplete"
    };
    
    // const result1 = await db.execute(
    //   "INSERT INTO todos (title, status) VALUES ($1, $2)",
    //   [todos.title, todos.status],
    // );
    

    // console.log(result1);

    const result2 = await db.execute(
      "UPDATE todos SET title = $1, status = $2 WHERE id = $3",
      [todos.title, todos.status, todos.id],
    );
    
    console.log(result2);
  }
  async function fetchAndPrintTodos() {
    const db = await Database.load("sqlite:test.db");
  
    // Выполнение запроса SELECT для получения всех записей из таблицы todos
    const todos = await db.select("SELECT * FROM todos");
  
    // Вывод результатов в консоль
    console.log(todos);
  }
  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>

      <p>{greetMsg}</p>
      <button onClick={testDB}>Test DB</button>
      <button onClick={fetchAndPrintTodos}>Get DB</button>
    </div>
  );
}

export default App;
