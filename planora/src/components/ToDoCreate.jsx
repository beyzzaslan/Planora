import React, { useState } from "react";
import "../css/todo.css";

function ToDoCreate({ onCreateTodo }) {
  const [newTodo, setNewTodo] = useState(""); //todo nun içeriğini bunda tutucaz
  const clearInput = () => {
    setNewTodo("");
  };

  const createTodo = async () => {
    if (!newTodo.trim()) return;

    const request = {
      content: newTodo,
      completed: false, //görev yeni atandığı için completed durumunu false diyoruz
    };
    const created = await onCreateTodo(request);
    if (created) {
      clearInput();
    }
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
