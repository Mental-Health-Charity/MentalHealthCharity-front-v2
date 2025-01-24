import Modal from '../../../shared/components/Modal';
import Markdown from '../../../shared/components/Markdown';
import { t } from 'i18next';
import { Button } from '@mui/material';
import { useEffect, useLayoutEffect, useState } from 'react';
import { getContractForChat } from '../../queries/getContractForChat';
import { useMutation, useQuery } from '@tanstack/react-query';
import usePermissions from '../../../shared/hooks/usePermissions';
import { Permissions } from '../../../shared/constants';
import useDebounce from '../../../shared/hooks/useDebounce';
import toast from 'react-hot-toast';
import { editContractForChatMutation } from '../../queries/editContractForChat';
import { confirmContractForChatMutation } from '../../queries/confirmContractForChat';

interface Props {
    onClose: () => void;
    isOpen: boolean;
    chatId: string;
}

const ContractModal = ({ isOpen, onClose, chatId }: Props) => {
    const [modalContent, setModalContent] = useState('');
    const { data, isLoading, refetch } = useQuery(getContractForChat({ id: chatId }));
    const { hasPermissions } = usePermissions();
    const debouncedModalContent = useDebounce(modalContent, 1000);

    useLayoutEffect(() => {
        if (data) {
            setModalContent(data.content);
        }
    }, [data, chatId]);

    const handleModalContentChange = (content: string) => {
        setModalContent(content);
    };

    useEffect(() => {
        if (debouncedModalContent && !data?.isConfirmed) {
            editContractForChat({ id: chatId, body: modalContent });
        }
    }, [debouncedModalContent]);

    const { mutate: editContractForChat } = useMutation({
        mutationFn: editContractForChatMutation,
        onSuccess: () => {
            toast.success('Edited contract');
            refetch();
        },
    });

    const { mutate } = useMutation({
        mutationFn: confirmContractForChatMutation,
        onSuccess: () => {
            toast.success('Confirmed contract');
            refetch();
        },
    });

    const handleConfirmContract = async () => {
        mutate({
            id: chatId,
            body: {
                is_confirmed: true,
            },
        });
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Modal title="Contract" onClose={onClose} open={isOpen}>
            <>
                <Markdown
                    onChange={handleModalContentChange}
                    content={modalContent}
                    className="markdown-editor"
                    readOnly={false}
                ></Markdown>
                {hasPermissions(Permissions.CAN_CONFIRM_CONTRACT) && (
                    <Button variant="contained" onClick={handleConfirmContract} disabled={(data as any).is_confirmed}>
                        {t('chat.accept_contract')}
                    </Button>
                )}
            </>
        </Modal>
    );
};

export default ContractModal;
