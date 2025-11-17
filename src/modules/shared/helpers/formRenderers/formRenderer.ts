import { ReactNode } from "react";

// Plugin type for field rendering
export interface FieldRendererPlugin {
    predicate: (value: unknown) => boolean;
    render: (value: unknown) => ReactNode;
}

export const createRenderFieldValue =
    (plugins: FieldRendererPlugin[]) =>
    (value: unknown): ReactNode => {
        const plugin = plugins.find((p) => p.predicate(value));
        if (plugin) return plugin.render(value);

        // fallback
        if (value === null || value === undefined) return "-";

        return value as ReactNode;
    };
