import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getList } from "../../api/provider";
import { useAuth } from "../../context/auth.context";
import Loading from "../../components/loading";
import MenuInfo from "../../components/menuInfo";
import ClientLayout from "../../layouts/ClientLayout";

const Orders = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => getList({ namespace: "orders/" }),
  });
  const user = useAuth();

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <p>Error loading orders!</p>;
  }

  return (
    <ClientLayout>
      <article className="mt-[98px]">
        <div className="flex gap-4 my-4">
          <div className="text-sm">
            <a href="?action=home">Trang chủ</a>
          </div>
          <div className="text-sm">-</div>
          <div className="text-sm">Tài khoản của tôi</div>
        </div>
      </article>
      <hr className="" />
      <div className="flex pt-8 py-1 gap-12">
        {/* Sidebar Menu */}
        <MenuInfo />

        {/* Main Content: Orders Table */}
        <div className="flex-1 bg-white rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            QUẢN LÝ ĐƠN HÀNG
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse bg-white">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 pr-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Mã đơn hàng
                  </th>
                  <th className="py-3 pr-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Ngày đặt
                  </th>
                  <th className="py-3 pr-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Trạng thái
                  </th>
                  <th className="py-3 pr-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Tổng tiền
                  </th>
                  <th className="py-3 pr-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.orders?.length > 0 ? (
                  data.orders.map((order: any, index: any) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="py-4 pr-6 text-sm text-gray-900">
                        {order.orderId}
                      </td>
                      <td className="py-4 pr-6 text-sm text-gray-900">
                        {new Date(order.createdAt).toLocaleString("vi-VN")}
                      </td>
                      <td className="py-4 pr-6">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === "Huỷ do quá thời gian thanh toán"
                              ? "bg-red-100 text-red-800"
                              : order.status === "Đã thanh toán"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Chờ thanh toán"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "Chờ xác nhận"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "Đang giao hàng"
                              ? "bg-purple-100 text-purple-800"
                              : order.status === "Đã giao hàng"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Đã hủy"
                              ? "bg-red-100 text-red-800"
                              : ""
                          }`}
                        >
                          {order.status === "Huỷ do quá thời gian thanh toán"
                            ? "Quá hạn thanh toán"
                            : order.status}
                        </span>
                      </td>
                      <td className="py-4 pr-6 text-sm text-gray-900 font-medium">
                        {order.totalAmount.toLocaleString("vi-VN")} đ
                      </td>
                      <td className="py-4 pr-6 text-sm font-medium">
                        <div className="flex items-center gap-3">
                          <Link
                            to={`/order-details/${order._id}`}
                            className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                          >
                            Chi tiết
                          </Link>
                          {order.status === "Chờ thanh toán" &&
                            order.paymentUrl && (
                              <a
                                href={order.paymentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-900 transition-colors duration-200"
                              >
                                Thanh toán
                              </a>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-4 text-center text-sm text-gray-600"
                    >
                      Chưa có đơn hàng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default Orders;
