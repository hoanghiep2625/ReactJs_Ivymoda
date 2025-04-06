import {
  createContext,
  ReactNode,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { info, logout } from "../services/userService";
import { AxiosError } from "axios";
import Loading from "../components/loading";

// Định nghĩa state xác thực
interface AuthState {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

// Interface cho context
interface AuthContextType {
  auth: AuthState;
  setAuth: Dispatch<SetStateAction<AuthState>>;
}

// Tạo context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook để dùng context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth phải được sử dụng trong AuthProvider");
  }
  return context;
};

// Props cho AuthWrapper
interface AuthWrapperProps {
  children: ReactNode;
}

// Component bao bọc xác thực
export const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    isAuthenticating: true,
    user: {
      id: "",
      email: "",
      role: "",
    },
  });

  // Gọi API user info nếu có token
  const { data, isLoading, error } = useQuery({
    queryKey: ["userInfo"],
    queryFn: info,
    enabled: !!localStorage.getItem("token"),
    staleTime: 1000 * 60 * 5, // optional: cache 5 phút
  });

  // Xử lý logout
  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("token");
      setAuth({
        isAuthenticated: false,
        isAuthenticating: false,
        user: {
          id: "",
          email: "",
          role: "",
        },
      });
      window.location.href = "/login";
    } catch (logoutError) {
      console.error("Lỗi khi đăng xuất:", logoutError);
    }
  };

  // Khi có thay đổi từ react-query, cập nhật lại auth
  useEffect(() => {
    console.log("📦 useEffect: ", { data, error, isLoading });

    if (isLoading) {
      setAuth((prev) => ({ ...prev, isAuthenticating: true }));
    } else if (data) {
      setAuth({
        isAuthenticated: true,
        isAuthenticating: false,
        user: {
          id: data.id || "",
          email: data.email || "",
          role: data.role || "",
        },
      });
    } else if (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        handleLogout();
      } else {
        setAuth({
          isAuthenticated: false,
          isAuthenticating: false,
          user: {
            id: "",
            email: "",
            role: "",
          },
        });
      }
    } else {
      // Nếu không có data, không có error, nhưng isLoading = false → fallback
      setAuth((prev) => ({ ...prev, isAuthenticating: false }));
    }
  }, [data, error, isLoading]);

  // Hiển thị loading khi đang xác thực
  if (auth.isAuthenticating) {
    return <Loading />;
  }

  // Trả về context cho toàn bộ app
  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
