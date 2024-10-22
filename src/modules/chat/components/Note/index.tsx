import Draggable from "react-draggable";
import Markdown from "../../../shared/components/Markdown";
import { Chat } from "../../types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getChatNoteQueryOptions } from "../../queries/getChatNoteQueryOptions";
import { Box, Card, Typography, useTheme } from "@mui/material";
import "./styles.css";
import { useTranslation } from "react-i18next";
import CloseButton from "../../../shared/components/CloseButton";
import { useEffect, useRef, useState } from "react";
import { MDXEditorMethods } from "@mdxeditor/editor";
import useDebounce from "../../../shared/hooks/useDebounce";
import readError from "../../../shared/helpers/readError";
import editNoteMutation from "../../queries/editNoteMutation";
import Loader from "../../../shared/components/Loader";

interface Props {
  chat: Chat;
  onClose: () => void;
}

const Note = ({ chat, onClose }: Props) => {
  const { data, isError, error, isLoading } = useQuery(
    getChatNoteQueryOptions({ id: chat.id })
  );
  const ref = useRef<MDXEditorMethods>(null);
  const { t } = useTranslation();
  const theme = useTheme();
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
      <Card
        sx={{
          padding: 0,
        }}
      >
        <Box
          sx={{
            color: theme.palette.text.secondary,
            height: "400px",
            width: "500px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              backgroundColor: theme.palette.colors.dark,
              padding: "10px 15px",
              borderRadius: "4px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                color: theme.palette.text.primary,
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "20px",
                }}
              >
                {t("chat.note_title")}
              </Typography>

              {isPending && (
                <Loader
                  sx={{
                    width: "20px",
                  }}
                />
              )}
              {saveNoteError && (
                <Typography
                  sx={{
                    color: theme.palette.error.main,
                    textAlign: "center",
                  }}
                >
                  {readError(saveNoteError)}
                </Typography>
              )}
            </Box>
            <CloseButton onClick={onClose} />
          </Box>
          <Box
            onClick={() => ref.current && ref.current.focus()}
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "auto",
            }}
          >
            {!isLoading &&
              (typeof content === "string" || content === null) && (
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

            {isError && (
              <Typography
                sx={{
                  color: theme.palette.error.main,
                  textAlign: "center",
                  marginTop: "10px",
                }}
              >
                {readError(error)}
              </Typography>
            )}
          </Box>
        </Box>
      </Card>
    </Draggable>
  );
};

export default Note;
