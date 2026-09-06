import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./App.css";
import ToDoCreate from "./components/ToDoCreate";
import ToDoList from "./components/ToDoList";
import "./css/notes.css";
import NoteCreate from "./components/NoteCreate";
import NoteList from "./components/NoteList";
function App() {
  const [todos, setTodos] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [notes, setNotes] = useState([]);
  const notifiedReminderIds = useRef(new Set());

  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/tasks");
        setTodos(response.data);
      } catch (error) {
        console.error("Tasklar getirilemedi : ", error);
      }
    };
    getTasks();
  }, []);

  useEffect(() => {
    const getReminders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/tasks/reminders",
        );
        setReminders(response.data); //Gelen veriler reminders state'ine kaydediliyor

        if ("Notification" in window && Notification.permission === "granted") {
          const now = new Date();

          response.data.forEach((reminder) => {
            const taskDateTime = new Date(
              `${reminder.taskDate}T${reminder.taskTime}`,
            );

            const reminderDateTime = new Date(
              taskDateTime.getTime() - reminder.reminderOffset * 60 * 1000,
            );

            const reminderIsDue = reminderDateTime <= now;
            const taskHasNotPassed = taskDateTime > now;
            const reminderKey = `${reminder.id}-${reminder.taskDate}-${reminder.taskTime}`;

            if (
              reminderIsDue &&
              taskHasNotPassed &&
              !notifiedReminderIds.current.has(reminderKey)
            ) {
              new Notification("Planora Hatırlatıcısı", {
                body: `${reminder.content} - ${reminder.reminderOffset} dakika kaldı`,
              });

              notifiedReminderIds.current.add(reminderKey);
            }
          });
        }
      } catch (error) {
        console.error("Hatırlatıcılar getirilemedi : ", error);
      }
    };
    getReminders();
    const reminderInterval = setInterval(getReminders, 60000); // 1 dakika aralıklarla hatırlatıcıları güncelle
    return () => {
      clearInterval(reminderInterval);
    };
  }, []);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const createTodo = async (newTodo) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/tasks",
        newTodo,
      );
      setTodos((currentTodos) => [...currentTodos, response.data]);
      return true;
    } catch (error) {
      console.error("Task oluşturulamadı", error);
      return false;
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/notes");
        setNotes(response.data);
      } catch (error) {
        console.error("Notlar getirilemedi: ", error);
      }
    };
    fetchNotes();
  }, []);

  const createNote = async (newNote) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/notes",
        newNote,
      );
      setNotes((current) => [response.data, ...current]);
      return true;
    } catch (error) {
      console.error("Not oluşturulamadı : ", error);
      return false;
    }
  };

  const updateNote = async (id, updatedNote) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/notes/${id}`,
        updatedNote,
      );

      setNotes((current) =>
        current.map((note) => (note.id === id ? response.data : note)),
      );

      return true;
    } catch (error) {
      console.error("Not güncellenemedi:", error);
      return false;
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/notes/${id}`);
      setNotes((current) => current.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Not silinemedi", error);
    }
  };

  const togglePin = async (id) => {
    try {
      const response = await axios.patch(
        `http://localhost:8080/api/notes/${id}/pin`,
      );
      setNotes((current) =>
        current.map((note) => (note.id === id ? response.data : note)),
      );
    } catch (error) {
      console.error("Pin değiştirilemedi:", error);
    }
  };

  const removeTodo = async (todoId) => {
    try {
      await axios.delete(`http://localhost:8080/api/tasks/${todoId}`);
      setTodos((currentTodos) =>
        currentTodos.filter((todo) => todo.id !== todoId),
      );
    } catch (error) {
      console.error("Task silinemedi:", error);
    }
  };

  const updateTodo = async (id, updatedTodo) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/tasks/${id}`,
        updatedTodo,
      );
      setTodos((currentTodos) =>
        currentTodos.map((todo) => (todo.id == id ? response.data : todo)),
      );
      return true;
    } catch (error) {
      console.error("Task güncellenemedi:", error);

      return false;
    }
  };

  return (
    <div className="App">
      <div className="main">
        {/*childdan parentse geçmek için bi props tanımlıyoruz */}
        {reminders.length > 0 && (
          <div className="reminder-panel">
            <h3>Yaklaşan Hatırlatıcılar</h3>

            {reminders.map((reminder) => (
              <div className="reminder-item" key={reminder.id}>
                <strong>{reminder.content}</strong>
                <span>
                  {reminder.taskDate} {reminder.taskTime}
                </span>
              </div>
            ))}
          </div>
        )}
        <ToDoCreate onCreateTodo={createTodo} />

        <ToDoList
          todos={todos}
          onRemoveTodo={removeTodo}
          onUpdateTodo={updateTodo}
        />
        <div className="notes-section">
          <h2>Notlar</h2>
          <NoteCreate onCreateNote={createNote} />
          <NoteList
            notes={notes}
            onDeleteNote={deleteNote}
            onUpdateNote={updateNote}
            onTogglePin={togglePin}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
