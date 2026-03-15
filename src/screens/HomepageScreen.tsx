import background from "../assets/static/lines.svg";
import AboutUs from "../modules/shared/components/AboutUs";
import Hero from "../modules/shared/components/Hero";

const HomepageScreen = () => {
    return (
        <div
            className="mb-[60px] bg-no-repeat"
            style={{
                backgroundImage: `url(${background})`,
                backgroundPosition: "21vw 570px",
            }}
        >
            <Hero />
            <AboutUs />
        </div>
    );
};

export default HomepageScreen;
