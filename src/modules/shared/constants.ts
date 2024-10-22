import { t } from "i18next";
import { ErrorMessage } from "./types";

const Errors = {
  [ErrorMessage.FAILED_TO_FETCH_CHAT]: t("errors.failed_to_fetch_chat"),
  [ErrorMessage.FAILED_TO_FETCH_CHAT_NOTE]: t(
    "errors.failed_to_fetch_chat_note"
  ),
  [ErrorMessage.FAILED_TO_SAVE_NOTE]: t("errors.failed_to_save_note"),
  [ErrorMessage.FAILED_TO_CREATE_REPORT]: t("errors.failed_to_create_report"),
  [ErrorMessage.UNKNOWN]: t("errors.unknown"),
};

export default Errors;
