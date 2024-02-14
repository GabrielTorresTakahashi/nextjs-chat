import { Box, Button, Collapse, Divider, FormControlLabel, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Modal, Paper, Switch, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import chatApi from '../services/chatApi';
import LockIcon from '@mui/icons-material/Lock';
import GroupsIcon from '@mui/icons-material/Groups';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';

type SidebarProps = {
    chats: any[];
    setChats: React.Dispatch<React.SetStateAction<any[]>>;
    setActiveGroup: React.Dispatch<React.SetStateAction<any>>;
    me: any;
}

function Sidebar({ chats, setChats, setActiveGroup, me }: SidebarProps) {
    const navigator = useRouter();
    const [open, setOpen] = useState(false)
    const [privateGroup, setPrivateGroup] = useState(false);
    const [creatingGroup, setCreatingGroup] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [groupDescription, setGroupDescription] = useState("")
    const [error, setError] = useState(false)

    const toggleModal = () => {
        setOpen(!open)
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
                private: privateGroup,
                owner: me._id,
                users: [me._id],
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
            <Paper sx={{width: "100%", padding: 2, display: "flex", justifyContent: "center", height: "15svh" }}>
                <Typography variant='h5'>CONVERSAS</Typography>
                <Divider />
            </Paper>
            <List sx={{ width: "100%", overflowY: "scroll", scrollbarWidth: "none" }}>
                {chats.map((chat: any, index: number) => (
                    <ListItem key={index} disablePadding>
                        <ListItemButton onClick={() => setActiveGroup(chat._id)}>
                            <ListItemIcon>
                                {chat.private ? <LockIcon /> : <GroupsIcon />}
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
                        <Typography sx={{ marginY: 1 }} variant='h5'>Novo grupo</Typography>
                        <form onSubmit={handleCreateGroup}>
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
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <FormControlLabel sx={{ marginRight: "auto" }} control={
                                    <Switch
                                        checked={privateGroup}
                                        onChange={() => setPrivateGroup(!privateGroup)}
                                    />
                                } label="Grupo privado" />
                                <Button sx={{ marginY: 1 }} variant='contained' type='submit' onClick={handleCreateGroup}>
                                    Criar grupo
                                </Button>
                            </Box>
                            <Collapse in={privateGroup}>
                                <Typography>O grupo ficará visível apenas para membros e convidados</Typography>
                            </Collapse>
                        </form>
                    </Collapse>
                </Box>
            </Modal>
        </Box>
    )
}

export default Sidebar