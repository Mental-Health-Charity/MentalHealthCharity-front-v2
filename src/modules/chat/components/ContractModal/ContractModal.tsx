import Modal from '../../../shared/components/Modal';
import Markdown from '../../../shared/components/Markdown';
import { t } from 'i18next';
import { Button } from '@mui/material';
import { useState } from 'react';

interface Props {
    onClose: () => void;
    isOpen: boolean;
}

const ContractModal = ({ isOpen, onClose }: Props) => {
    const [modalContent, setModalContent] = useState('xyz');
    return (
        <Modal title="Contract" onClose={onClose} open={isOpen}>
            <>
                <Markdown content={modalContent} className="markdown-editor" readOnly={false}></Markdown>
                <Button variant="contained"> {t('chat.accept_contract')}</Button>
            </>
        </Modal>
    );
};

export default ContractModal;
