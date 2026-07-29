import {
    AdmonitionDirectiveDescriptor,
    codeBlockPlugin,
    codeMirrorPlugin,
    diffSourcePlugin,
    directivesPlugin,
    frontmatterPlugin,
    headingsPlugin,
    imagePlugin,
    KitchenSinkToolbar,
    linkDialogPlugin,
    linkPlugin,
    listsPlugin,
    markdownShortcutPlugin,
    MDXEditor,
    MDXEditorMethods,
    MDXEditorProps,
    quotePlugin,
    tablePlugin,
    thematicBreakPlugin,
    toolbarPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { forwardRef } from "react";
import { useTheme } from "@/hooks/useTheme";

interface Props extends Omit<MDXEditorProps, "markdown"> {
    content: string;
    readonly?: boolean;
}

const Markdown = forwardRef<MDXEditorMethods, Props>(({ content, readonly = true, className, ...editorProps }, ref) => {
    // MDXEditor ships its own dark palette behind the `dark-theme` class; enable it
    // whenever the app is in dark mode so the toolbar and content stay consistent.
    // NB: className is pulled out of editorProps so the {...editorProps} spread
    // below can't overwrite this composed value (which would drop `markdown`/`dark-theme`).
    const { resolvedTheme } = useTheme();

    return (
        <MDXEditor
            className={`markdown ${resolvedTheme === "dark" ? "dark-theme" : ""} ${className ?? ""}`}
            contentEditableClassName="markdown-editable"
            plugins={[
                listsPlugin(),
                quotePlugin(),
                headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
                linkPlugin(),
                linkDialogPlugin(),
                imagePlugin({
                    imageAutocompleteSuggestions: [
                        "https://via.placeholder.com/150",
                        "https://via.placeholder.com/150",
                    ],
                }),
                tablePlugin(),
                thematicBreakPlugin(),
                ...(editorProps.readOnly
                    ? []
                    : [
                          toolbarPlugin({
                              toolbarContents: () => <KitchenSinkToolbar />,
                          }),
                      ]),
                frontmatterPlugin(),
                codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),

                codeMirrorPlugin({
                    codeBlockLanguages: {
                        js: "JavaScript",
                        css: "CSS",
                        txt: "text",
                        tsx: "TypeScript",
                    },
                }),
                directivesPlugin({
                    directiveDescriptors: [AdmonitionDirectiveDescriptor],
                }),
                diffSourcePlugin({
                    viewMode: "rich-text",
                    diffMarkdown: "boo",
                }),
                markdownShortcutPlugin(),
            ]}
            readOnly={readonly}
            markdown={content}
            {...editorProps}
            ref={ref}
        />
    );
});

export default Markdown;
