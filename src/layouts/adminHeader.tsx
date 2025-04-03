import React from 'react';

const Header = () => {
    return (
        <header className="bg-[#000000] text-white p-4 flex justify-between items-center shadow-md">
            <div className="text-2xl font-semibold tracking-wide">Admin</div>
            <div className="flex space-x-6">
                <i className="fas fa-bell cursor-pointer hover:text-gray-300 transition-colors"></i>
                <i className="fas fa-user cursor-pointer hover:text-gray-300 transition-colors"></i>
            </div>
        </header>
    );
};

export default Header;
