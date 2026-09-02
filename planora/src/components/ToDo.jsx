import React, { useState } from "react";
import { CiSquareRemove } from "react-icons/ci";
import { CiEdit } from "react-icons/ci";
import { FaCheck } from "react-icons/fa6";

import "../css/todo.css";

function ToDo({ todo, onRemoveTodo, onUpdateTodo }) {
  const { id, content, completed } = todo;
  const [editable, setEditable] = useState(false);
  const [newTodo, setNewTodo] = useState(content);

  const removeTodo = () => {
    onRemoveTodo(id);
  };

  const updateTodo = async () => {
    if (!newTodo.trim()) return;

    const request = {
      content: newTodo,
      completed: completed,
    };

    const updated = await onUpdateTodo(id, request);

    if (updated) {
      setEditable(false);
    }
  };

  return (
    <div className="todo-item">
      <div className="todo-content">
        {editable ? (
          <input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="todo-input "
            type="text"
          />
        ) : (
          content
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
