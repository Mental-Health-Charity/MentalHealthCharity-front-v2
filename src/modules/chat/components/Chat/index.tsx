import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SendIcon from '@mui/icons-material/Send';
import { Box, Button, IconButton, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useUser } from '../../../auth/components/AuthProvider';
import Loader from '../../../shared/components/Loader';
import Skeleton from '../../../shared/components/Skeleton';
import { Chat as ChatType, ConnectionStatus, Message } from '../../types';
import ConnectionModal from '../ConnectionModal';
import ChatMessage from '../Message';

interface Props {
    chat?: ChatType;
    onSendMessage: (message: string) => void;
    messages: Message[];
    status: ConnectionStatus;
    onShowDetails?: () => void;
}

const Chat = ({ chat, messages, onSendMessage, status, onShowDetails }: Props) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const { user } = useUser();
    const isMobile = useMediaQuery('(max-width: 600px)');

    const validationSchema = Yup.object({
        message: Yup.string().max(1500).required(),
    });

    const formik = useFormik({
        initialValues: {
            message: '',
        },
        validationSchema,
        onSubmit: (values, { resetForm }) => {
            onSendMessage(values.message);
            resetForm();
        },
    });

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.paper,
                width: '100%',
                height: '100%',
                display: 'flex',
                gap: '15px',
                padding: '15px',
                borderRadius: '10px',
                flexDirection: 'column',
                position: 'relative',
            }}
        >
            <Box
                sx={{
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                {chat ? (
                    <Typography
                        sx={{
                            fontSize: '20px',
                            fontWeight: 600,
                        }}
                    >
                        {chat.name}
                    </Typography>
                ) : (
                    <Skeleton />
                )}
                {onShowDetails && (
                    <IconButton onClick={onShowDetails}>
                        <PeopleAltIcon />
                    </IconButton>
                )}
            </Box>

            <Box
                sx={{
                    width: '100%',
                    gap: '10px',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    height: '70vh',
                    overflowY: 'auto',
                    padding: '10px 15px 10px 0',
                }}
            >
                {messages ? messages.map((message) => <ChatMessage message={message} key={message.id} />) : <Loader />}
            </Box>

            <Box sx={{ display: 'flex', gap: '20px' }}>
                <TextField
                    slotProps={{
                        htmlInput: {
                            maxLength: 1500,
                        },
                    }}
                    fullWidth
                    variant="filled"
                    disabled={!chat || !user || !chat.participants.some((p) => p.id === user.id)}
                    label={t('chat.enter_message_label')}
                    name="message"
                    value={formik.values.message}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            formik.handleSubmit();
                            event.preventDefault();
                        }
                    }}
                />
                <Button
                    sx={{
                        gap: '10px',
                    }}
                    variant="contained"
                    onClick={() => formik.handleSubmit()}
                >
                    {isMobile ? '' : t('chat.send')}{' '}
                    <SendIcon
                        sx={{
                            marginTop: '-3px',
                        }}
                    />
                </Button>
            </Box>
            <ConnectionModal status={status} />
        </Box>
    );
};

export default Chat;
