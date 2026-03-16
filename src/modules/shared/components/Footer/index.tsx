import { Facebook, Heart, Linkedin } from "lucide-react";
import { useTranslation } from "react-i18next";
import InternalLink, { ExternalLink } from "../InternalLink";

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer role="contentinfo" className="bg-dark text-white dark:bg-[#0a1620]">
            <div className="mx-auto max-w-[1200px] px-5 py-12">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand column */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <div className="mb-3 flex items-center gap-2">
                            <Heart className="text-primary-brand size-5" />
                            <span className="text-lg font-bold">Peryskop</span>
                        </div>
                        <p className="text-sm leading-relaxed text-white/70">
                            {t("homepage.trust_mission.description")}
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold tracking-wide text-white/50 uppercase">
                            {t("footer.about_us")}
                        </h3>
                        <div className="flex flex-col gap-2.5">
                            <InternalLink color="secondary" to="/#about-us">
                                {t("footer.about_us")}
                            </InternalLink>
                            <InternalLink color="secondary" to="/articles">
                                {t("common.navigation.articles")}
                            </InternalLink>
                            <InternalLink color="secondary" to="/tos">
                                {t("footer.terms_of_service")}
                            </InternalLink>
                            <InternalLink color="secondary" to="/tos">
                                {t("footer.privacy_policy")}
                            </InternalLink>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold tracking-wide text-white/50 uppercase">
                            {t("footer.contact")}
                        </h3>
                        <div className="flex flex-col gap-2.5">
                            <ExternalLink color="secondary" href="mailto:kontakt@fundacjaperyskop.org">
                                kontakt@fundacjaperyskop.org
                            </ExternalLink>
                        </div>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold tracking-wide text-white/50 uppercase">
                            {t("footer.social")}
                        </h3>
                        <div className="flex gap-3">
                            <a
                                href="https://www.facebook.com/groups/1340769720143310"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex size-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                                aria-label="Facebook"
                            >
                                <Facebook className="size-4" />
                            </a>
                            <a
                                href="https://www.linkedin.com/company/fundacja-peryskop"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex size-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="size-4" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-10 border-t border-white/10 pt-6 text-center">
                    <p className="text-sm text-white/50">
                        &copy; {new Date().getFullYear()} {t("footer.rights_reserved")}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
