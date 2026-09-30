import { useCallback, useEffect, useRef, useState } from "react";
import apiClient from "../api/apiClient";
import useNotes from "./hooks/useNotes";
function useTasks(currentUser) {
  const [todos, setTodos] = useState([]);
  const [reminders, setReminders] = useState([]);
  const notifiedReminderIds = useRef(new Set());

  useEffect(() => {
    if (!currentUser) return;

    const getTasks = async () => {
      try {
        const response = await apiClient.get("/tasks");
        setTodos(response.data);
      } catch (error) {
        console.error("Görevler getirilemedi:", error);
      }
    };

    getTasks();
  }, [currentUser]);

  const refreshReminders = useCallback(async () => {
    if (!currentUser) {
      return;
    }

    try {
      const response = await apiClient.get("/tasks/reminders");
      setReminders(response.data);

      if (
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        const now = new Date();

        response.data.forEach((reminder) => {
          const taskDateTime = new Date(
            `${reminder.taskDate}T${reminder.taskTime}`,
          );

          const reminderDateTime = new Date(
            taskDateTime.getTime() -
              reminder.reminderOffset * 60 * 1000,
          );

          const reminderIsDue = reminderDateTime <= now;
          const taskHasNotPassed = taskDateTime > now;

          const reminderKey =
            `${reminder.id}-${reminder.taskDate}-${reminder.taskTime}`;

          if (
            reminderIsDue &&
            taskHasNotPassed &&
            !notifiedReminderIds.current.has(reminderKey)
          ) {
            new Notification("Planora Hatırlatıcısı", {
              body:
                `${reminder.content} - ` +
                `${reminder.reminderOffset} dakika kaldı`,
            });

            notifiedReminderIds.current.add(reminderKey);
          }
        });
      }
    } catch (error) {
      console.error("Hatırlatıcılar getirilemedi:", error);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const initialReminderTimeout =
      setTimeout(refreshReminders, 0);

    const reminderInterval =
      setInterval(refreshReminders, 60000);

    return () => {
      clearTimeout(initialReminderTimeout);
      clearInterval(reminderInterval);
    };
  }, [currentUser, refreshReminders]);

  useEffect(() => {
    if (
      currentUser &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission();
    }
  }, [currentUser]);

  const createTodo = async (newTodo) => {
    try {
      const response = await apiClient.post("/tasks", newTodo);

      setTodos((currentTodos) => [
        ...currentTodos,
        response.data,
      ]);

      refreshReminders();
      return true;
    } catch (error) {
      console.error("Görev oluşturulamadı:", error);
      return false;
    }
  };

  const removeTodo = async (todoId) => {
    try {
      await apiClient.delete(`/tasks/${todoId}`);

      setTodos((currentTodos) =>
        currentTodos.filter((todo) => todo.id !== todoId),
      );

      refreshReminders();
      return true;
    } catch (error) {
      console.error("Görev silinemedi:", error);
      return false;
    }
  };

  const updateTodo = async (id, updatedTodo) => {
    try {
      const response = await apiClient.put(
        `/tasks/${id}`,
        updatedTodo,
      );

      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === id ? response.data : todo,
        ),
      );

      refreshReminders();
      return true;
    } catch (error) {
      console.error("Görev güncellenemedi:", error);
      return false;
    }
  };

  const completedTodos = todos.filter(
    (todo) => todo.status === "COMPLETED",
  ).length;

  const pendingTodos = todos.length - completedTodos;

  const clearTaskData = useCallback(() => {
    setTodos([]);
    setReminders([]);
    notifiedReminderIds.current.clear();
  }, []);

  return {
    todos,
    reminders,
    completedTodos,
    pendingTodos,
    createTodo,
    removeTodo,
    updateTodo,
    clearTaskData,
  };
}

export default useTasks;
