import React from "react";
import "../css/todo.css";
function ToDoCreate() {
  return (
    <div className="todo-create">
      <input className="todo-input " type="text" placeholder="Todo giriniz " />
      <button className="todo-create-button">Todo oluştur</button>
    </div>
  );
}

export default ToDoCreate;
