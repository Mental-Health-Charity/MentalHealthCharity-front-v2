import { Badge } from "@/components/ui/badge";
import { formatDate } from "date-fns";
import { isISODate } from "../../isISODate";
import { FieldRendererPlugin } from "../formRenderer";

export const arrayOfIsoDatesPlugin: FieldRendererPlugin = {
    predicate: (value) => Array.isArray(value) && value.every((v) => typeof v === "string" && isISODate(v)),
    render: (value) => (
        <div className="flex flex-wrap gap-2">
            {(value as string[]).map((date) => (
                <Badge key={date} className="text-sm">
                    {formatDate(new Date(date), "dd/MM/yyyy HH:mm")}
                </Badge>
            ))}
        </div>
    ),
};
