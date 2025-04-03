import React from 'react';
import AdminFooter from '../../layouts/adminFooter';
import AdminHeader from '../../layouts/adminHeader';
import AdminMenu from '../../layouts/adminMenu';

const Admin: React.FC = () => {
    return (
        <div className="flex flex-col h-screen bg-[#FFFFFF]">
            {/* Header */}
            <AdminHeader />

            {/* Phần giữa: Menu và Main */}
            <div className="flex flex-1 overflow-hidden">
                <AdminMenu className="w-64 bg-[#000000] p-6" />
                <main className="flex-1 overflow-auto p-8 bg-[#FFFFFF] text-black">
                    <h2 className="text-3xl font-semibold mb-6 text-[#1A1A1A]">
                        Main Content Area
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        Đây là nơi hiển thị nội dung chính của trang admin. Bạn có thể thêm bảng,
                        biểu đồ, hoặc các form tùy ý.
                    </p>
                    <div className="mt-6 h-96 bg-[#F0F0F0] p-6 shadow-md">
                        <p className="text-gray-600">Nội dung mẫu để kiểm tra khả năng cuộn...</p>
                    </div>
                </main>
            </div>

            {/* Footer */}
            <AdminFooter />
        </div>
    );
};

export default Admin;
