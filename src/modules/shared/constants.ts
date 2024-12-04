import { ErrorMessage } from "./types";
import i18n from "../../locales/i18n";

const Errors = {
    [ErrorMessage.FAILED_TO_FETCH_CHAT]: i18n.t("errors.failed_to_fetch_chat"),
    [ErrorMessage.FAILED_TO_FETCH_CHAT_NOTE]: i18n.t(
        "errors.failed_to_fetch_chat_note"
    ),
    [ErrorMessage.FAILED_TO_SAVE_NOTE]: i18n.t("errors.failed_to_save_note"),
    [ErrorMessage.FAILED_TO_CREATE_REPORT]: i18n.t(
        "errors.failed_to_create_report"
    ),
    [ErrorMessage.FAILED_TO_FETCH_PUBLIC_PROFILE]: i18n.t(
        "errors.failed_to_fetch_public_profile"
    ),
    [ErrorMessage.FAILED_TO_UPDATE_PUBLIC_PROFILE]: i18n.t(
        "errors.failed_to_update_public_profile"
    ),
    [ErrorMessage.FAILED_TO_FETCH_USER]: i18n.t("errors.failed_to_fetch_user"),
    [ErrorMessage.UNKNOWN]: i18n.t("errors.unknown"),
    [ErrorMessage.FAILED_TO_CREATE_CHAT]: i18n.t(
        "errors.failed_to_create_chat"
    ),
    [ErrorMessage.FAILED_TO_EDIT_CHAT]: i18n.t("errors.failed_to_edit_chat"),
    [ErrorMessage.FAILED_TO_FETCH_REPORTS]: i18n.t(
        "errors.failed_to_fetch_reports"
    ),
};

export default Errors;
