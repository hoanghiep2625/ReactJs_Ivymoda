import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getList } from '../../api/provider';
import AdminHeader from '../../layouts/adminHeader';
import AdminMenu from '../../layouts/adminMenu';
import { Link } from 'react-router-dom';
import Loading from '../../components/loading';

const ListUser = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: async () => getList({ namespace: 'admin/users' }),
        staleTime: 60 * 1000,
    });

    const users = data || [];

    if (isLoading) return <Loading />;
    if (error) return <div>Error loading users</div>;

    return (
        <div className="flex flex-col h-screen bg-white">
            <AdminHeader />
            <div className="flex flex-1 overflow-hidden">
                <AdminMenu className="w-64 bg-black p-6" />
                <main className="p-4 flex-grow bg-gray-100 pt-16">
                    <div className="bg-white p-6 shadow rounded">
                        <table
                            id="export-table"
                            className="w-full border-collapse border border-gray-200"
                        >
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 p-2">Email</th>
                                    <th className="border border-gray-300 p-2">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(
                                    (user: any) => (
                                        console.log(user.id),
                                        (
                                            <tr
                                                key={user.id}
                                                className="hover:bg-gray-50 cursor-pointer"
                                            >
                                                <td className="border border-gray-300 p-2">
                                                    {user.email}
                                                </td>
                                                <td className="border border-gray-300 p-2">
                                                    <Link to={`${user._id}`}>Xem chi tiết</Link>
                                                </td>
                                            </tr>
                                        )
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ListUser;
