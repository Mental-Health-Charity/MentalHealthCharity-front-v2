import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import { Box, Button } from '@mui/material';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const ShareWebsite = () => {
    const { t } = useTranslation();

    const shareOptions = useMemo(
        () => [
            {
                name: 'Facebook',
                color: '#1877f2',
                icon: <FacebookIcon />,
                to: 'https://www.facebook.com/sharer/sharer.php?u=https://fundacjaperyskop.org',
            },
            {
                name: 'Twitter',
                color: '#000',
                icon: <XIcon />,
                to: 'https://twitter.com/intent/tweet?url=https://fundacjaperyskop.org',
            },
            {
                name: 'Instagram',
                color: 'linear-gradient( to right, #833ab4,#fd1d1d,#fcb045 )',
                icon: <InstagramIcon />,
                to: 'https://www.instagram.com/?url=https://fundacjaperyskop.org',
            },
            {
                name: 'LinkedIn',
                color: '#0077b5',
                icon: <LinkedInIcon />,
                to: 'https://www.linkedin.com/shareArticle?mini=true&url=https://fundacjaperyskop.org',
            },
        ],
        [t]
    );

    return (
        <Box
            sx={{
                display: 'flex',
                padding: '20px 0',
                gap: '10px',
                flexWrap: 'wrap',
            }}
        >
            {shareOptions.map((option) => (
                <Button
                    variant="contained"
                    component={Link}
                    to={option.to}
                    key={option.name}
                    sx={{
                        background: option.color,
                        color: 'white',
                        width: { xs: '100%', sm: 'auto' },
                        '&:hover': {
                            background: option.color,
                        },
                    }}
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    {option.icon}
                    {option.name}
                </Button>
            ))}
            <Button
                variant="contained"
                sx={{
                    width: { xs: '100%', sm: 'auto' },
                }}
                onClick={() => {
                    navigator.clipboard.writeText('https://fundacjaperyskop.org');
                    toast.success(t('common.copied_to_clipboard'));
                }}
            >
                {t('support_us.options.share.copy')}
            </Button>
        </Box>
    );
};

export default ShareWebsite;
