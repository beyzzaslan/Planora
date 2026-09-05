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

      <div className="todo-options">
        <label>
          Renk
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </label>

        <label>
          Öncelik
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="LOW">Düşük</option>
            <option value="MEDIUM">Orta</option>
            <option value="HIGH">Yüksek</option>
          </select>
        </label>

        <label>
          Tarih
          <input
            type="date"
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
          ></input>
        </label>

        <label>
          Saat
          <input
            type="time"
            value={taskTime}
            onChange={(e) => setTaskTime(e.target.value)}
          />
        </label>
      </div>

      <button onClick={createTodo} className="todo-create-button">
        Todo oluştur
      </button>
    </div>
  );
}

export default ToDoCreate;
