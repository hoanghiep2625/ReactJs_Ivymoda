import axiosInstance from "../services/axiosInstance";

axiosInstance.defaults.baseURL = import.meta.env.VITE_API_URL;

export type ProviderProps = {
  namespace: string;
  id?: string;
  values?: FormData;
};

export const getList = async ({ namespace }: ProviderProps) => {
  try {
    const { data } = await axiosInstance.get(`/${namespace}`);
    console.log("✅ API Response:", JSON.stringify(data, null, 2)); // <-- log rõ ràng
    return data || [];
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách:", error);
    return [];
  }
};

export const getById = async ({ namespace, id }: ProviderProps) => {
  try {
    const { data } = await axiosInstance.get(`/${namespace}/${id}`);
    return data || [];
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm theo ID:", error);
    return null;
  }
};
export const deleteById = async ({ namespace, id }: ProviderProps) => {
  try {
    const { data } = await axiosInstance.delete(`/${namespace}/${id}`);
    return data || [];
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm theo ID:", error);
    return null;
  }
};
export const postItem = async ({ namespace, values }: ProviderProps) => {
  try {
    const { data } = await axiosInstance.post(`/${namespace}`, values);
    return data;
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);
    throw error;
  }
};
