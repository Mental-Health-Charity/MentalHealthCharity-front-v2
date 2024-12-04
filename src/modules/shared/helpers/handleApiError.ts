import toast from "react-hot-toast";
import Errors from "../constants";
import { ErrorMessage } from "../types";

function handleApiError(error: unknown): Error {
    if (isApiError(error)) {
        const errorDetails = error.details;

        const name = ErrorMessage[errorDetails as keyof typeof ErrorMessage];
        const message = Errors[name] || Errors[ErrorMessage.UNKNOWN];

        toast.error(message);
        throw { message, name };
    }

    const message = Errors[ErrorMessage.UNKNOWN];
    toast.error(message);
    throw { name: ErrorMessage.UNKNOWN, message };
}

function isApiError(error: unknown): error is { details: string } {
    return (
        typeof error === "object" &&
        error !== null &&
        "details" in error &&
        typeof (error as { details: unknown }).details === "string"
    );
}

export default handleApiError;
