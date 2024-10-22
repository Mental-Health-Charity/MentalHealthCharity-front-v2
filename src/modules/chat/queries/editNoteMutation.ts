import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import { ErrorMessage } from "../../shared/types";
import { EditNotePayload } from "../types";

const editNoteMutation = async ({
  content,
  id,
}: EditNotePayload): Promise<string> => {
  const headers = getAuthHeaders();

  const res = await fetch(url.chat.editNote({ id }), {
    method: "POST",
    headers,
    body: JSON.stringify({ content }),
  });

  if (!res.ok) {
    throw new Error(ErrorMessage.FAILED_TO_SAVE_NOTE);
  }

  const note: string = await res.json();

  return note;
};

export default editNoteMutation;
