import { useCallback } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "../hooks/useBreakpoint";
import Card from "../modules/shared/components/Card";
import Container from "../modules/shared/components/Container";
import ShareWebsite from "../modules/shared/components/ShareWebsite";

const SupportUsScreen = () => {
    const { t } = useTranslation();
    const isMobile = useIsMobile();

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText("62 1870 1045 2083 1080 5210 0001");
        toast.success(t("common.copied_to_clipboard"));
    }, [t]);

    return (
        <Container waves>
            <div className="flex flex-col gap-5 md:px-5 lg:px-[50px] lg:py-5">
                <Card title={t("support_us.title")} subtitle={t("support_us.subtitle")}></Card>
                <div className="flex w-full justify-center">
                    <iframe
                        frameBorder="0"
                        width={isMobile ? "300" : "430"}
                        height={isMobile ? "380" : "480"}
                        scrolling="no"
                        src="https://pomagam.pl/rw9bkc/widget/large"
                    ></iframe>
                </div>
                <Card
                    title={t("support_us.options.share.title")}
                    variant="secondary"
                    subtitle={t("support_us.options.share.subtitle")}
                >
                    <ShareWebsite />
                </Card>

                <Card
                    title={t("support_us.options.donate.title")}
                    variant="secondary"
                    subtitle={t("support_us.options.donate.subtitle")}
                >
                    <button onClick={handleCopy} className="cursor-pointer py-2.5 text-[28px] font-bold select-all">
                        62 1870 1045 2083 1080 5210 0001
                    </button>
                </Card>
            </div>
        </Container>
    );
};

export default SupportUsScreen;
