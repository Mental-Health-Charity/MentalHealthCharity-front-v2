/* eslint-disable */
import toast from "react-hot-toast";
import Errors from "../constants";
import { ErrorMessage } from "../types";

async function handleApiError(error: unknown): Promise<Error> {
    let detail: string | undefined;

    if (error instanceof Error) {
        detail = error.message;
    } else if (error && typeof error === "object" && "detail" in error) {
        detail = (error as { detail: string }).detail;
    } else if (error && typeof error === "object" && "response" in error) {
        const errResp = (error as any).response?.data;
        if (errResp?.detail) {
            detail = errResp.detail;
        }
    }

    const errorCode = detail ? detail.toUpperCase().replace(/ /g, "_") : ErrorMessage.UNKNOWN;

    const name = ErrorMessage[errorCode as keyof typeof ErrorMessage] ?? ErrorMessage.UNKNOWN;
    const message = Errors[name] || Errors[ErrorMessage.UNKNOWN];

    toast.error(message);
    throw { name, message };
}

export default handleApiError;
