import { CreateChatFormValues, CreateChatPayload } from "../types";

const convertToCreateChatPayload = ({
    name,
    flags,
    role,
}: CreateChatFormValues): CreateChatPayload => ({
    name,
    flags: {
        ...flags.reduce((acc, flag) => {
            acc[flag] = flag === "autoGroupChat" ? [role] : [""];
            return acc;
        }, {} as Record<string, string[]>),
    },
});

export default convertToCreateChatPayload;
