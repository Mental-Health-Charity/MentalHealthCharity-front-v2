import { Box, BoxProps, ModalProps, Modal as MUIModal, Typography, useTheme } from '@mui/material';
import CloseButton from '../CloseButton';

interface Props extends ModalProps {
    title: string;
    modalContentProps?: BoxProps;
}

const Modal = ({ title, modalContentProps, ...props }: Props) => {
    const theme = useTheme();

    return (
        <MUIModal
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            {...props}
        >
            <Box
                {...modalContentProps}
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    padding: '10px 15px',
                    borderRadius: '8px',
                    minWidth: '300px',
                    ...modalContentProps?.sx,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '10px',
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: '24px',
                            color: theme.palette.text.secondary,
                            fontWeight: 'bold',
                        }}
                    >
                        {title}
                    </Typography>
                    <CloseButton onClick={(event) => props.onClose?.(event, 'backdropClick')} />
                </Box>
                <Box>{props.children}</Box>
            </Box>
        </MUIModal>
    );
};

export default Modal;
