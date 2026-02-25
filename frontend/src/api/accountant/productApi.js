import api from "../axios";

// 👁️ View products (ACCOUNTANT)
export const getAccProducts = () => {
  return api.get("/accountant/products");
};
