import api from "../axios";

// 👁️ View clients (ACCOUNTANT)
export const getAccClients = () => {
  return api.get("/accountant/clients");
};
