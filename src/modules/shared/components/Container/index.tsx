import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    waves?: boolean;
    parentClassName?: string;
    parentStyle?: React.CSSProperties;
}

const Container = ({ parentClassName, parentStyle, className, children, ...props }: Props) => {
    return (
        <div className={cn("relative flex w-full justify-center", parentClassName)} style={parentStyle}>
            <div className={cn("flex w-full max-w-[1200px] flex-col px-5 pt-6 md:pt-8", className)} {...props}>
                {children}
            </div>
        </div>
    );
};

export default Container;
