import { cn } from "@/lib/utils";

const DEFAULT_SIZE = 40;

interface IconWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
    color?: string;
    size?: number;
}

const IconWrapper = ({ color, size = DEFAULT_SIZE, className, children, style, ...props }: IconWrapperProps) => {
    const iconSize = size - 15;

    return (
        <div
            className={cn("flex items-center justify-center rounded-lg", className)}
            style={{
                width: size,
                height: size,
                backgroundColor: color ? `${color}1b` : "transparent",
                ...style,
            }}
            {...props}
        >
            <div
                style={{
                    width: iconSize,
                    height: iconSize,
                    color: color || "var(--color-primary)",
                }}
                className="flex items-center justify-center [&>svg]:h-full [&>svg]:w-full"
            >
                {children}
            </div>
        </div>
    );
};

export default IconWrapper;
