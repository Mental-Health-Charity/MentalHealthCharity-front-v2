import { useTranslation } from "react-i18next";
import wallpaper1 from "../../../../assets/chatWallpapers/1.jpeg";
import wallpaper2 from "../../../../assets/chatWallpapers/2.jpg";
import Modal from "../../../shared/components/Modal";

interface Props {
    onChangeWallpaper: (wallpaper: string) => void;
    open: boolean;
    onClose: () => void;
}

const wallpapers = [
    {
        src: wallpaper1,
        id: "default-1",
    },
    {
        src: wallpaper2,
        id: "default-2",
    },
];

const CustomizeChatModal = ({ onChangeWallpaper, ...props }: Props) => {
    const { t } = useTranslation();
    return (
        <Modal title={t("chat.customize_chat.title")} {...props}>
            <div>
                <h3 className="text-text-body mb-2.5 text-lg font-semibold">{t("chat.customize_chat.desc")}</h3>
                <div>
                    {wallpapers.map((wallpaper) => (
                        <button
                            key={wallpaper.id}
                            onClick={() => onChangeWallpaper(wallpaper.src)}
                            className="my-2.5 h-[100px] w-full cursor-pointer rounded-[10px] bg-cover bg-center"
                            style={{ backgroundImage: `url(${wallpaper.src})` }}
                        />
                    ))}
                </div>
            </div>
        </Modal>
    );
};

export default CustomizeChatModal;
