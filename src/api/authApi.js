import axios from "axios";

const AUTH_URL = "http://localhost:8080/api/auth";

export const login = async (username, password) => {
  const res = await axios.post(`${AUTH_URL}/signin`, {
    username,
    password,
  });

  localStorage.setItem("user", JSON.stringify(res.data));
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};
