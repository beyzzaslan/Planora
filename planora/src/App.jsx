import { useState } from "react";
import heroImg from "./assets/hero.png";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import "./App.css";
import ToDoCreate from "./components/ToDoCreate";
import ToDoList from "./components/ToDoList";
function App() {
  const [todos, setTodos] = useState([]);

  const createTodo = (newTodo) => {
    //burda şu mantık var önceki todoları bana aç ve üzerine yeni todo ekle mantıgında aşağıdaki kod
    setTodos([...todos, newTodo]);
  };

  const removeTodo = (todoId) => {
    setTodos([...todos.filter((todo) => todo.id !== todoId)]);
  };
  return (
    <div className="App">
      <div className="main">
        {/*childdan parentse geçmek için bi props tanımlıyoruz */}
        <ToDoCreate onCreateTodo={createTodo} />
        <ToDoList todos={todos} onRemoveTodo={removeTodo} />
      </div>
    </div>
  );
}

export default App;
