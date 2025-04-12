import React from 'react';
import HeaderClient from '../../layouts/clientHeader';
import Footer from '../../layouts/clientFooter';
import MenuClient from '../../layouts/clientMenu';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCart } from '../../services/userService';
import { ICartItem } from '../../types/cart';
import { useAuth } from '../../context/auth.context';
import { toast } from 'react-toastify';
import { getList } from '../../api/provider';
import Loading from '../../components/loading';

const Cart = () => {
    const queryClient = useQueryClient();
    const { auth } = useAuth();
    const {
        data: cartItems,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['cart'],
        queryFn: async () => getList({ namespace: `cart` }),
        staleTime: 60 * 1000,
    });

    const deleteCartMutation = useMutation({
        mutationFn: ({
            userId,
            productVariantId,
            size,
        }: {
            userId: string;
            productVariantId: string;
            size: string;
        }) => deleteCart(userId, productVariantId, size),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            toast.success('Xóa sản phẩm khỏi giỏ hàng thành công');
        },
        onError: (error: Error) => {
            console.error('Lỗi khi xóa sản phẩm:', error);
            toast.error('Lỗi khi xóa sản phẩm');
        },
    });

    const handleDeleteItem = (productVariantId: string, size: string) => {
        if (!auth.user.id) {
            toast.error('Bạn cần đăng nhập để thực hiện thao tác này');
            return;
        }
        console.log(productVariantId, size);

        deleteCartMutation.mutate({
            userId: auth.user.id,
            productVariantId: productVariantId,
            size,
        });
    };

    if (isLoading) return <Loading />;
    if (error) return <div>Lỗi khi tải giỏ hàng: {(error as Error).message}</div>;

    // Kiểm tra và xử lý dữ liệu an toàn
    const items: ICartItem[] = cartItems?.items || [];
    const validItems = items.filter(
        item =>
            item &&
            item.productVariantId &&
            typeof item.productVariantId === 'object' &&
            item.productVariantId !== null
    );

    const totalQuantity = validItems.reduce((sum, item) => {
        if (!item || typeof item.quantity !== 'number') return sum;
        return sum + item.quantity;
    }, 0);

    const totalPrice = validItems.reduce((sum, item) => {
        if (
            !item?.productVariantId?.price ||
            typeof item.productVariantId.price !== 'number' ||
            !item.quantity
        )
            return sum;
        return sum + item.productVariantId.price * item.quantity;
    }, 0);

    return (
        <>
            <HeaderClient />
            <div className="mx-[5%]">
                <MenuClient />
                <article className="mt-[100px]">
                    <article className="grid grid-cols-[4fr_1.5fr] gap-10 mt-[100px]">
                        <div>
                            <div className="border w-full h-[96.6px] flex justify-center rounded-tl-[20px] rounded-br-[20px]">
                                <div className="w-[14px] h-[14px] border-2 border-[#e7e8e9] rounded-full bg-black mt-6 z-10 relative">
                                    <p className="text-[12px] mt-4 left-[-20px] w-16 absolute">
                                        Giỏ hàng
                                    </p>
                                </div>
                                <div className="h-[3px] w-[200px] bg-[#e7e8e9] mx-2 mt-[30px]"></div>
                                <div className="w-[14px] h-[14px] rounded-full bg-white border-2 border-[#e7e8e9] mt-6 z-10 relative">
                                    <div className="text-[12px] mt-4 left-[-20px] w-16 absolute">
                                        Đặt hàng
                                    </div>
                                </div>
                                <div className="h-[3px] w-[200px] bg-[#e7e8e9] mx-2 mt-[30px]"></div>
                                <div className="w-[14px] h-[14px] rounded-full bg-white border-2 border-[#e7e8e9] mt-6 z-10 relative">
                                    <div className="text-[12px] mt-4 left-[-20px] w-20 absolute">
                                        Thanh toán
                                    </div>
                                </div>
                                <div className="h-[3px] w-[200px] bg-[#e7e8e9] mx-2 mt-[30px]"></div>
                                <div className="w-[14px] h-[14px] rounded-full bg-white border-2 border-[#e7e8e9] mt-6 z-10 relative">
                                    <div className="text-[12px] mt-4 left-[-40px] w-28 absolute">
                                        Hoàn thành đơn
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 mb-4 pt-6">
                                <div className="text-[24px] font-semibold">Giỏ hàng của bạn</div>
                                <div className="text-[24px] text-[#d73831] font-semibold">
                                    {totalQuantity} Sản Phẩm
                                </div>
                            </div>
                            <div>
                                <table className="w-full bg-white table-auto border-collapse">
                                    <thead className="border-b bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                                Sản phẩm
                                            </th>
                                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                                Số lượng
                                            </th>
                                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                                Size
                                            </th>
                                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                                Tổng tiền
                                            </th>
                                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {validItems.length > 0 ? (
                                            validItems.map((item: ICartItem, index: number) => (
                                                <tr
                                                    key={item._id}
                                                    className={`border-b hover:bg-gray-50 ${index % 2 === 1 ? 'bg-gray-100' : ''}`}
                                                >
                                                    <td className="px-4 py-2 text-sm text-gray-700">
                                                        <div className="flex items-center gap-4">
                                                            <Link
                                                                to={`/products/${encodeURIComponent(item?.productVariantId?._id || '')}`}
                                                                className="group relative block"
                                                            >
                                                                <img
                                                                    src={
                                                                        item?.productVariantId
                                                                            ?.images?.main?.url ||
                                                                        '/fallback.jpg'
                                                                    }
                                                                    alt={
                                                                        item?.productVariantId
                                                                            ?.productId?.name ||
                                                                        'Product'
                                                                    }
                                                                    className="w-28 h-[140px] object-cover rounded transition-opacity duration-300 ease-in-out opacity-100 group-hover:opacity-0"
                                                                    onError={e =>
                                                                        (e.currentTarget.src =
                                                                            '/fallback.jpg')
                                                                    }
                                                                />
                                                                <img
                                                                    src={
                                                                        item?.productVariantId
                                                                            ?.images?.hover ||
                                                                        '/fallback.jpg'
                                                                    }
                                                                    alt={
                                                                        item?.productVariantId
                                                                            ?.productId?.name ||
                                                                        'Product'
                                                                    }
                                                                    className="w-28 h-[140px] object-cover rounded absolute top-0 left-0 transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100"
                                                                    onError={e =>
                                                                        (e.currentTarget.src =
                                                                            '/fallback.jpg')
                                                                    }
                                                                />
                                                            </Link>
                                                            <Link
                                                                to={`/products/${encodeURIComponent(item?.productVariantId?._id || '')}`}
                                                                className="hover:text-orange-600 transition-all duration-300"
                                                            >
                                                                {item?.productVariantId?.productId
                                                                    ?.name || 'Unnamed Product'}
                                                            </Link>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-2 text-sm text-gray-700">
                                                        <div className="flex items-center gap-4">
                                                            <div className="relative flex items-center justify-center w-[5.5rem] h-8 my-4">
                                                                <button
                                                                    id={`decreaseBtn-${item._id}`}
                                                                    data-id={item._id}
                                                                    className="flex items-center justify-center border w-8 h-8 rounded rounded-tl-[15px] rounded-br-[15px] text-xl absolute left-0 top-0 z-20"
                                                                >
                                                                    -
                                                                </button>
                                                                <div
                                                                    id={`quantityDisplay-${item._id}`}
                                                                    className="flex items-center justify-center text-center text-sm border-y w-12 h-full z-10"
                                                                >
                                                                    {item.quantity}
                                                                </div>
                                                                <button
                                                                    id={`increaseBtn-${item._id}`}
                                                                    data-id={item._id}
                                                                    className="flex items-center justify-center border w-8 h-8 rounded rounded-tl-[15px] rounded-br-[15px] text-xl absolute right-0 top-0 z-20"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-2 text-sm text-gray-700">
                                                        {item.size}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm text-gray-700">
                                                        {(
                                                            (item?.productVariantId?.price || 0) *
                                                            (item?.quantity || 0)
                                                        ).toLocaleString('vi-VN')}{' '}
                                                        đ
                                                    </td>
                                                    <td
                                                        className="px-4 py-2 text-sm text-red-500 cursor-pointer"
                                                        id={`removeBtn-${item._id}`}
                                                        onClick={() =>
                                                            handleDeleteItem(
                                                                item?.productVariantId?._id || '',
                                                                item.size
                                                            )
                                                        }
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 448 512"
                                                            className="w-4 h-4 fill-black hover:scale-110 transition-transform duration-300"
                                                        >
                                                            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                                        </svg>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="px-4 py-2 text-center text-gray-500"
                                                >
                                                    Giỏ hàng của bạn trống.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-6">
                                <button className="bg-white border border-black w-[250px] transition-all pt-[14px] pr-[24px] pb-[14px] pl-[24px] rounded-tl-[20px] rounded-br-[20px] hover:bg-black hover:text-white flex">
                                    <Link to={'/'} className="mx-auto font-semibold">
                                        ← Tiếp tục mua hàng
                                    </Link>
                                </button>
                            </div>
                        </div>
                        <div>
                            <div className="bg-[#fbfbfc] p-[22px] w-[400px]">
                                <div className="text-[20px] text-[#221F20]">Tổng tiền giỏ hàng</div>
                                <br />
                                <div className="text-[14px] text-[#57585A]">
                                    <div className="flex justify-between">
                                        <div>Tổng sản phẩm</div>
                                        <div>{totalQuantity}</div>
                                    </div>
                                </div>
                                <br />
                                <div className="text-[14px] text-[#57585A]">
                                    <div className="flex justify-between">
                                        <div>Tổng tiền hàng</div>
                                        <div>{totalPrice.toLocaleString('vi-VN')} đ</div>
                                    </div>
                                </div>
                                <br />
                                <div className="text-[14px] text-[#57585A]">
                                    <div className="flex justify-between">
                                        <div>Tạm tính</div>
                                        <div className="font-semibold">
                                            {totalPrice.toLocaleString('vi-VN')} đ
                                        </div>
                                    </div>
                                </div>
                                <div className="text-[14px] text-[#AC2F33] my-6">
                                    Sản phẩm nằm trong chương trình đồng giá, giảm giá trên 50%
                                    không hỗ trợ đổi trả
                                </div>
                                <hr />
                            </div>
                            <div>
                                {validItems.length === 0 ? (
                                    <p className="bg-black w-68 h-[50px] rounded-tl-2xl rounded-br-2xl flex items-center justify-center lg:text-[16px] md:text-[12px] text-white font-semibold opacity-50 cursor-not-allowed transition-all duration-300">
                                        GIỎ HÀNG TRỐNG
                                    </p>
                                ) : (
                                    <Link to="/dathang">
                                        <p className="bg-black w-68 h-[50px] rounded-tl-2xl rounded-br-2xl flex items-center justify-center lg:text-[16px] md:text-[12px] text-white font-semibold hover:bg-white hover:text-black hover:border hover:border-black cursor-pointer transition-all duration-300">
                                            ĐẶT HÀNG
                                        </p>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </article>
                </article>
                <Footer />
            </div>
        </>
    );
};

export default Cart;
