import { config } from "../axiosconfig";
import { base_url, nav_url } from "../baseUrl";
import axios from "axios";

const register = async (user, setError) => {
  try {
    const response = await axios.post(`${base_url}user/register`, user);
    window.location.replace(`${nav_url}/login`);

    if (response.data) {
      return response.data;
    }
  } catch (error) {
    setError(error.response.data.message);
  }
};

const login = async (user, setError) => {
  try {
    const response = await axios.post(`${base_url}user/login`, user);
    window.location.replace(nav_url);

    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
      const expires = 72 * 60 * 60 * 1000;
      document.cookie =
        "refreshToken = " +
        response.data.refreshToken +
        "; expires = " +
        expires;

      return response.data;
    }
  } catch (error) {
    setError(error.response.data.message);
  }
};

const logout = async () => {
  try {
    const response = await axios.get(`${base_url}user/logout`, config);
    localStorage.removeItem("user");
    window.location.replace(nav_url);

    if (response.data) {
      return response.data;
    }
  } catch (error) {
    window.alert(error.response.data.message);
  }
};

const getUser = async (userId) => {
  try {
    const response = await axios.get(`${base_url}user/${userId}`, config);
    if (response.data) {
      return response.data;
    }
  } catch (error) {}
};

const updateUser = async (userId, userData, setError) => {
  try {
    const response = await axios.put(`${base_url}user/edit`, userData, config);
    window.location.replace(`${nav_url}/${userId}`);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    setError(error.response.data.message);
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
