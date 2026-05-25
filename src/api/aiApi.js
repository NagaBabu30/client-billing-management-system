import axios from "axios";

const API_URL = "http://localhost:8080/api/ai";

export const askAI = async (message) => {

  const response = await axios.post(`${API_URL}/chat`, {
    message: message
  });

  return response.data.reply;
};