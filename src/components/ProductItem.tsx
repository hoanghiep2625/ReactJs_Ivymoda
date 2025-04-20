import React, { useState } from "react";
import { getList } from "../api/provider";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import { usePostItem } from "../hooks/usePostItem";

interface ProductVariantWithDetails {
  _id: string;
  images: {
    main: { url: string };
    hover: { url: string };
  };
  color: {
    actualColor: string;
    colorName: string;
  };
  price: number;
  productId: {
    _id: string;
    name: string;
  };
}

interface ProductItemFormProps {
  namespace: string;
}

const ProductItemForm: React.FC<ProductItemFormProps> = ({ namespace }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["product-variants", namespace],
    queryFn: async () =>
      getList({ namespace: `product-variants/${namespace}` }),
    staleTime: 60 * 1000,
  });

  const productVariants: ProductVariantWithDetails[] = data?.data || [];
  const [colorsByProductId, setColorsByProductId] = useState<{
    [key: string]: { _id: string; actualColor: string }[];
  }>({});

  // Function to fetch colors by productId
  const fetchColorsByProductId = async (productId: string) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/product-variants/colors-product/${productId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch colors");
      }

      const colors = await response.json();
      setColorsByProductId((prev) => ({
        ...prev,
        [productId]: colors,
      }));
    } catch (error) {
      console.error("Error fetching colors:", error);
    }
  };

  return (
    <div className="mb-8">
      {error && (
        <p className="text-red-500 text-center">Lỗi khi tải sản phẩm!</p>
      )}
      <Swiper
        spaceBetween={30}
        slidesPerView={5}
        loop={true}
        autoplay={{ delay: 0, disableOnInteraction: false }}
        speed={7000}
        modules={[Autoplay]}
        breakpoints={{
          320: { slidesPerView: 2 },
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
      >
        {isLoading
          ? Array(5)
              .fill(null)
              .map((_, index) => (
                <SwiperSlide key={index} className="relative">
                  <div className="w-full h-48 bg-gray-200 animate-pulse rounded"></div>
                </SwiperSlide>
              ))
          : productVariants.map((variant: ProductVariantWithDetails) => {
              if (!variant || !variant.productId) {
                return null;
              }

              // Fetch colors for the current productId if not already fetched
              if (!colorsByProductId[variant.productId._id]) {
                fetchColorsByProductId(variant.productId._id);
              }
              return (
                <SwiperSlide key={variant._id} className="relative">
                  <div className="relative">
                    <Link
                      to={`/products/${encodeURIComponent(variant._id)}`}
                      className="group relative block w-full"
                    >
                      <img
                        src={variant.images?.main.url || "/fallback.jpg"}
                        alt={variant.productId.name}
                        className="w-full transition-opacity duration-300 ease-in-out opacity-100 group-hover:opacity-0"
                        loading="lazy"
                        onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
                      />
                      <img
                        src={variant.images?.hover.url || "/fallback.jpg"}
                        alt={variant.productId.name}
                        className="w-full absolute top-0 left-0 transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100"
                        loading="lazy"
                        onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
                      />
                    </Link>
                    <div className="flex gap-2 py-2 justify-between items-center pt-4">
                      <div className="flex gap-2">
                        {colorsByProductId[variant.productId._id]?.map(
                          (color) => (
                            <Link
                              key={color._id}
                              to={`/products/${color._id}`}
                              className="rounded-full w-5 h-5 border border-gray-300"
                              style={{
                                backgroundColor: color.actualColor,
                              }}
                              title={color.actualColor}
                            ></Link>
                          )
                        )}
                      </div>
                      <div>
                        <a className="add-wishlist" data-id={variant._id}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            className="w-4 h-4 text-gray-600"
                          >
                            <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                    <Link
                      to={`/products/${encodeURIComponent(variant._id)}`}
                      className="text-[15px] block hover:text-orange-600 transition-all duration-300 cursor-pointer"
                    >
                      {variant.productId.name}
                    </Link>
                    <div className="font-semibold pt-4">
                      {variant.price?.toLocaleString()}đ
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
      </Swiper>
    </div>
  );
};

export default ProductItemForm;
