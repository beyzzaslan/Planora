import React, { useState } from "react";
import "../css/todo.css";

function ToDoCreate({ onCreateTodo }) {
  const [newTodo, setNewTodo] = useState(""); //todo nun içeriğini bunda tutucaz
  const [color, setColor] = useState("#F9A8D4");
  const [priority, setPriority] = useState("MEDIUM");
  const [taskDate, setTaskDate] = useState("");
  const [taskTime, setTaskTime] = useState("");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderOffset, setReminderOffset] = useState(30);

  const clearInput = () => {
    setNewTodo("");
    setColor("#F9A8D4");
    setPriority("MEDIUM");
    setTaskDate("");
    setTaskTime("");
    setReminderEnabled(false);
    setReminderOffset(30);
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
      reminderEnabled: reminderEnabled,
      reminderOffset: reminderEnabled ? Number(reminderOffset) : null,
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

        <label>
          Hatırlatıcı
          <input
            type="checkbox"
            checked={reminderEnabled}
            onChange={(e) => setReminderEnabled(e.target.checked)}
          />
        </label>

        <label>
          Kaç dakika önce ?
          <select
            value={reminderOffset}
            onChange={(e) => setReminderOffset(e.target.value)}
            disabled={!reminderEnabled}
          >
            <option value="1">1 dakika</option>
            <option value="5">5 dakika</option>
            <option value="15">15 dakika</option>
            <option value="30">30 dakika</option>
            <option value="60">1 saat</option>
            <option value="1440">1 gün</option>
          </select>
        </label>
      </div>

      <button onClick={createTodo} className="todo-create-button">
        Todo oluştur
      </button>
    </div>
  );
}

export default ToDoCreate;
