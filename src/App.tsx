import React from 'react';
import './App.css';
import { Route, Routes, useParams, useRoutes } from 'react-router-dom';
import Home from './pages/client/home';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import DetailProduct from './pages/client/detailProduct';
import Cart from './pages/client/cart';
import Dathang from './pages/client/dathang';
import CheckLogin from './components/CheckLogin'; //Nếu chưa đăng nhập thì chuyển về trang login
import Orders from './pages/client/orders';

function App() {
    const DetailProductWrapper = () => {
        const { id } = useParams();
        if (!id) {
            return <div>Product ID không hợp lệ</div>;
        }
        return <DetailProduct productId={id} />;
    };
    const routes = useRoutes([
        { path: '/', element: <Home /> },
        { path: '/login', element: <Login /> },
        { path: '/register', element: <Register /> },
        { path: '/products/:id', element: <DetailProductWrapper /> },
        { path: '/orders', element: <CheckLogin element={<Orders />} /> },
        { path: '/cart', element: <CheckLogin element={<Cart />} /> },
        { path: '/dathang', element: <CheckLogin element={<Dathang />} /> },
    ]);
    return routes;
}

export default App;
