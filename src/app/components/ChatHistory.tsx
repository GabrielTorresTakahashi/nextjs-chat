import { Autocomplete, Box, Button, Divider, IconButton, Modal, Paper, TextField, Typography, useTheme } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import chatApi from '../services/chatApi';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { socket } from '../services/socket';
import ChatMessage from './ChatMessage';

type ChatHistoryProps = {
    chatId: string;
    setActiveGroup: React.Dispatch<React.SetStateAction<any>>;
    setChats: React.Dispatch<React.SetStateAction<any[]>>;
    chats: any[];
}

function ChatHistory({ chatId, setActiveGroup, chats, setChats }: ChatHistoryProps) {
    const [chatInfo, setchatInfo] = useState<any>();
    const [chatMessages, setChatMessages] = useState<any[]>([])
    const [messageText, setMessageText] = useState<string>("");
    const [requireMsg, setRequireMsg] = useState(false);
    const [me, setMe] = useState<any>(undefined);
    const [openModal, setOpenModal] = useState(false);
    const [userSearch, setUserSearch] = useState<string | undefined>("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(undefined)
    const chatEndRef = useRef<HTMLDivElement>(null);

    /**
     * Busca o histórico do chat atual
     */
    const handleGetHistory = async () => {
        try {
            const resChat = await chatApi.get(`api/chat/group?filter=_id=${chatId}`)
            setchatInfo(resChat.data[0]);
            setChatMessages(resChat.data[0].messages)
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * Deleta o chat atual
     */
    const handleDeleteGroup = async () => {
        try {
            await chatApi.delete(`api/chat/group?_id=${chatId}`)
            setActiveGroup(undefined)
            const index = chats.map((item) => item._id).indexOf(chatId);
            chats.splice(index, 1);
            setChats([...chats])
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * Envia uma mensagem para o chat atual.
     * @param e 
     */
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!messageText) {
            setRequireMsg(true);
            return
        }
        setRequireMsg(false);
        socket.emit("send_msg", { sender: me, to: chatId, text: messageText }, (acknoledgement: any) => {
            chatApi.post(`api/chat/message`, { sender: me._id, to: chatId, text: messageText }
            ).then((createdMessage) => {
                chatApi.patch(`api/chat/group/newMessage?groupId=${chatId}`, {
                    message: createdMessage.data._id
                }).then(response => {
                    // console.log(response.data)
                })
            })
            const newMessage = { sender: me, to: chatId, text: messageText, createdAt: new Date() }
            setChatMessages([...chatMessages, newMessage]);
        })
        setMessageText("")
    }

    const handleGetUserinfo = async () => {
        const resUser = await chatApi.get(`api/user/me`);
        setMe(resUser.data)
    }

    const handleGetSuggestions = async () => {
        const resUsers = await chatApi.get(`api/user${userSearch && `?nome=${userSearch}`}`);
        const suggestionsFormat = resUsers.data.map((item: any) => ({ ...item, label: item.nome }))
        setSuggestions(suggestionsFormat)
    }

    const handleAddUser = async () => {
        await chatApi.patch(`api/chat/group/addMember`, { group: chatId, member: selectedUser._id })
        setUserSearch("");
        setSelectedUser(undefined);
        setOpenModal(false);
    }

    useEffect(() => {
        handleGetHistory();
        handleGetUserinfo();
    }, [chatId])

    useEffect(() => {
        socket.connect();
        socket.emit("join_room", { chatId })
        handleGetSuggestions()
        return () => {
            socket.disconnect()
        }
    }, [])

    useEffect(() => {
        socket.on("receive_msg", (msgInfo) => {
            const { sender, to, text } = msgInfo;

            setChatMessages([...chatMessages, { sender, to, text }]);
        })
        chatEndRef?.current?.scrollIntoView({ behavior: "smooth" })

        return () => {
            socket.off("receive_msg")
        }
    }, [chatMessages])


    return (
        <>
            <Box sx={{ width: "70svw", height: "100svh", display: "flex", flexDirection: "column" }}>
                <Paper
                    sx={{ width: "100%", padding: 2, display: "flex", justifyContent: "space-between", height: "15svh" }}
                >
                    <Typography variant='h4' sx={{ fontWeight: "bold", minWidth: "25svw" }}>{chatInfo?.name}</Typography>
                    <Typography variant='caption' sx={{ minWidth: "25svw", textOverflow: "ellipsis", overflow: "hidden" }}>{chatInfo?.description}</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {chatInfo?.private && <IconButton onClick={() => setOpenModal(true)}>
                            <GroupAddIcon />
                        </IconButton>}
                        <IconButton onClick={handleDeleteGroup}>
                            <DeleteIcon htmlColor='red' />
                        </IconButton>
                        <IconButton onClick={() => setActiveGroup(undefined)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Paper>
                <Box
                    sx={{
                        width: "100%",
                        padding: 2,
                        display: "flex",
                        flexDirection: "column",
                        overflowY: "scroll",
                        scrollbarWidth: "none",
                        gap: 0
                    }}
                >
                    {chatInfo && chatMessages.map((message: any, index: number) => {
                        const sameUser = index > 0 && chatMessages[index - 1] && chatMessages[index - 1].sender._id === message.sender._id;
                        return <ChatMessage key={index} me={me} message={message} sameUser={sameUser} />
                    }
                    )}
                    <div ref={chatEndRef} />
                </Box>
                <Box sx={{ marginTop: "auto", width: "100%" }}>
                    <form onSubmit={handleSendMessage}>
                        <TextField
                            error={requireMsg}
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            sx={{ width: "100%" }}
                            label="Digite uma mensagem . . ."
                            variant="filled"
                        />
                    </form>
                </Box>
            </Box>
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: "30%",
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Typography variant="h6" component="h2">
                        Adicionar usuário
                    </Typography>
                    <Autocomplete
                        disablePortal
                        inputValue={userSearch}
                        onInputChange={(event: any, newInputValue: string | undefined) => {
                            setUserSearch(newInputValue);
                        }}
                        value={selectedUser}
                        onChange={(event, newValue) => {
                            setSelectedUser(newValue);
                        }}
                        options={suggestions}
                        sx={{ width: "100%", marginY: 1, }}
                        renderInput={(params) => <TextField {...params} label="Adicionar membro" />}
                    />
                    <Button variant='contained' onClick={handleAddUser}>Adicionar usuário</Button>
                </Box>
            </Modal>
        </>
    )
}

export default ChatHistory