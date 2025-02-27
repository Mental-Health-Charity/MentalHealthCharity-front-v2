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
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import { forwardRef } from 'react';

interface Props extends Omit<MDXEditorProps, 'markdown'> {
    content: string;
    readonly?: boolean;
}

const Markdown = forwardRef<MDXEditorMethods, Props>(({ content, readonly = true, ...editorProps }, ref) => {
    return (
        <MDXEditor
            className="markdown"
            contentEditableClassName="markdown-editable"
            plugins={[
                listsPlugin(),
                quotePlugin(),
                headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
                linkPlugin(),
                linkDialogPlugin(),
                imagePlugin({
                    imageAutocompleteSuggestions: [
                        'https://via.placeholder.com/150',
                        'https://via.placeholder.com/150',
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
                codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),

                codeMirrorPlugin({
                    codeBlockLanguages: {
                        js: 'JavaScript',
                        css: 'CSS',
                        txt: 'text',
                        tsx: 'TypeScript',
                    },
                }),
                directivesPlugin({
                    directiveDescriptors: [AdmonitionDirectiveDescriptor],
                }),
                diffSourcePlugin({
                    viewMode: 'rich-text',
                    diffMarkdown: 'boo',
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
