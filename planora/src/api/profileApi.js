import apiClient, { API_BASE_URL } from "./apiClient";

export async function updateProfile(profileData) {
  const response = await apiClient.put("/profile", profileData);

  return response.data;
}

export async function uploadProfileAvatar(file) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await apiClient.post(
    "/profile/avatar",
    formData,
  );

  return response.data;
}

export function buildProfileAvatarUrl(
  avatarPath,
  version,
) {
  if (!avatarPath) {
    return null;
  }

  return `${API_BASE_URL}${avatarPath}?v=${version}`;
}