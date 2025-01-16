import CloseIcon from '@mui/icons-material/Close';
import { Box, Drawer, IconButton, List, TextField, useMediaQuery } from '@mui/material';
import { t } from 'i18next';
import useTheme from '../../../../theme';
import { Pagination } from '../../../shared/types';
import { Chat } from '../../types';
import ChatItem from '../ChatItem';

interface Props {
    data?: Pagination<Chat>;
    onChangeChat: (id: string) => void;
    currentChatId?: number;
    showSidebar?: boolean;
    handleDrawerToggle?: () => void;
}

const ChatSidebar = ({ data, onChangeChat, currentChatId, showSidebar, handleDrawerToggle }: Props) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Czy urządzenie jest mobilne

    const sidebarContent = (
        <Box
            sx={{
                backgroundColor: theme.palette.background.default,
                borderRadius: { sm: '8px', xs: 0 }, // Bez zaokrąglenia na mobilkach
                display: 'flex',
                width: '100%',
                padding: '10px',
                height: '100%',
            }}
        >
            <Box sx={{ width: '100%' }}>
                <Box display="flex" gap={2} alignItems="center" sx={{ paddingBottom: '15px' }}>
                    <TextField
                        fullWidth
                        label={t('common.search')}
                        variant="filled"
                        sx={{
                            color: theme.palette.text.primary,
                        }}
                    />
                    <Box
                        sx={{
                            display: { sm: 'none', md: 'none' },
                        }}
                    >
                        <IconButton
                            onClick={handleDrawerToggle}
                            sx={{
                                color: theme.palette.colors.danger,
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>
                <List
                    style={{
                        maxHeight: '75vh',
                        minHeight: '500px',
                        overflow: 'auto',
                    }}
                >
                    {data &&
                        data.items.map((chat) => (
                            <ChatItem
                                onChange={(id) => onChangeChat(id)}
                                selected={!!currentChatId && chat.id === currentChatId}
                                chat={chat}
                                key={chat.id}
                            />
                        ))}
                </List>
            </Box>
        </Box>
    );

    return (
        <>
            {isMobile ? (
                <>
                    <Drawer
                        variant="temporary"
                        anchor="left"
                        open={showSidebar}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true,
                        }}
                        sx={{
                            '& .MuiDrawer-paper': {
                                width: '100%',
                            },
                        }}
                    >
                        {sidebarContent}
                    </Drawer>
                </>
            ) : (
                <Box sx={{ width: '350px', height: '100%' }}>{sidebarContent}</Box>
            )}
        </>
    );
};

export default ChatSidebar;
