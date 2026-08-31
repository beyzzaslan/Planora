import React, { useState } from "react";
import { CiSquareRemove } from "react-icons/ci";
import { CiEdit } from "react-icons/ci";
import { FaCheck } from "react-icons/fa6";

import "../css/todo.css";

function ToDo({ todo, onRemoveTodo, onUpdateTodo }) {
  const { id, content } = todo;
  const removeTodo = () => {
    onRemoveTodo(id);
  };
  const [editable, setEditable] = useState(false);
  const [newTodo, setNewTodo] = useState(content);
  const updateTodo = () => {
    const request = {
      id: id,
      content: newTodo,
    };
    onUpdateTodo(request);
    setEditable(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        border: "1px solid lightgrey",
        padding: "10px",
        marginTop: "10px",
      }}
    >
      <div>
        {editable ? (
          <input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            style={{ width: "380px" }}
            className="todo-input "
            type="text"
          />
        ) : (
          content
        )}
      </div>
      <div>
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
