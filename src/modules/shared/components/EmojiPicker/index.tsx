import Picker, { EmojiClickData, EmojiStyle, Theme } from "emoji-picker-react";
import { Smile } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Props {
    onChange: (val: string) => void;
    textFieldRef: React.RefObject<HTMLInputElement>;
}

const EmojiPicker = ({ onChange, textFieldRef }: Props) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const onEmojiClick = (emojiObject: EmojiClickData) => {
        if (!textFieldRef.current) return;

        const cursor = textFieldRef.current.selectionStart || 0;
        const currentMessage = textFieldRef.current.value;

        const newText = currentMessage.slice(0, cursor) + emojiObject.emoji + currentMessage.slice(cursor);
        onChange(newText);

        const newCursor = cursor + emojiObject.emoji.length;
        setTimeout(() => {
            if (textFieldRef.current) {
                textFieldRef.current.setSelectionRange(newCursor, newCursor);
            }
        }, 10);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [setShowEmojiPicker, containerRef]);

    return (
        <div ref={containerRef} className="relative">
            <div className="absolute -right-[70px] bottom-10 z-10 sm:right-[30px]">
                <Picker
                    open={showEmojiPicker}
                    theme={Theme.AUTO}
                    emojiStyle={EmojiStyle.NATIVE}
                    onEmojiClick={onEmojiClick}
                    lazyLoadEmojis
                />
            </div>
            <button
                type="button"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex h-fit items-center justify-center rounded-md p-2 transition-colors"
            >
                <Smile size={24} />
            </button>
        </div>
    );
};

export default EmojiPicker;
