import { Heart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const Announcement = () => {
    const [isOpen, setIsOpen] = useState(false);
    const blacklistedRoutes = ["/support", "/chat", "/login", "/admin"];
    const shouldHide = useMemo(() => blacklistedRoutes.includes(window.location.pathname), [window.location.pathname]);

    const handleMobileOpen = () => {
        if (window.innerWidth > 768) return;
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("click", handleMobileOpen);
        } else {
            document.removeEventListener("click", handleMobileOpen);
        }

        return () => {
            document.removeEventListener("click", handleMobileOpen);
        };
    }, [isOpen]);

    if (shouldHide) {
        return null;
    }

    return (
        <div className="fixed top-[100px] left-0 z-[1000] flex -translate-x-[78%] rounded-[10px] shadow-[0_0_10px_rgba(0,0,0,0.15)] transition-transform duration-500 hover:translate-x-0 max-[768px]:top-auto max-[768px]:bottom-5">
            <div className="bg-background flex items-center gap-2.5 rounded-l-[10px] p-2.5">
                <span className="text-muted-foreground text-sm">Chcesz nas wesprzeć?</span>
                <Link to="/support" className="text-primary-brand text-sm font-medium no-underline hover:underline">
                    Kliknij tutaj
                </Link>
            </div>
            <div className="bg-primary-brand flex items-center rounded-r-[10px] p-2.5">
                <button className="border-none bg-transparent p-0 text-white">
                    <Heart className="size-5" />
                </button>
            </div>
        </div>
    );
};

export default Announcement;
