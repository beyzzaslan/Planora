import { useCallback, useEffect, useState } from "react";
import apiClient from "../api/apiClient";

function useNotes(currentUser) {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchNotes = async () => {
      try {
        const response = await apiClient.get("/notes");
        setNotes(response.data);
      } catch (error) {
        console.error("Notlar getirilemedi:", error);
      }
    };

    fetchNotes();
  }, [currentUser]);

  const createNote = async (newNote) => {
    try {
      const response = await apiClient.post("/notes", newNote);

      setNotes((currentNotes) => [
        response.data,
        ...currentNotes,
      ]);

      return true;
    } catch (error) {
      console.error("Not oluşturulamadı:", error);
      return false;
    }
  };

  const updateNote = async (id, updatedNote) => {
    try {
      const response = await apiClient.put(
        `/notes/${id}`,
        updatedNote,
      );

      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          note.id === id ? response.data : note,
        ),
      );

      return true;
    } catch (error) {
      console.error("Not güncellenemedi:", error);
      return false;
    }
  };

  const deleteNote = async (id) => {
    try {
      await apiClient.delete(`/notes/${id}`);

      setNotes((currentNotes) =>
        currentNotes.filter((note) => note.id !== id),
      );

      return true;
    } catch (error) {
      console.error("Not silinemedi:", error);
      return false;
    }
  };

  const togglePin = async (id) => {
    try {
      const response = await apiClient.patch(
        `/notes/${id}/pin`,
      );

      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          note.id === id ? response.data : note,
        ),
      );

      return true;
    } catch (error) {
      console.error("Pin değiştirilemedi:", error);
      return false;
    }
  };

  const clearNoteData = useCallback(() => {
    setNotes([]);
  }, []);

  const pinnedNotes = notes.filter((note) => note.pinned);

  return {
    notes,
    pinnedNotes,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    clearNoteData,
  };
}

export default useNotes;