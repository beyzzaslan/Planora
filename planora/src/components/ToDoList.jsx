import React from "react";
import ToDo from "./ToDo";
function ToDoList({ todos, onRemoveTodo }) {
  return (
    <div
      style={{
        width: "100%",
        marginTop: "50px",
      }}
    >
      {todos &&
        todos.map((todo) => (
          <ToDo key={todo.id} todo={todo} onRemoveTodo={onRemoveTodo} />
        ))}
    </div>
  );
}

export default ToDoList;
