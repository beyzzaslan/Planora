import apiClient from "./apiClient";

export async function updateProfile(profileData) {
  const response = await apiClient.put("/profile", profileData);

  return response.data;
}
