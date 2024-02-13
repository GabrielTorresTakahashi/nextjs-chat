'use client'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Sidebar from '../components/Sidebar';
import chatApi from '../services/chatApi';
import { useEffect, useState } from 'react';
import ChatContext from './ChatContext';
import ChatHistory from '../components/ChatHistory';
import { Collapse } from '@mui/material';

export default function Chats() {
  const [user, setUser] = useState<any>();
  const [chats, setChats] = useState<any[]>([]);
  const [activeGroup, setActiveGroup] = useState<string>()

  const handleGetMe = async () => {
    try {
      const resUser = await chatApi.get(`api/user/me`);
      setUser(resUser.data)
    } catch (error) {
      console.error("Erro ao buscar perfil", error);
    }
  }

  const handleGetGroups = async () => {
    try {
      const resGroups = await chatApi.get(`api/chat/group`);
      setChats([...resGroups.data]);
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (window) {
      handleGetMe();
    }
    handleGetGroups();
  }, [])

  const contextData = {
    chats,
    setChats,
    activeGroup,
    setActiveGroup
  }

  return (
    <ChatContext.Provider value={contextData}>
      <Box sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
        <Sidebar chats={chats} setChats={setChats} setActiveGroup={setActiveGroup} />
        <Collapse orientation="horizontal" in={activeGroup ? true : false}>
          {activeGroup &&
            <ChatHistory setActiveGroup={setActiveGroup} chatId={activeGroup} chats={chats} setChats={setChats} />
          }
        </Collapse>
      </Box>
    </ChatContext.Provider>
  );
}