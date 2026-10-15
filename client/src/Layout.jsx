import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/custom/Header';
import Footer from './components/custom/Footer';

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0A1628] antialiased">
            <Header />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
