import { MDXEditorMethods } from "@mdxeditor/editor";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { useTranslation } from "react-i18next";
import CloseButton from "../../../shared/components/CloseButton";
import Loader from "../../../shared/components/Loader";
import Markdown from "../../../shared/components/Markdown";
import readError from "../../../shared/helpers/readError";
import useDebounce from "../../../shared/hooks/useDebounce";
import editNoteMutation from "../../queries/editNoteMutation";
import { getChatNoteQueryOptions } from "../../queries/getChatNoteQueryOptions";
import { Chat } from "../../types";
import "./styles.css";

interface Props {
    chat: Chat;
    onClose: () => void;
}

const Note = ({ chat, onClose }: Props) => {
    const { data, isError, error, isLoading } = useQuery(getChatNoteQueryOptions({ id: chat.id }));
    const ref = useRef<MDXEditorMethods>(null);
    const { t } = useTranslation();
    const [content, setContent] = useState<string>(data ? data.content : "");

    const {
        error: saveNoteError,
        isPending,
        mutate,
    } = useMutation({
        mutationFn: editNoteMutation,
        onMutate: () => {
            setEdited(true);
        },
        onSuccess: () => {
            setEdited(false);
        },
        onError: () => {
            setEdited(true);
        },
    });

    const [edited, setEdited] = useState(false);
    const debounceValue = useDebounce(content, 1000);

    useEffect(() => {
        if (data) {
            ref.current?.insertMarkdown(data ? data.content : "");
            ref.current?.setMarkdown(data ? data.content : "");
            setContent(data ? data.content : "");
        }
    }, [data]);

    useEffect(() => {
        if (debounceValue && edited) {
            mutate({ content: debounceValue, id: chat.id });
        }
    }, [debounceValue, chat.id, mutate]);

    return (
        <Draggable defaultClassName="draggable">
            <div className="bg-paper rounded-lg p-0 shadow-md">
                <div className="text-text-body flex h-[400px] w-[500px] flex-col">
                    <div className="bg-dark flex items-center justify-between rounded px-4 py-2.5">
                        <div className="text-bg-brand flex items-center gap-2.5">
                            <h3 className="text-xl">{t("chat.note_title")}</h3>
                            {isPending && <Loader className="w-5" />}
                            {saveNoteError && (
                                <p className="text-destructive text-center">{readError(saveNoteError)}</p>
                            )}
                        </div>
                        <CloseButton onClick={onClose} />
                    </div>
                    <div
                        onClick={() => ref.current && ref.current.focus()}
                        className="flex grow flex-col overflow-auto"
                    >
                        {!isLoading && (typeof content === "string" || content === null) && (
                            <Markdown
                                onChange={(value) => {
                                    setContent(value);
                                    setEdited(true);
                                }}
                                ref={ref}
                                autoFocus
                                content={content || ""}
                                readonly={false}
                            />
                        )}

                        {isError && <p className="text-destructive mt-2.5 text-center">{readError(error)}</p>}
                    </div>
                </div>
            </div>
        </Draggable>
    );
};

export default Note;
