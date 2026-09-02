import { useEffect, useState } from "react";
import axios from "axios";
import heroImg from "./assets/hero.png";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import "./App.css";
import ToDoCreate from "./components/ToDoCreate";
import ToDoList from "./components/ToDoList";
function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/tasks");
        setTodos(response.data);
      } catch (error) {
        console.error("Tasklar getirilemedi : ", error);
      }
    };
    getTasks();
  }, []);

  const createTodo = async (newTodo) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/tasks",
        newTodo,
      );
      setTodos((currentTodos) => [...currentTodos, response.data]);
      return true;
    } catch (error) {
      console.error("Task oluşturulamadı", error);
      return false;
    }
  };

  const removeTodo = async (todoId) => {
    try {
      await axios.delete(`http://localhost:8080/api/tasks/${todoId}`);
      setTodos((currentTodos) =>
        currentTodos.filter((todo) => todo.id !== todoId),
      );
    } catch (error) {
      console.error("Task silinemedi:", error);
    }
  };

  const updateTodo = async (id, updatedTodo) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/tasks/${id}`,
        updatedTodo,
      );
      setTodos((currentTodos) =>
        currentTodos.map((todo) => (todo.id == id ? response.data : todo)),
      );
      return true;
    } catch (error) {
      console.error("Task güncellenemedi:", error);

      return false;
    }
  };

  return (
    <div className="App">
      <div className="main">
        {/*childdan parentse geçmek için bi props tanımlıyoruz */}
        <ToDoCreate onCreateTodo={createTodo} />
        <ToDoList
          todos={todos}
          onRemoveTodo={removeTodo}
          onUpdateTodo={updateTodo}
        />
      </div>
    </div>
  );
}

export default App;
