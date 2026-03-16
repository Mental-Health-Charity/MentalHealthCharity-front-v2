import ArticlesPreview from "../modules/shared/components/ArticlesPreview";
import ChatMockup from "../modules/shared/components/ChatMockup";
import DonationsPreview from "../modules/shared/components/DonationsPreview";
import FinalCTA from "../modules/shared/components/FinalCTA";
import Hero from "../modules/shared/components/Hero";
import HowItWorks from "../modules/shared/components/HowItWorks";
import TrustMission from "../modules/shared/components/TrustMission";

const HomepageScreen = () => {
    return (
        <div>
            <Hero />
            <HowItWorks />
            <ChatMockup />
            <ArticlesPreview />
            <TrustMission />
            <DonationsPreview />
            <FinalCTA />
        </div>
    );
};

export default HomepageScreen;
