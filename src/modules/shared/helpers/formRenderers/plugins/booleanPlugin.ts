import { t } from "i18next";
import { FieldRendererPlugin } from "../formRenderer";

export const booleanPlugin: FieldRendererPlugin = {
    predicate: (value) => typeof value === "boolean",
    render: (value) => ((value as boolean) ? t("common.yes") : t("common.no")),
};
