import { useCallback, useEffect, useState } from "react";
import apiClient from "../api/apiClient";

function useMedia(currentUser, showToast) {
  const [mediaList, setMediaList] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchMedia = async () => {
      try {
        const response = await apiClient.get("/media");
        setMediaList(response.data);
      } catch (error) {
        console.error("Medya listesi getirilemedi:", error);
      }
    };

    fetchMedia();
  }, [currentUser]);

  const createMedia = async (newMedia) => {
    try {
      const response = await apiClient.post("/media", newMedia);
      setMediaList((currentMedia) => [response.data, ...currentMedia]);
      return true;
    } catch (error) {
      console.error("Medya oluşturulamadı:", error);
      return false;
    }
  };

  const uploadMedia = async (title, file) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    try {
      const response = await apiClient.post("/media/upload", formData);
      setMediaList((currentMedia) => [response.data, ...currentMedia]);
      return true;
    } catch (error) {
      console.error("Dosya yüklenemedi:", error);
      return false;
    }
  };

  const deleteMedia = async (id) => {
    try {
      await apiClient.delete(`/media/${id}`);

      setMediaList((currentMedia) =>
        currentMedia.filter((media) => media.id !== id),
      );

      showToast("Kaynak başarıyla silindi.");
      return true;
    } catch (error) {
      console.error("Kaynak silinemedi:", error);
      showToast("Kaynak silinemedi. Lütfen tekrar dene.", "error");
      return false;
    }
  };

  const updateMedia = async (id, updatedMedia) => {
    try {
      const response = await apiClient.put(`/media/${id}`, updatedMedia);

      setMediaList((currentMedia) =>
        currentMedia.map((media) =>
          media.id === id ? response.data : media,
        ),
      );

      showToast("Kaynak başarıyla güncellendi.");
      return true;
    } catch (error) {
      console.error("Kaynak güncellenemedi:", error);
      showToast("Kaynak güncellenemedi. Lütfen tekrar dene.", "error");
      return false;
    }
  };

  const clearMediaData = useCallback(() => {
    setMediaList([]);
  }, []);

  return {
    mediaList,
    createMedia,
    uploadMedia,
    deleteMedia,
    updateMedia,
    clearMediaData,
  };
}

export default useMedia;
