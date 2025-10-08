import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { Wrapper } from "./style";

interface Props {
    children?: React.ReactNode;
    id: string; // unikalny identyfikator, np. "auto_delete_info"
}

const Info = ({ children, id }: Props) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // Sprawdź, czy użytkownik już zamknął ten komunikat
        const isClosed = localStorage.getItem(`info_closed_${id}`);
        if (isClosed) {
            setVisible(false);
        }
    }, [id]);

    const handleClose = () => {
        // Ukryj i zapisz do localStorage
        setVisible(false);
        localStorage.setItem(`info_closed_${id}`, "true");
    };

    if (!visible) return null;

    return (
        <Wrapper>
            {children}
            <IconButton
                color="info"
                size="small"
                onClick={handleClose}
                // style={{
                //     background: "transparent",
                //     border: "none",
                //     cursor: "pointer",
                //     fontSize: "16px",
                //     marginLeft: "8px",
                // }}

                aria-label="Zamknij komunikat"
            >
                ✕
            </IconButton>
        </Wrapper>
    );
};

export default Info;
