import axiosInstance from "./axiosInstance";
import { Category } from "../types/categories";

interface CategoryResponse {
  docs: Category[];
}
export const getCategories = async (): Promise<CategoryResponse> => {
  const response = await axiosInstance.get("/categories");
  return response.data;
};
