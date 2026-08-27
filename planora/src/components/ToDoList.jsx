import React from "react";
import ToDo from "./ToDo";
function ToDoList({ todos }) {
  return (
    <div
      style={{
        width: "100%",
        marginTop: "50px",
      }}
    >
      {todos && todos.map((todo) => <ToDo key={todo.id} todo={todo} />)}
    </div>
  );
}

export default ToDoList;
