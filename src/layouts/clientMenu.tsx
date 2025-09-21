import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { useMutation, useQuery } from "@tanstack/react-query";
import { logout } from "../services/userService";
import { toast } from "react-toastify";
import useCartQuantity from "../hooks/useCartQuantity";
import { getList } from "../api/provider";
import Loading from "../components/loading";
import { Phone, User, ShoppingBag } from "lucide-react";
import axiosInstance from "../services/axiosInstance";

// Định nghĩa kiểu dữ liệu cho danh mục
interface Category {
  _id: string;
  name: string;
  parentId: string | null;
  level: number;
  [key: string]: any; // Nếu có thêm thuộc tính khác
}

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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null); // Trạng thái dropdown đang mở
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null); // Timeout để ẩn dropdown
  const navigate = useNavigate();

  // Fetch categories
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => getList({ namespace: `categories` }),
    staleTime: 60 * 1000,
  });

  const { data: siteSettingsData, isLoading: isSiteSettingsLoading } = useQuery(
    {
      queryKey: ["site-settings"],
      queryFn: () => getList({ namespace: "site-settings" }),
      staleTime: 5 * 60 * 1000,
    }
  );
  const siteSettings = Array.isArray(siteSettingsData)
    ? siteSettingsData[0]
    : siteSettingsData;

  const handleLogout = () => {
    mutation.mutate();
  };

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem("token");
      setAuth({
        isAuthenticated: false,
        isAuthenticating: false,
        user: { id: "", email: "", role: "" },
      });
      toast.success("Đăng xuất thành công!");
      navigate("/login");
    },
    onError: () => {
      toast.error("Đăng xuất thất bại!");
    },
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      navigate(
        `/search-product?keyword=${encodeURIComponent(searchTerm.trim())}`
      );
      setSearchTerm(""); // clear ô input
      setShowSuggestions(false);
    }
  };

  // Tìm kiếm gợi ý bằng AI
  const searchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axiosInstance.post("/ai/search-suggestions", {
        query: query.trim(),
      });

      if (response.data.suggestions && response.data.suggestions.length > 0) {
        setSuggestions(response.data.suggestions.slice(0, 5)); // Giới hạn 5 gợi ý
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error: any) {
      console.error("Lỗi khi tìm kiếm gợi ý:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
    setIsSearching(false);
  };

  const handleSearchInput = (value: string) => {
    setSearchTerm(value);

    // Debounce search để tránh gọi API quá nhiều
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      searchSuggestions(value);
    }, 300); // Delay 300ms
  };

  const handleSuggestionClick = (productId: string) => {
    navigate(`/products/${productId}`);
    setSearchTerm("");
    setShowSuggestions(false);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".user-menu-container") && isUserMenuOpen) {
        setIsUserMenuOpen(false);
      }
      if (!target.closest(".search-container") && showSuggestions) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen, showSuggestions]);

  if (isLoading) return <Loading />;
  if (error) return <p>Lỗi khi tải danh mục!</p>;
  if (!categories?.data || categories.data.length === 0) {
    return <p>Không có danh mục nào để hiển thị.</p>;
  }

  // Lọc danh mục cấp 1
  const level1Categories = categories.data.filter(
    (category: Category) => category.level === 1
  );

  // Lấy danh mục con
  const getSubCategories = (parentId: string) =>
    categories.data.filter(
      (category: Category) => category.parentId === parentId
    );

  const handleMouseEnter = (categoryId: string) => {
    if (hideTimeout) {
      clearTimeout(hideTimeout); // Xóa timeout nếu chuột quay lại
    }
    setActiveDropdown(categoryId); // Hiển thị dropdown
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setActiveDropdown(null); // Ẩn dropdown sau một khoảng thời gian
    }, 300); // Thời gian trễ (300ms)
    setHideTimeout(timeout);
  };

  return (
    <>
      <header className="grid grid-cols-[0.2fr_1fr_0.2fr] md:grid-cols-[1fr_0.3fr_1fr] items-center py-5 bg-white fixed top-0 w-[90%] z-50 shadow-sm">
        <div className="flex items-center justify-start space-x-4">
          <div className="block md:hidden">
            <img
              src="/images/hamburger.png"
              alt="Menu"
              className="w-6 h-6 cursor-pointer"
              onClick={() => setIsMenuOpen(true)}
            />
          </div>
          <div className="hidden md:flex justify-center items-center gap-4 ml-0">
            {level1Categories.map((category: Category) => {
              const level2Categories = getSubCategories(category._id);

              return (
                <div
                  key={category._id}
                  className="relative flex items-center h-full"
                  onMouseEnter={() => handleMouseEnter(category._id)} // Hiển thị dropdown
                  onMouseLeave={handleMouseLeave} // Ẩn dropdown với độ trễ
                >
                  {/* Danh mục cấp 1 */}
                  <button
                    type="button"
                    className="text-[12px] font-semibold text-gray-800 hover:text-red-500 transition-all duration-300 cursor-default bg-transparent border-none outline-none"
                    style={{ background: "none" }}
                  >
                    {category.name.toUpperCase()}
                  </button>

                  {/* Dropdown danh mục cấp 2 và cấp 3 */}
                  {activeDropdown === category._id &&
                    level2Categories.length > 0 && (
                      <div className="absolute left-0 top-full bg-white shadow-lg border mt-2 flex flex-col z-50 w-auto">
                        <div className="flex">
                          {level2Categories.map((subCategory: Category) => {
                            const level3Categories = getSubCategories(
                              subCategory._id
                            );

                            return (
                              <div
                                key={subCategory._id}
                                className="p-4 min-w-[150px]"
                              >
                                {/* Danh mục cấp 2 */}
                                <Link
                                  to={`/category/${subCategory._id}`}
                                  className="block text-sm font-semibold text-gray-800 hover:text-red-500 transition-all duration-300"
                                >
                                  {subCategory.name}
                                </Link>

                                {/* Danh mục cấp 3 */}
                                {level3Categories.length > 0 && (
                                  <div className="mt-2">
                                    {level3Categories.map(
                                      (childCategory: Category) => (
                                        <Link
                                          key={childCategory._id}
                                          to={`/category/${childCategory._id}`}
                                          className="block text-sm text-gray-600 hover:text-red-500 transition-all duration-300"
                                        >
                                          {childCategory.name}
                                        </Link>
                                      )
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                </div>
              );
            })}
            <Link
              to="/sale"
              className="text-[12px] font-semibold text-[rgb(255,0,0)] flex items-center h-full"
            >
              THÁNG VÀNG SĂN SALE
            </Link>
            <Link
              to="/collection"
              className="text-[12px] font-semibold text-gray-800 hover:text-red-500 transition-all duration-300 flex items-center h-full"
            >
              BỘ SƯU TẬP
            </Link>
            <Link
              to="/about"
              className="text-[12px] font-semibold text-gray-800 hover:text-red-500 transition-all duration-300 flex items-center h-full"
            >
              VỀ CHÚNG TÔI
            </Link>
          </div>
        </div>

        <div className="flex justify-center items-center">
          <Link to="/">
            <img
              src={siteSettings?.logo?.url || "/images/logo.png"}
              alt="Logo"
              className="w-32 h-auto"
            />
          </Link>
        </div>

        <div className="flex items-center justify-end space-x-6">
          <div className="hidden md:flex relative h-9 border items-center w-full max-w-xs search-container">
            <div className="flex px-2 gap-3 items-center w-full">
              <button
                type="button"
                onClick={() => {
                  if (searchTerm.trim() !== "") {
                    navigate(
                      `/search-product?keyword=${encodeURIComponent(
                        searchTerm.trim()
                      )}`
                    );
                    setSearchTerm("");
                    setShowSuggestions(false);
                  }
                }}
                className="focus:outline-none"
                tabIndex={-1}
                aria-label="Tìm kiếm"
              >
                <img
                  src="/images/magnifying-glass.png"
                  alt="Search"
                  className="w-4 h-4 flex-shrink-0 cursor-pointer"
                />
              </button>
              <input
                type="text"
                name="searchname"
                id="searchname"
                value={searchTerm}
                onChange={(e) => handleSearchInput(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="TÌM KIẾM SẢN PHẨM"
                className="text-xs p-0 outline-none border-0 focus:outline-none focus:ring-0 w-full"
              />
              {isSearching && (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              )}
            </div>

            {/* Dropdown gợi ý sản phẩm */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-lg z-50 max-h-80 overflow-y-auto">
                <div className="p-2">
                  <div className="text-xs text-gray-500 mb-2 px-2">
                    Gợi ý từ AI ({suggestions.length} sản phẩm)
                  </div>
                  {suggestions.map((product, index) => (
                    <div
                      key={product._id || index}
                      onClick={() => handleSuggestionClick(product._id)}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer rounded-md transition-colors"
                    >
                      <div className="w-12 h-12 overflow-hidden rounded-md border border-gray-200 flex-shrink-0">
                        <img
                          src={
                            product.images?.main?.url ||
                            "/images/placeholder.png"
                          }
                          alt={product.productId?.name || "Sản phẩm"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/images/placeholder.png";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {product.productId?.name || "Tên sản phẩm"}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-semibold text-red-600">
                            {product.sizes?.[0]?.price?.toLocaleString("vi-VN")}
                            ₫
                          </span>
                          <span className="text-xs text-gray-500">
                            {product.color?.colorName}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-blue-600">Xem →</div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 p-2">
                  <button
                    onClick={() => {
                      if (searchTerm.trim()) {
                        navigate(
                          `/search-product?keyword=${encodeURIComponent(
                            searchTerm.trim()
                          )}`
                        );
                        setSearchTerm("");
                        setShowSuggestions(false);
                      }
                    }}
                    className="w-full text-center text-xs text-blue-600 hover:text-blue-800 py-1"
                  >
                    Xem tất cả kết quả cho "{searchTerm}"
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:block">
            <Link to="/support">
              <Phone className="w-5 h-5 text-gray-800" strokeWidth={1} />
            </Link>
          </div>

          <div className="hidden md:block relative user-menu-container">
            <User
              className="w-5 h-5 text-gray-800 cursor-pointer"
              strokeWidth={1}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            />

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border shadow-lg z-50 py-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/user-details"
                      className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      Thông tin tài khoản
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      Đơn hàng của tôi
                    </Link>
                    <Link
                      to="/loginHistory"
                      className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      Lịch sử đăng nhập
                    </Link>
                    <Link
                      to="/viewed-products"
                      className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      Sản phẩm đã xem
                    </Link>
                    <Link
                      to="/wish-products"
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

          <div className="relative flex items-center justify-center cursor-pointer">
            <Link to="/cart">
              <ShoppingBag className="w-5 h-5 text-gray-800" strokeWidth={1} />
            </Link>
            {quantity > 0 && (
              <span className="absolute -top-[-10px] -right-[5px] bg-black text-white text-[10px] w-3 h-3 rounded-full flex items-center justify-center">
                {quantity}
              </span>
            )}
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 md:hidden">
          <div className="flex justify-between p-4">
            <img src="/images/logo.png" alt="Logo" className="w-24 h-auto" />
            <button onClick={() => setIsMenuOpen(false)}>
              <img src="/images/close.png" alt="Đóng" className="w-6 h-6" />
            </button>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <input
                type="text"
                placeholder="TÌM KIẾM SẢN PHẨM"
                className="w-full p-2 border"
              />
            </div>
            <div className="space-y-2">
              {categories?.data.map((category: Category) => (
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
