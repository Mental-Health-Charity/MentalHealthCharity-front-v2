import { formatDate } from "date-fns";
import { isISODate } from "../../isISODate";
import { FieldRendererPlugin } from "../formRenderer";

export const singleIsoDatePlugin: FieldRendererPlugin = {
    predicate: (value) => typeof value === "string" && isISODate(value),
    render: (value) => formatDate(new Date(value as string), "dd/MM/yyyy HH:mm"),
};
