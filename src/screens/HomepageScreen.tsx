import { Box } from "@mui/material";
import background from "../assets/static/lines.svg";
import AboutUs from "../modules/shared/components/AboutUs";
import Hero from "../modules/shared/components/Hero";

const HomepageScreen = () => {
    console.log("elo");
    return (
        <Box
            sx={{
                backgroundImage: `url(${background})`,
                backgroundPosition: "21vw 570px",
                backgroundRepeat: "no-repeat",
            }}
        >
            <Hero />
            <AboutUs />
        </Box>
    );
};

export default HomepageScreen;
