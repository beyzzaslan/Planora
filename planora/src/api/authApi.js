import apiClient from "./apiClient";

export async function registerUser(registerData) {
  const response = await apiClient.post("/auth/register", registerData);

  return response.data;
}

export async function loginUser(loginData) {
  const response = await apiClient.post("/auth/login", loginData);

  return response.data;
}

export async function getCurrentUser() {
  const response = await apiClient.get("/auth/me");

  return response.data;
}

export async function logoutUser() {
  const response = await apiClient.post("/auth/logout");

  return response.data;
}
