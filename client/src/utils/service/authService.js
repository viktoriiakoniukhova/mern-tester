import { config } from "../axiosconfig";
import { base_url, nav_url } from "../baseUrl";
import axios from "axios";

const register = async (user) => {
  const response = await axios.post(`${base_url}user/register`, user);
  window.location.replace(`${nav_url}login`);

  if (response.data) {
    return response.data;
  }
};

const login = async (user) => {
  const response = await axios.post(`${base_url}user/login`, user);
  window.location.replace(nav_url);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
    const expires = 72 * 60 * 60 * 1000;
    document.cookie =
      "refreshToken = " + response.data.refreshToken + "; expires = " + expires;

    return response.data;
  }
};

const logout = async () => {
  const response = await axios.get(`${base_url}user/logout`, config);
  localStorage.removeItem("user");
  window.location.replace(nav_url);

  if (response.data) {
    return response.data;
  }
};

const getUser = async (userId) => {
  const response = await axios.get(`${base_url}user/${userId}`, config);
  if (response.data) {
    return response.data;
  }
};

const updateUser = async (userId, userData) => {
  const response = await axios.put(`${base_url}user/edit`, userData, config);
  window.location.replace(`${nav_url}${userId}`);
  if (response.data) {
    return response.data;
  }
};

const authService = {
  register,
  login,
  logout,
  getUser,
  updateUser,
};

export default authService;
