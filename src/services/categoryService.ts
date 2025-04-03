import axiosInstance from './axiosInstance';
import { Category } from '../types/categories';

const API_URL = import.meta.env.VITE_API_URL;
interface CategoryResponse {
    docs: Category[];
}
export const getCategories = async (): Promise<CategoryResponse> => {
    const response = await axiosInstance.get(`${API_URL}/categories`);
    return response.data;
};
export const addCategory = async (newCategory: {
    name: string;
    parentId: string | null;
    level: number;
}) => {
    const response = await axiosInstance.post<Category>(`${API_URL}/admin/categories`, newCategory);
    return response.data;
};
export const deleteCategory = async (id: string) => {
    const response = await axiosInstance.delete(`${API_URL}/admin/categories/${id}`);
    return response.data;
};
