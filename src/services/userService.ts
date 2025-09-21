import axios from "axios";
import { Login, RegisterForm } from "../types/user";
import axiosInstance from "../services/axiosInstance";
import { CartData, CartItem, ICartItem } from "../types/cart";

export const login = async (data: Login) => {
  const res = await axiosInstance.post("/auth/login", data);
  return res.data;
};
export const logout = async () => {
  const res = await axiosInstance.post("/auth/logout");
  return res.data;
};
export const info = async () => {
  const res = await axiosInstance.post("/auth/info");
  return res.data;
};
export const register = async (
  userData: RegisterForm
): Promise<RegisterForm> => {
  const response = await axiosInstance.post("/auth/register", userData);
  return response.data;
};
export const addToCart = async (cartItem: CartItem): Promise<any> => {
  const response = await axiosInstance.post("/cart/add", cartItem);
  return response.data;
};
export const deleteCart = async (
  userId: string,
  productVariantId: string,
  size: string
): Promise<any> => {
  const response = await axiosInstance.post(`/cart/remove`, {
    userId,
    productVariantId,
    size,
  });
  return response.data;
};
export const updateCartQuantity = async (
  userId: string,
  productVariantId: string,
  size: string,
  quantity: number
): Promise<any> => {
  const response = await axiosInstance.post(`/cart/update`, {
    userId,
    productVariantId,
    size,
    quantity,
  });
  return response.data;
};
