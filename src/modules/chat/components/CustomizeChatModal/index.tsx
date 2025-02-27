import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import wallpaper1 from '../../../../assets/chatWallpapers/1.jpeg';
import wallpaper2 from '../../../../assets/chatWallpapers/2.jpg';
import Modal from '../../../shared/components/Modal';

interface Props {
    onChangeWallpaper: (wallpaper: string) => void;
    open: boolean;
    onClose: () => void;
}

const wallpapers = [
    {
        src: wallpaper1,
        id: 'default-1',
    },
    {
        src: wallpaper2,
        id: 'default-2',
    },
];

const CustomizeChatModal = ({ onChangeWallpaper, ...props }: Props) => {
    const { t } = useTranslation();
    return (
        <Modal title={t('chat.customize_chat.title')} {...props}>
            <Box>
                <Typography sx={{ marginBottom: '10px' }} variant="h6">
                    {t('chat.customize_chat.desc')}
                </Typography>
                <Box>
                    {wallpapers.map((wallpaper) => (
                        <Button
                            key={wallpaper.id}
                            onClick={() => onChangeWallpaper(wallpaper.src)}
                            sx={{
                                backgroundImage: `url(${wallpaper.src})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                width: '100%',
                                height: '100px',
                                borderRadius: '10px',
                                margin: '10px 0',
                                cursor: 'pointer',
                            }}
                        />
                    ))}
                </Box>
            </Box>
        </Modal>
    );
};

export default CustomizeChatModal;
