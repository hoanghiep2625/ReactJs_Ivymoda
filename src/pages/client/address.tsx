import MenuInfo from "../../components/menuInfo";
import { useQuery } from "@tanstack/react-query";
import { getList } from "../../api/provider";
import ClientLayout from "../../layouts/ClientLayout";

const Address = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => getList({ namespace: "users" }),
  });
  console.log(data);

  return (
    <>
      <ClientLayout>
        <article className="mb-8 mt-8 ">
          <hr />
          <nav>
            <div className="flex gap-4 mt-[20px]">
              <div className="text-base">
                <a href="?action=home">Trang chủ</a>
              </div>
              <div className="text-base">-</div>
              <div className="text-base">Tài khoản của tôi</div>
            </div>
          </nav>
          <hr className="border-t-1 border-gray-100 " />
          <div className="grid grid-cols-[1fr_2.5fr]">
            <div className="p-8 w-[300px] font-bold rounded-tl-[40px] rounded-br-[40px] h-auto mt-2 ">
              <nav>
                <MenuInfo />
              </nav>
            </div>
            <div className=" mt-8">
              <div className="flex justify-between">
                <h2 className="text-2xl font-bold mb-4">Sổ địa chỉ</h2>
                <button className="rounded-tl-xl rounded-br-xl border-2 p-2 flex bg-black hover:bg-white text-white hover:text-black text-[18px] mr-20 hover:border-2 hover:border-black ">
                  <svg
                    className="w-5 h-5 border-2 border-white  rounded-full p-1 mt-1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path
                      fill="#ffffff"
                      className=""
                      d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32
                                     14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3
                                      32-32s-14.3-32-32-32l-144 0 0-144z"
                    />
                  </svg>
                  <div className="">Thêm địa chỉ</div>
                </button>
              </div>
              <div className="border-2 w-[470px] h-auto rounded-tl-2xl rounded-br-2xl">
                <div>
                  <div className="flex justify-between">
                    <div className="p-6 font-semibold ">Thành Lâm</div>
                    <div className="flex gap-2 p-4">
                      <div className="p-2">Sửa</div>
                      <div className="rounded-tl-xl rounded-br-xl border-2 p-2 bg-black text-white hover:bg-white hover:text-black hover:border-black">
                        Mặc định
                      </div>
                    </div>
                  </div>
                  <div className="px-6 mb-4">Điện thoại</div>
                  <div className="px-6 mb-4">Địa chỉ</div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </ClientLayout>
    </>
  );
};

export default Address;
