import { Autocomplete, Box, Button, Collapse, Container, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Modal, Paper, TextField, Typography, useTheme } from '@mui/material'
import React, { Fragment, useContext, useEffect, useState } from 'react'
import chatApi from '../services/chatApi';
import ChatContext from '../chats/ChatContext';
import GroupsIcon from '@mui/icons-material/Groups';
import { useRouter } from 'next/navigation';
import LogoutIcon from '@mui/icons-material/Logout';

type SidebarProps = {
    chats: any[];
    setChats: React.Dispatch<React.SetStateAction<any[]>>;
    setActiveGroup: React.Dispatch<React.SetStateAction<any>>;
}

function Sidebar({ chats, setChats, setActiveGroup }: SidebarProps) {
    const { } = useContext(ChatContext);
    const navigator = useRouter();
    const theme = useTheme()
    const [open, setOpen] = useState(false)
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [creatingGroup, setCreatingGroup] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [groupDescription, setGroupDescription] = useState("")
    const [error, setError] = useState(false)

    const toggleModal = () => {
        setOpen(!open)
    }

    const handleGetUsers = async () => {
        try {
            const resUsers = await chatApi.get(`api/user`);
            setSuggestions(resUsers.data);
        } catch (error) {
            setSuggestions([]);
        }
    }

    const handleCreateGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!groupName) {
                setError(true)
                return
            }
            setError(false)
            const rescreated = await chatApi.post(`api/chat/group`, {
                name: groupName,
                description: groupDescription,
            });
            setChats([...chats, rescreated.data]);
            setOpen(false)
        } catch (error) {
            console.error(error)
        }
    }

    const handleLogout = () => {
        sessionStorage.removeItem("token")
        navigator.push("/login")
    }

    // Busca as primeiras sugestões
    useEffect(() => {
        handleGetUsers()
    }, [])


    return (
        <Box
            sx={{
                width: "30svw",
                height: "100svh",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <Paper sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", padding: 2, width: "100%", height: "15svh" }}>
                <Typography variant='h5'>CONVERSAS</Typography>
                <Divider />
            </Paper>
            <List sx={{ width: "100%", overflowY: "scroll", height: "100%", scrollbarWidth: "none" }}>
                {chats.map((chat: any, index: number) => (
                    <ListItem key={index} disablePadding>
                        <ListItemButton onClick={() => setActiveGroup(chat._id)}>
                            <ListItemIcon>
                                <GroupsIcon />
                            </ListItemIcon>
                            <ListItemText primary={chat.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>


            <Button onClick={toggleModal} variant='contained' sx={{ marginY: 3 }}>Nova conversa</Button>
            <IconButton onClick={handleLogout}>
                <LogoutIcon />
            </IconButton>
            <Modal
                open={open}
                onClose={toggleModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
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
                }}>
                    <Button sx={{ marginY: 1 }} variant='contained' onClick={() => setCreatingGroup(!creatingGroup)}>
                        {creatingGroup ? "Cancelar" : "Criar novo grupo"}
                    </Button>
                    <Collapse sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                    }}
                        in={creatingGroup}>
                        <form onSubmit={handleCreateGroup}>
                            <Typography sx={{ marginY: 1 }} variant='h5'>Novo grupo</Typography>
                            <TextField
                                error={error}
                                helperText="O nome do grupo é obrigatório"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                sx={{ marginY: 1, width: "100%" }}
                                label="Nome do grupo"
                                variant="outlined"
                            />
                            <TextField
                                value={groupDescription}
                                onChange={(e) => setGroupDescription(e.target.value)}
                                sx={{ marginY: 1, width: "100%" }}
                                label="Descrição (opcional)"
                                variant="outlined"
                            />
                            <Button sx={{ marginY: 1 }} variant='contained' type='submit' onClick={handleCreateGroup}>
                                Criar grupo
                            </Button>
                        </form>
                    </Collapse>
                </Box>
            </Modal>
        </Box>
    )
}

export default Sidebar