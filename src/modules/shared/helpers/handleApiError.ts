import toast from "react-hot-toast";
import Errors from "../constants";
import { ErrorMessage } from "../types";

async function handleApiError(error: unknown): Promise<Error> {
    if (error instanceof Response) {
        const responseBody = await error.json().catch(() => null);
        if (responseBody && "detail" in responseBody) {
            const errorDetails = responseBody.detail as string;
            const errorCode = errorDetails.toUpperCase().replace(/ /g, "_");
            const name = ErrorMessage[errorCode as keyof typeof ErrorMessage];
            const message = Errors[name] || Errors[ErrorMessage.UNKNOWN];
            console.log("Elo", name);
            toast.error(message);
            throw { message, name };
        }
    }

    console.log("error", error);
    const message = Errors[ErrorMessage.UNKNOWN];
    toast.error(message);
    throw { name: ErrorMessage.UNKNOWN, message };
}

export default handleApiError;
