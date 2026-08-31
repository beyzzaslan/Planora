import React from "react";
import { CiSquareRemove } from "react-icons/ci";
import { CiEdit } from "react-icons/ci";
import "../css/todo.css";

function ToDo({ todo, onRemoveTodo }) {
  const { id, content } = todo;
  const removeTodo = () => {
    onRemoveTodo(id);
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
      <div>{content}</div>
      <div>
        <CiSquareRemove className="todo-icons" onClick={removeTodo} />
        <CiEdit className="todo-icons" />
      </div>
    </div>
  );
}

export default ToDo;
