import { Box, BoxProps, useTheme } from '@mui/material';
import loading_icon from '../../../../assets/static/loading.svg';

interface Props extends BoxProps {
    variant?: 'small' | 'fullscreen';
    size?: number;
}

const Loader = ({ variant = 'small', size = 60, ...props }: Props) => {
    const theme = useTheme();
    if (variant === 'fullscreen') {
        return (
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    zIndex: 9,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: theme.palette.background.default,
                    ...props.sx,
                }}
                {...props}
            >
                <img src={loading_icon} alt="Loading icon" width="60" height="60" />
            </Box>
        );
    }

    if (variant === 'small') {
        return (
            <Box
                sx={{
                    height: size,
                    width: size,
                    margin: 'auto auto',
                    ...props.sx,
                }}
                {...props}
            >
                <img src={loading_icon} alt="Loading icon" width="100%" height="auto" />
            </Box>
        );
    }
};

export default Loader;
