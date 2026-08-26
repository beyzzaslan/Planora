import React, { useState } from "react";
import "../css/todo.css";

function ToDoCreate({ onCreateTodo }) {
  const [newTodo, setNewTodo] = useState(""); //todo nun içeriğini bunda tutucaz
  const createTodo = () => {
    if (!newTodo) return;

    const request = {
      id: Math.floor(Math.random() * 99999999),
      content: newTodo,
    };
    onCreateTodo(request);
  };
  return (
    <div className="todo-create">
      <input
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        className="todo-input "
        type="text"
        placeholder="Todo giriniz "
      />
      <button onClick={createTodo} className="todo-create-button">
        Todo oluştur
      </button>
    </div>
  );
}

export default ToDoCreate;
