import { MDXEditorMethods } from '@mdxeditor/editor';
import { Box, Button, FormControl } from '@mui/material';
import { useFormik } from 'formik';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Markdown from '../../../shared/components/Markdown';
import SimpleCard from '../../../shared/components/SimpleCard';
interface Props {
    content: string;
    isOwner: boolean;
    onSubmit: (values: { description: string }) => void;
}

const UserProfileDescription = ({ content, isOwner, onSubmit }: Props) => {
    const { t } = useTranslation();
    const editorRef = useRef<MDXEditorMethods>(null);

    const formik = useFormik({
        initialValues: {
            description: content,
        },
        onSubmit,
    });

    return (
        <SimpleCard
            subtitleProps={{
                fontSize: '20px',
            }}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',

                '& div': {
                    padding: '0',
                    fontSize: '18px',
                },
            }}
            subtitle={t('profile.description_subtitle')}
        >
            {isOwner ? (
                <form onSubmit={formik.handleSubmit}>
                    <FormControl
                        sx={{
                            height: '600px',
                            display: 'block',
                            zIndex: 99999,
                            position: 'relative',
                        }}
                        onClick={() => editorRef.current?.focus()}
                    >
                        <Markdown
                            ref={editorRef}
                            onChange={(markdown) => formik.setFieldValue('description', markdown)}
                            readOnly={!isOwner}
                            content={formik.values.description}
                            placeholder={t('profile.description_placeholder')}
                        />
                    </FormControl>
                    {formik.dirty && (
                        <Box
                            sx={{
                                display: 'flex',
                                gap: '10px',
                            }}
                        >
                            <Button type="submit" variant="contained">
                                {t('common.save')}
                            </Button>
                            <Button
                                type="button"
                                onClick={() => {
                                    formik.resetForm();
                                    editorRef.current?.setMarkdown(content);
                                }}
                                variant="outlined"
                            >
                                {t('common.cancel')}
                            </Button>
                        </Box>
                    )}
                </form>
            ) : (
                <Markdown
                    readOnly={!isOwner}
                    content={content.length ? content : t('profile.empty_description_placeholder')}
                />
            )}
        </SimpleCard>
    );
};

export default UserProfileDescription;
