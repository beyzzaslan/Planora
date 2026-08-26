import React from "react";
import { CiSquareRemove } from "react-icons/ci";
import { CiEdit } from "react-icons/ci";
import "../css/todo.css";

function ToDo() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        border: "1px solid lightgrey",
        padding: "10px",
      }}
    >
      <div>Ben ilk todoyum </div>
      <div>
        <CiSquareRemove className="todo-icons" />
        <CiEdit className="todo-icons" />
      </div>
    </div>
  );
}

export default ToDo;
