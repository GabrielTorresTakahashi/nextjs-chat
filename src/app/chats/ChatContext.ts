import React, { createContext } from "react";

type ChatContextState = {
    chats: any[];
    setChats: React.Dispatch<React.SetStateAction<any[]>>;
    activeGroup: any;
}

const initialValue = {}

const ChatContext = createContext<ChatContextState | any>(initialValue);

export default ChatContext;