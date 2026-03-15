import { t } from "i18next";
import Container from "../Container";
import InternalLink, { ExternalLink } from "../InternalLink";

const Footer = () => {
    return (
        <footer className="bg-dark py-8 text-white">
            <Container parentClassName="min-h-fit p-0" className="mt-4">
                <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3 sm:text-left">
                    <div>
                        <h3 className="mb-4 text-lg font-semibold">Fundacja Peryskop</h3>
                        <div className="flex flex-col gap-2">
                            <InternalLink color="secondary" to="/#about-us">
                                {t("footer.about_us")}
                            </InternalLink>
                            <InternalLink color="secondary" to="/tos">
                                {t("footer.privacy_policy")}
                            </InternalLink>
                            <InternalLink color="secondary" to="/tos">
                                {t("footer.terms_of_service")}
                            </InternalLink>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-4 text-lg font-semibold">{t("footer.social")}</h3>
                        <div className="flex flex-col gap-2">
                            <ExternalLink
                                href="https://www.facebook.com/groups/1340769720143310"
                                target="_blank"
                                color="secondary"
                                rel="noopener noreferrer"
                            >
                                Facebook
                            </ExternalLink>
                            <ExternalLink
                                href="https://www.facebook.com/groups/1340769720143310"
                                target="_blank"
                                color="secondary"
                                rel="noopener noreferrer"
                            >
                                Twitter
                            </ExternalLink>
                            <ExternalLink
                                href="https://www.linkedin.com/company/fundacja-peryskop"
                                target="_blank"
                                color="secondary"
                                rel="noopener noreferrer"
                            >
                                LinkedIn
                            </ExternalLink>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-4 text-lg font-semibold">{t("footer.contact")}</h3>
                        <p className="text-sm">
                            Email:{" "}
                            <ExternalLink color="secondary" href="mailto:kontakt@fundacjaperyskop.org">
                                kontakt@fundacjaperyskop.org
                            </ExternalLink>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} {t("footer.rights_reserved")}
                    </p>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
