import { Box, Button, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SimpleCard from '../../../shared/components/SimpleCard';

interface Props {
    username: string;
    email: string;
}

const UserProfileSettings = ({ email, username }: Props) => {
    const { t } = useTranslation();
    return (
        <SimpleCard
            subtitleProps={{
                fontSize: '20px',
            }}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
            }}
            subtitle={t('profile.settings_subtitle')}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Box>
                    <Typography
                        color="text.secondary"
                        sx={{
                            fontSize: '18px',
                        }}
                    >
                        {t('profile.settings_acc_name', { name: username })}
                    </Typography>
                    <Typography
                        color="text.secondary"
                        sx={{
                            fontSize: '18px',
                        }}
                    >
                        {t('profile.settings_acc_email', {
                            email: email,
                        })}
                    </Typography>
                </Box>
                <Tooltip title={t('common.comming_soon')}>
                    <Box>
                        <Button variant="contained" href="/users/change-password">
                            {t('common.change_pass')}
                        </Button>
                    </Box>
                </Tooltip>
            </Box>
            <Typography
                sx={{
                    fontSize: '18px',
                }}
            >
                {t('profile.this_section_is_private')}
            </Typography>
        </SimpleCard>
    );
};

export default UserProfileSettings;
