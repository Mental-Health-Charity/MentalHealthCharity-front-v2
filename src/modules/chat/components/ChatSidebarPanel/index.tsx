import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";
import { useIsMobile } from "../../../../hooks/useBreakpoint";

interface Props {
    className?: string;
}

const ChatSidebarPanel = ({ children, className }: PropsWithChildren<Props>) => {
    const isMobile = useIsMobile();

    return (
        <div
            className={cn(
                "border-border/50 bg-card flex h-full w-[320px] shrink-0 flex-col border-l",
                isMobile && "fixed inset-0 z-50 h-[100dvh] w-full border-l-0",
                className
            )}
        >
            {children}
        </div>
    );
};

export default ChatSidebarPanel;
