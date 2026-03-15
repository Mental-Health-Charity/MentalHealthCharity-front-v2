import React from "react";
import { Toaster } from "react-hot-toast";
import Announcement from "../Announcement";
import CookiesBar from "../CookiesBar";
import Footer from "../Footer";

interface Props {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
    const isAdminScreen = window.location.pathname.includes("/admin");

    return (
        <div className="bg-background font-ubuntu min-h-screen">
            <Toaster
                toastOptions={{
                    style: {
                        fontFamily: "Ubuntu, sans-serif",
                        fontSize: "18px",
                    },
                }}
                position="top-center"
                reverseOrder={false}
            />
            {children}
            {!isAdminScreen && <Footer />}
            <CookiesBar />
            <Announcement />
        </div>
    );
};

export default Layout;
