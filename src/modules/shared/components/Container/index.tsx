import { cn } from "@/lib/utils";
import wave_icon from "../../../../assets/static/wave.svg";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    waves?: boolean;
    parentClassName?: string;
    parentStyle?: React.CSSProperties;
}

const FOOTER_Y_SIZE = "200px";

const Container = ({ waves, parentClassName, parentStyle, className, children, ...props }: Props) => {
    return (
        <div
            className={cn("relative flex w-full justify-center pb-15", waves && "bg-primary-brand/10", parentClassName)}
            style={{ minHeight: `calc(100vh - ${FOOTER_Y_SIZE})`, ...parentStyle }}
        >
            {/* Wave decorations */}
            {waves && (
                <>
                    <div
                        className="absolute top-0 left-0 z-0 h-[500px] w-full rotate-180 bg-cover bg-center"
                        style={{ backgroundImage: `url(${wave_icon})` }}
                    />
                    <div
                        className="absolute top-[200px] left-0 z-0 h-[500px] w-full rotate-180 bg-cover bg-center opacity-50"
                        style={{ backgroundImage: `url(${wave_icon})` }}
                    />
                </>
            )}

            <div className={cn("z-10 mt-25 flex w-full max-w-[1600px] flex-col", className)} {...props}>
                {children}
            </div>
        </div>
    );
};

export default Container;
