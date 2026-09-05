import React, { useState } from "react";
import { CiSquareRemove } from "react-icons/ci";
import { CiEdit } from "react-icons/ci";
import { FaCheck } from "react-icons/fa6";

import "../css/todo.css";

function ToDo({ todo, onRemoveTodo, onUpdateTodo }) {
  const {
    id,
    content,
    color,
    priority,
    taskDate,
    taskTime,
    status,
    reminderEnabled,
    reminderOffset,
  } = todo;
  const [editable, setEditable] = useState(false);
  const [newTodo, setNewTodo] = useState(content);

  const removeTodo = () => {
    onRemoveTodo(id);
  };

  const updateTodo = async () => {
    if (!newTodo.trim()) return;

    const request = {
      content: newTodo,
      color: color,
      priority: priority,
      taskDate: taskDate,
      taskTime: taskTime,
      status: status,
      reminderEnabled: reminderEnabled,
      reminderOffset: reminderOffset,
    };

    const updated = await onUpdateTodo(id, request);

    if (updated) {
      setEditable(false);
    }
  };
  const toggleStatus = async () => {
    const request = {
      content: content,
      color: color,
      priority: priority,
      taskDate: taskDate,
      taskTime: taskTime,
      status: status === "COMPLETED" ? "ACTIVE" : "COMPLETED", //Görev tamamlandıysa aktife çevirir, aktifse tamamlandı yapar.
      reminderEnabled: reminderEnabled,
      reminderOffset: reminderOffset,
    };
    await onUpdateTodo(id, request);
  };
  return (
    <div
      className={`todo-item ${status === "COMPLETED" ? "completed" : ""}`}
      style={{ borderLeft: `6px solid ${color}` }}
    >
      <input
        type="checkbox"
        checked={status === "COMPLETED"}
        onChange={toggleStatus}
      />
      <div className="todo-content">
        {editable ? (
          <input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="todo-input "
            type="text"
          />
        ) : (
          <>
            <div className="todo-text">{content}</div>

            <div className="todo-meta">
              <span>Öncelik: {priority}</span>
              {taskDate && <span>Tarih: {taskDate}</span>}
              {taskTime && <span>Saat: {taskTime}</span>}
              {reminderEnabled && (
                <span>Hatırlatıcı: {reminderOffset} dk önce</span>
              )}
            </div>
          </>
        )}
      </div>
      <div className="todo-actions">
        <CiSquareRemove className="todo-icons" onClick={removeTodo} />
        {editable ? (
          <FaCheck className="todo-icons" onClick={updateTodo} />
        ) : (
          <CiEdit className="todo-icons" onClick={() => setEditable(true)} />
        )}
      </div>
    </div>
  );
}

export default ToDo;
