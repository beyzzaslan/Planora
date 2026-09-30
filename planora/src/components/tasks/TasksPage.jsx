import ToDoCreate from "../ToDoCreate";
import ToDoList from "../ToDoList";

function TasksPage({
  todos,
  completedTodos,
  pendingTodos,
  onCreateTodo,
  onRemoveTodo,
  onUpdateTodo,
}) {
  return (
    <div className="content-section">
      <div className="task-summary-row">
        <div className="task-summary-card">
          <span>Total</span>
          <strong>{todos.length}</strong>
        </div>

        <div className="task-summary-card">
          <span>Done</span>
          <strong>{completedTodos}</strong>
        </div>

        <div className="task-summary-card">
          <span>Pending</span>
          <strong>{pendingTodos}</strong>
        </div>
      </div>

      <ToDoCreate onCreateTodo={onCreateTodo} />
      <ToDoList
        todos={todos}
        onRemoveTodo={onRemoveTodo}
        onUpdateTodo={onUpdateTodo}
      />
    </div>
  );
}

export default TasksPage;
