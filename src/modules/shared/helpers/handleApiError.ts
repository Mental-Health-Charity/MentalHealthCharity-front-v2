import toast from 'react-hot-toast';
import Errors from '../constants';
import { ErrorMessage } from '../types';

async function handleApiError(error: unknown): Promise<Error> {
    if (error && typeof error === 'object' && 'detail' in error) {
        const errorDetails = (error as { detail: string }).detail;
        const errorCode = errorDetails.toUpperCase().replace(/ /g, '_');
        const name = ErrorMessage[errorCode as keyof typeof ErrorMessage];

        const message = Errors[name] || Errors[ErrorMessage.UNKNOWN];
        toast.error(message);
        throw { message, name };
    }

    const message = Errors[ErrorMessage.UNKNOWN];
    toast.error(message);
    throw { name: ErrorMessage.UNKNOWN, message };
}

export default handleApiError;
