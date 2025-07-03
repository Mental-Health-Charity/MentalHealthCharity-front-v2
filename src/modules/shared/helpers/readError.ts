import Errors from "../constants";

const readError = (error: Error) => {
    const message = error.message in Errors ? Errors[error.message as keyof typeof Errors] : Errors.unknown;

    return message;
};

export default readError;
