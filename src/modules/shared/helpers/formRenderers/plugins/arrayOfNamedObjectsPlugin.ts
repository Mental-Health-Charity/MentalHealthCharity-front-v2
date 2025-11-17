// src/shared/renderers/plugins/arrayOfNamedObjects.tsx

import { FieldRendererPlugin } from "../formRenderer";

export const arrayOfNamedObjectsPlugin: FieldRendererPlugin = {
    predicate: (value) => Array.isArray(value) && value.every((v) => typeof v === "object" && v && "name" in v),
    render: (value) => (value as { name: string }[]).map((v) => v.name).join(", "),
};
