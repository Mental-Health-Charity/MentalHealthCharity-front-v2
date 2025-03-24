import i18n from "../../locales/i18n";
import { formStatus } from "./types";

export const translatedFormStatus = {
    [formStatus.ACCEPTED]: i18n.t("form_status.accepted"),
    [formStatus.REJECTED]: i18n.t("form_status.rejected"),
    [formStatus.WAITED]: i18n.t("form_status.waited"),
};
