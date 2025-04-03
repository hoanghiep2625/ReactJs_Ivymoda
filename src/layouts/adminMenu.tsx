import React from 'react';
import { NavLink } from 'react-router-dom';

// Định nghĩa interface cho props của AdminMenu
interface AdminMenuProps {
    className?: string; // Thêm prop className để nhận từ parent component
}

const AdminMenu: React.FC<AdminMenuProps> = ({ className }) => {
    const menuItems = [
        { name: 'Dashboard', icon: 'fas fa-tachometer-alt', url: '/' },
        { name: 'Doanh thu', icon: 'fas fa-chart-line', url: '/admin/revenue' },
        { name: 'Thêm sản phẩm', icon: 'fas fa-plus', url: '/admin/add-product' },
        { name: 'Sản phẩm', icon: 'fas fa-box', url: '/admin/products' },
        { name: 'Danh mục', icon: 'fas fa-folder', url: '/admin/categories' },
        { name: 'Người dùng', icon: 'fas fa-users', url: '/admin/users' },
        { name: 'Cài đặt', icon: 'fas fa-cog', url: '/admin/settings' },
    ];

    return (
        <aside className={`bg-[#000000] text-white w-64 h-full p-6 ${className || ''}`}>
            <ul className="space-y-4">
                {menuItems.map(item => (
                    <li key={item.name}>
                        <NavLink
                            to={item.url}
                            className={({ isActive }) =>
                                `flex items-center p-3 text-sm font-medium transition-colors duration-200 ${
                                    isActive ? 'bg-[#1A1A1A]' : 'hover:bg-[#1A1A1A]'
                                }`
                            }
                        >
                            <i className={`${item.icon} w-6 text-center`}></i>
                            <span className="ml-4">{item.name}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default AdminMenu;
