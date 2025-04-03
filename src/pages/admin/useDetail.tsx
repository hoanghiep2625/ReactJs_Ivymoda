import { useQuery } from '@tanstack/react-query';
import { getById } from '../../api/provider';
import AdminHeader from '../../layouts/adminHeader';
import AdminMenu from '../../layouts/adminMenu';
import { useParams } from 'react-router-dom';
import Loading from '../../components/loading';

const UseDetail = () => {
    const { id } = useParams();
    const { data, isLoading, error } = useQuery({
        queryKey: ['users', id],
        queryFn: async () => getById({ namespace: `admin/users`, id: id }),
        staleTime: 60 * 1000,
    });

    console.log(data);

    if (isLoading) return <Loading />;
    if (error) return <div>Error loading users</div>;

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <AdminHeader />
            <div className="flex flex-1 overflow-hidden">
                <AdminMenu className="w-64 bg-black p-6" />
                <main className="mt-[-20px] flex-grow bg-gray-100">
                    <div className="bg-white p-8 shadow-lg rounded-lg">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
                            Thông tin người dùng
                        </h2>
                        <form className="space-y-6">
                            {/* Thông tin cơ bản */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">
                                        Họ và tên đệm
                                    </label>
                                    <input
                                        disabled
                                        type="text"
                                        value={data.first_name}
                                        className="mt-2 w-full p-3 border rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">
                                        Tên
                                    </label>
                                    <input
                                        disabled
                                        type="text"
                                        value={data.name}
                                        className="mt-2 w-full p-3 border rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">
                                        Email
                                    </label>
                                    <input
                                        disabled
                                        type="email"
                                        value={data.email}
                                        className="mt-2 w-full p-3 border rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">
                                        SĐT
                                    </label>
                                    <input
                                        disabled
                                        type="text"
                                        value={data.phone}
                                        className="mt-2 w-full p-3 border rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">
                                        Ngày sinh
                                    </label>
                                    <input
                                        disabled
                                        type="text"
                                        value={data.date}
                                        className="mt-2 w-full p-3 border rounded-lg bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">
                                        Giới tính
                                    </label>
                                    <input
                                        disabled
                                        type="text"
                                        value={
                                            data.sex === '1'
                                                ? 'Nam'
                                                : data.sex === '0'
                                                  ? 'Nữ'
                                                  : 'Khác'
                                        }
                                        className="mt-2 w-full p-3 border rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* Bảng hiển thị danh sách địa chỉ giao hàng */}
                            <div className="mt-8">
                                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                                    Danh sách địa chỉ giao hàng
                                </h3>
                                {data.shipping_addresses.length > 0 ? (
                                    <table className="table-auto w-full text-left border-collapse">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2 border">Tên người nhận</th>
                                                <th className="px-4 py-2 border">Số điện thoại</th>
                                                <th className="px-4 py-2 border">Tỉnh/Thành phố</th>
                                                <th className="px-4 py-2 border">Quận/Huyện</th>
                                                <th className="px-4 py-2 border">Phường/Xã</th>
                                                <th className="px-4 py-2 border">Địa chỉ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.shipping_addresses.map(
                                                (address: any, index: any) => (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-4 py-2 border">
                                                            {address.receiver_name || 'N/A'}
                                                        </td>
                                                        <td className="px-4 py-2 border">
                                                            {address.phone || 'N/A'}
                                                        </td>
                                                        <td className="px-4 py-2 border">
                                                            {address.city || 'N/A'}
                                                        </td>
                                                        <td className="px-4 py-2 border">
                                                            {address.district || 'N/A'}
                                                        </td>
                                                        <td className="px-4 py-2 border">
                                                            {address.commune || 'N/A'}
                                                        </td>
                                                        <td className="px-4 py-2 border">
                                                            {address.address || 'N/A'}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-gray-600">Không có địa chỉ giao hàng nào.</p>
                                )}
                            </div>

                            {/* Nút quay lại */}
                            <div className="flex justify-end mt-6">
                                <button
                                    type="button"
                                    className="bg-black text-white px-6 py-3 rounded-lg shadow hover:bg-black/80 transition"
                                >
                                    <a href="/admin/users">Quay lại</a>
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UseDetail;
