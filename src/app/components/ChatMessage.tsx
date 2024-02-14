import { Box, Typography, useTheme } from '@mui/material';
import React from 'react'

type ChatMessageProps = {
    sameUser: boolean;
    message: any;
    me: any;
}

function ChatMessage({ sameUser, message, me }: ChatMessageProps) {
    const theme = useTheme();
    const sentByMe = message.sender._id === me._id
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: sentByMe ? "flex-end" : "flex-start",
            }}>
            {(!sentByMe && !sameUser) && <Typography variant="overline">{message.sender.nome}</Typography>}
            <Box sx={{
                padding: 1,
                borderRadius: 4,
                borderTopRightRadius: sentByMe ? 0 : "4",
                borderTopLeftRadius: sentByMe ? "4" : 0,
                borderBottomLeftRadius: sentByMe ? "4" : 0,
                borderBottomRightRadius: sentByMe ? 0 : "4",
                bgcolor: sentByMe ? theme.palette.primary.dark : theme.palette.secondary.dark,
                flexWrap: "wrap",
                display: "flex",
                flexDirection: "column",
                maxWidth: "100%",
            }}>
                <Typography sx={{
                    textOverflow: "ellipsis",
                    overflowWrap: "break-word",
                    paddingLeft: !sentByMe ? 1 : 0,
                    paddingRight: 5,
                }}>
                    {message.text}
                </Typography>
                <Typography
                    variant='caption'
                    sx={{
                        textOverflow: "ellipsis",
                        overflowWrap: "break-word",
                        alignSelf: "flex-end",
                        marginTop: -1,
                    }}>
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Typography>
            </Box>
        </Box>
    )

}

export default ChatMessage