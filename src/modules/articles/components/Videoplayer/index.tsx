import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    src: string;
}

const Videoplayer = ({ src, className, ...props }: Props) => {
    if (src.includes("youtube.com")) {
        const videoId = new URL(src).searchParams.get("v");
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;

        return (
            <div className={cn("overflow-hidden rounded-[20px] p-0", className)} {...props}>
                <iframe
                    width="100%"
                    height="100%"
                    src={embedUrl}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                />
            </div>
        );
    }
    return (
        <div className={className} {...props}>
            <video>
                <source src={src} type="video" />
            </video>
        </div>
    );
};

export default Videoplayer;
