import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { Box, IconButton } from '@mui/material';
import Picker, { EmojiClickData, EmojiStyle, Theme } from 'emoji-picker-react';
import { useEffect, useRef, useState } from 'react';

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
        const currentMessage = textFieldRef.current.value; // aktualna wartość z DOM

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

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [setShowEmojiPicker, containerRef]);

    return (
        <Box
            ref={containerRef}
            sx={{
                position: 'relative',
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '40px',
                    right: { xs: '-70px', sm: '30px' },
                    zIndex: 10,
                }}
            >
                <Picker
                    open={showEmojiPicker}
                    theme={Theme.AUTO}
                    emojiStyle={EmojiStyle.NATIVE}
                    onEmojiClick={onEmojiClick}
                    lazyLoadEmojis
                />
            </Box>
            <IconButton onClick={() => setShowEmojiPicker((prev) => !prev)} sx={{ height: 'fit-content' }}>
                <EmojiEmotionsIcon />
            </IconButton>
        </Box>
    );
};

export default EmojiPicker;
