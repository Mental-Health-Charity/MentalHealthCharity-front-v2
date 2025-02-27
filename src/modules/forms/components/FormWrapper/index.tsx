import { Box, LinearProgress, Typography } from '@mui/material';
import useTheme from '../../../../theme';

interface Props {
    progress: number;
    title: string;
    subtitle: string;
    children?: React.ReactNode;
}

const FormWrapper = ({ progress, subtitle, title, children }: Props) => {
    const theme = useTheme();
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: 'fit-content',
                maxWidth: '800px',
                overflow: 'hidden',
                padding: '0',
                borderRadius: '4px',
                backgroundColor: `${theme.palette.background.default}BD`,
                boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)',
                backdropFilter: 'blur(15px)',
            }}
        >
            <LinearProgress
                sx={{
                    width: '100%',
                    borderRadius: '0',
                    marginBottom: '20px',
                    padding: '5px',
                }}
                color="primary"
                variant="determinate"
                value={progress}
            />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '20px 30px 0 30px',
                    gap: '10px',
                }}
            >
                <Typography color="textSecondary" fontWeight="bold" component="h1" fontSize={24} variant="h3">
                    {title}
                </Typography>
                <Typography color="textSecondary" component="h1" fontSize={20} variant="h3">
                    {subtitle}
                </Typography>
            </Box>

            <Box
                sx={{
                    width: '100%',
                    padding: '30px',
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default FormWrapper;
