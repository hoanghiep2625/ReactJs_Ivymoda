import React from "react";
import HeaderClient from "../../layouts/clientHeader";
import MenuClient from "../../layouts/clientMenu";
import ProductItemForm from "../../components/ProductItem";
import Slideshow from "../../components/clientSlideShow";
import Footer from "../../layouts/clientFooter";

const Slideshow1 = () => {
  const images1 = [
    "/images/banner1.webp",
    "/images/banner1.2.webp",
    "/images/banner1.3.webp",
  ];

  return <Slideshow images={images1} autoplayDelay={3000} />;
};
const Slideshow2 = () => {
  const images3 = [
    "/images/banner2.1.webp",
    "/images/banner2.2.webp",
    "/images/banner2.3.webp",
  ];
  return <Slideshow images={images3} slidesPerView={2} autoplayDelay={2000} />;
};

const Home = () => {
  return (
    <>
      <HeaderClient />
      <div className="mx-[5%]">
        {/* Thanh menu */}
        <MenuClient />

        {/* Banner Sale */}
        <article className="mt-[82px]">
          <div className="grid grid-cols-[1fr_1.3fr_1fr] items-center justify-center pb-6">
            <div className="bg-[#D73831] text-[14px] text-white py-1 px-2 font-semibold text-center">
              SALE OFF 50%
            </div>
            <div className="bg-[#DC633A] text-[14px] text-white py-1 px-2 font-semibold text-center">
              SALE OFF 30%
            </div>
            <div className="bg-[#AC2F33] text-[14px] text-white py-1 px-2 font-semibold text-center">
              LAST SALE FROM 100K
            </div>
          </div>

          <Slideshow1 />

          {/* NEW ARRIVAL */}
          <p className="text-center font-semibold text-3xl pt-10">
            NEW ARRIVAL
          </p>
          <div className="flex justify-center pb-8 pt-4">
            <p className="pr-6 text-xl underline">IVY moda</p>
            <p className="pl-6 text-xl text-gray-500">IVY men</p>
          </div>
          {/* Truyền namespace cho ProductItemForm */}
          <ProductItemForm namespace="" />

          <div className="p-3 border border-black text-center w-32 h-12 mx-auto rounded-tl-[25px] rounded-br-[25px] mb-12 hover:bg-black hover:text-white transition-all duration-300 cursor-pointer">
            Xem tất cả
          </div>

          {/* BANNER FALL - WINTER */}
          <p className="text-center font-semibold text-3xl pb-2">
            FALL - WINTER COLLECTION 2024
          </p>
          <div className="flex justify-center pb-8">
            <p className="pr-6 text-xl underline">IVY moda</p>
            <p className="pl-6 text-xl text-gray-500">IVY men</p>
          </div>
          {/* Truyền namespace cho ProductItemForm */}
          <ProductItemForm namespace="" />

          <div className="p-3 border border-black text-center w-32 h-12 mx-auto rounded-tl-[25px] rounded-br-[25px] mb-12 hover:bg-black hover:text-white transition-all duration-300 cursor-pointer">
            Xem tất cả
          </div>
          <img
            className="rounded-tl-[80px] rounded-br-[80px]"
            src="/images/banner1.4.webp"
            alt=""
          />
          <div className="p-4"></div>
          <Slideshow2 />
        </article>
        <Footer />
      </div>
    </>
  );
};

export default Home;
