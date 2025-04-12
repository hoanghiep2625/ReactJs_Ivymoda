import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { Category } from "../types/categories";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../services/userService";
import { toast } from "react-toastify";
import useCartQuantity from "../hooks/useCartQuantity";

const MenuClient = () => {
  const quantity = useCartQuantity();
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("MenuClient phải được sử dụng trong AuthProvider");
  }
  const { auth, setAuth } = context;
  const { isAuthenticated, user } = auth;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fakeCategories: Category[] = [
      {
        _id: "1",
        name: "Nam",
        parentId: null,
        ancestors: [],
        level: 0,
        createdAt: "",
        updatedAt: "",
      },
      {
        _id: "2",
        name: "Nữ",
        parentId: null,
        ancestors: [],
        level: 0,
        createdAt: "",
        updatedAt: "",
      },
      {
        _id: "3",
        name: "Trẻ Trâu",
        parentId: null,
        ancestors: [],
        level: 0,
        createdAt: "",
        updatedAt: "",
      },
    ];
    setCategories(fakeCategories);
  }, []);

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem("token");
      setAuth({
        isAuthenticated: false,
        isAuthenticating: false,
        user: { id: "", email: "", role: "" },
      });
      toast.success("Đăng xuất thành công!", {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/login");
    },
    onError: () => {
      toast.error("Đăng xuất thất bại!", {
        position: "top-right",
        autoClose: 2000,
      });
    },
  });

  const handleLogout = () => {
    mutation.mutate();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".user-menu-container") && isUserMenuOpen) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <>
      {/* Thanh menu trên cùng */}
      <header className="grid grid-cols-[0.2fr_1fr_0.2fr] md:grid-cols-[1fr_0.3fr_1fr] items-center py-5 bg-white fixed top-0 w-[90%] z-50 shadow-sm">
        {/* Cột trái: Hamburger trên màn hình nhỏ, Danh mục trên màn hình lớn */}
        <div className="flex items-center justify-start space-x-4">
          <div className="block md:hidden">
            <img
              src="/images/hamburger.png"
              alt="Menu"
              className="w-6 h-6 cursor-pointer"
              onClick={() => setIsMenuOpen(true)}
            />
          </div>
          <div className="hidden md:flex space-x-4">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/category/${category._id}`}
                className="text-[12px] font-semibold text-gray-800 hover:text-red-500 transition-all duration-300"
              >
                {category.name.toUpperCase()}
              </Link>
            ))}
            <Link
              to="/sale"
              className="text-[12px] font-semibold text-[rgb(255,0,0)]"
            >
              THÁNG VÀNG SĂN SALE
            </Link>
            <Link
              to="/collection"
              className="text-[12px] font-semibold text-gray-800 hover:text-red-500 transition-all duration-300"
            >
              BỘ SƯU TẬP
            </Link>
            <Link
              to="/about"
              className="text-[12px] font-semibold text-gray-800 hover:text-red-500 transition-all duration-300"
            >
              VỀ CHÚNG TÔI
            </Link>
          </div>
        </div>

        {/* Cột giữa: Logo */}
        <div className="flex justify-center items-center">
          <Link to="/">
            <img src="/images/logo.png" alt="Logo" className="w-32 h-auto" />
          </Link>
        </div>

        {/* Cột phải: Các biểu tượng */}
        <div className="flex items-center justify-end space-x-6">
          {/* Biểu tượng Tìm kiếm */}
          <div className="hidden md:flex relative h-9 border items-center w-full max-w-xs">
            <div className="flex px-2 gap-3 items-center w-full">
              <img
                src="/images/magnifying-glass.png"
                alt="Search"
                className="w-4 h-4 flex-shrink-0"
              />
              <input
                type="text"
                name="searchname"
                id="searchname"
                placeholder="TÌM KIẾM SẢN PHẨM"
                className="text-xs p-0 outline-none border-0 focus:outline-none focus:ring-0 w-full"
              />
            </div>
          </div>

          {/* Biểu tượng Hỗ trợ */}
          <div className="hidden md:block">
            <Link to="/support">
              <img
                src="/images/earphones.png"
                alt="Hỗ trợ"
                className="w-5 h-auto"
              />
            </Link>
          </div>

          {/* Biểu tượng Người dùng */}
          <div className="hidden md:block relative user-menu-container">
            <img
              src="/images/user.png"
              alt="Người dùng"
              className="w-5 h-auto cursor-pointer"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            />
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border shadow-lg z-50 py-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/account"
                      className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      Thông tin tài khoản
                    </Link>
                    {user.role === "3" && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                      >
                        Quản trị admin
                      </Link>
                    )}
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      Đơn hàng của tôi
                    </Link>
                    <Link
                      to="/viewed-products"
                      className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      Sản phẩm đã xem
                    </Link>
                    <Link
                      to="/favorites"
                      className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      Sản phẩm yêu thích
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={mutation.isPending}
                      className={`block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 ${
                        mutation.isPending
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {mutation.isPending ? "Đang đăng xuất..." : "Đăng xuất"}
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                  >
                    Đăng nhập
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Biểu tượng Giỏ hàng */}
          <div className="relative flex items-center justify-center cursor-pointer">
            <Link to="/cart">
              <img
                src="/images/shopping-bag.png"
                alt="Giỏ hàng"
                className="w-7 h-auto"
              />
            </Link>
            {quantity > 0 && (
              <span className="absolute -top-[-15px] -right-[5px] bg-black text-white text-[10px] w-3 h-3 rounded-full flex items-center justify-center">
                {quantity}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Menu nổi cho màn hình nhỏ */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 md:hidden">
          <div className="flex justify-between p-4">
            <img src="/images/logo.png" alt="Logo" className="w-24 h-auto" />
            <button onClick={() => setIsMenuOpen(false)}>
              <img src="/images/close.png" alt="Đóng" className="w-6 h-6" />
            </button>
          </div>
          <div className="p-4">
            {/* Ô tìm kiếm */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="TÌM KIẾM SẢN PHẨM"
                className="w-full p-2 border"
              />
            </div>
            <div className="space-y-2">
              {/* Danh mục */}
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/category/${category._id}`}
                  className="block text-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              <Link
                to="/sale"
                className="block text-[rgb(255,0,0)]"
                onClick={() => setIsMenuOpen(false)}
              >
                THÁNG VÀNG SĂN SALE
              </Link>
              <Link
                to="/collection"
                className="block text-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                BỘ SƯU TẬP
              </Link>
              <Link
                to="/about"
                className="block text-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                VỀ CHÚNG TÔI
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuClient;
