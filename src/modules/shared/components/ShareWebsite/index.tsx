import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const ShareWebsite = () => {
    const { t } = useTranslation();

    const shareOptions = useMemo(
        () => [
            {
                name: "Facebook",
                color: "#1877f2",
                icon: <Facebook size={18} />,
                to: "https://www.facebook.com/sharer/sharer.php?u=https://fundacjaperyskop.org",
            },
            {
                name: "Twitter",
                color: "#000",
                icon: <Twitter size={18} />,
                to: "https://twitter.com/intent/tweet?url=https://fundacjaperyskop.org",
            },
            {
                name: "Instagram",
                color: "linear-gradient(to right, #833ab4, #fd1d1d, #fcb045)",
                icon: <Instagram size={18} />,
                to: "https://www.instagram.com/?url=https://fundacjaperyskop.org",
            },
            {
                name: "LinkedIn",
                color: "#0077b5",
                icon: <Linkedin size={18} />,
                to: "https://www.linkedin.com/shareArticle?mini=true&url=https://fundacjaperyskop.org",
            },
        ],
        []
    );

    return (
        <div className="flex flex-wrap gap-2.5 py-5">
            {shareOptions.map((option) => (
                <a
                    key={option.name}
                    href={option.to}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="w-full sm:w-auto"
                >
                    <Button className="w-full gap-2 text-white hover:opacity-90" style={{ background: option.color }}>
                        {option.icon}
                        {option.name}
                    </Button>
                </a>
            ))}
            <Button
                className="w-full sm:w-auto"
                onClick={() => {
                    navigator.clipboard.writeText("https://fundacjaperyskop.org");
                    toast.success(t("common.copied_to_clipboard"));
                }}
            >
                {t("support_us.options.share.copy")}
            </Button>
        </div>
    );
};

export default ShareWebsite;
