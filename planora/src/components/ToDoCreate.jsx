import React, { useState } from "react";
import "../css/todo.css";

function ToDoCreate({ onCreateTodo }) {
  const [newTodo, setNewTodo] = useState(""); //todo nun içeriğini bunda tutucaz
  const [color, setColor] = useState("#F9A8D4");
  const [priority, setPriority] = useState("MEDIUM");
  const [taskDate, setTaskDate] = useState("");
  const [taskTime, setTaskTime] = useState("");

  const clearInput = () => {
    setNewTodo("");
    setColor("#F9A8D4");
    setPriority("MEDIUM");
    setTaskDate("");
    setTaskTime("");
  };

  const createTodo = async () => {
    if (!newTodo.trim()) return;

    const request = {
      content: newTodo,
      color: color,
      priority: priority,
      taskDate: taskDate || null,
      taskTime: taskTime || null,
      status: "ACTIVE",
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
