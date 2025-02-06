import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Box, Button, useMediaQuery } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ListRowProps } from 'react-virtualized';
import FormTableItem from '../modules/forms/components/FormTableItem';
import { translatedFormStatus } from '../modules/forms/constants';
import { getFormsQueryOptions } from '../modules/forms/queries/getFormsQueryOptions';
import { formStatus, formTypes } from '../modules/forms/types';
import AdminLayout from '../modules/shared/components/AdminLayout';
import SimpleCard from '../modules/shared/components/SimpleCard';
import WindowListVirtualizer from '../modules/shared/components/WindowListVirtualizer';

const ManageMenteeFormsScreen = () => {
    const { t } = useTranslation();
    const isMobile = useMediaQuery('(max-width: 600px)');
    const [status, setStatus] = useState(formStatus.WAITED);

    const { data, refetch } = useQuery(
        getFormsQueryOptions({
            form_status: status,
            form_type_id: formTypes.MENTEE,
            page: 1,
            size: 100,
        })
    );

    const onRender = ({ index, key, style }: ListRowProps) => {
        const user = data && data.items[index];
        if (!user) return null;

        return (
            <FormTableItem
                refetch={refetch}
                sx={{
                    ...style,
                }}
                key={key}
                form={data.items[index]}
            />
        );
    };

    return (
        <AdminLayout>
            <SimpleCard title={t('manage_mentee_forms.title')} subtitle={t('manage_mentee_forms.subtitle')} />
            <Box display="flex" gap={2}>
                {Object.keys(formStatus).map((option) => (
                    <Button
                        sx={{
                            backgroundColor: 'primary.main',
                            color: 'white',
                            opacity: option === status ? 1 : 0.5,
                        }}
                        onClick={() => setStatus(option as formStatus)}
                    >
                        <FilterAltIcon />
                        {translatedFormStatus[option as formStatus]}
                    </Button>
                ))}
            </Box>
            <Box
                sx={{
                    minHeight: '100vh',
                }}
            >
                <WindowListVirtualizer
                    rowHeight={isMobile ? 1200 : 600}
                    onRender={onRender}
                    rowCount={data ? data.items.length : 0}
                />
            </Box>
        </AdminLayout>
    );
};

export default ManageMenteeFormsScreen;
