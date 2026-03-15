import { useTranslation } from "react-i18next";
import Modal from "../../../shared/components/Modal";

interface Props {
    open: boolean;
    onClose: () => void;
}

const CustomizeChatModal = ({ ...props }: Props) => {
    const { t } = useTranslation();
    return (
        <Modal title={t("chat.customize_chat.title")} {...props}>
            <div>
                <p className="text-muted-foreground text-sm">{t("chat.customize_chat.desc")}</p>
            </div>
        </Modal>
    );
};

export default CustomizeChatModal;
