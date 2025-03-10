import { Box, BoxProps } from "@mui/material";

interface Props extends BoxProps {
    src: string;
}

const Videoplayer = ({ src, ...props }: Props) => {
    if (src.includes("youtube.com")) {
        const videoId = new URL(src).searchParams.get("v");
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;

        return (
            <Box
                {...props}
                sx={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    padding: "0",

                    ...props.sx,
                }}
            >
                <iframe
                    width="100%"
                    height="100%"
                    src={embedUrl}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                />
            </Box>
        );
    }
    return (
        <Box {...props}>
            <video>
                <source src={src} type="video" />
            </video>
        </Box>
    );
};

export default Videoplayer;
