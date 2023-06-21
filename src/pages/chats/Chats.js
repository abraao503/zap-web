import React, { useState } from 'react';
import { Box, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material';
import QRCode from 'react-qr-code';

function App() {
    const conversations = [
        { name: 'Alice', message: 'Hi there!', avatar: 'https://i.pravatar.cc/150?u=alice' },
        { name: 'Bob', message: 'Hey!', avatar: 'https://i.pravatar.cc/150?u=bob' },
        { name: 'Charlie', message: 'What are you up to?', avatar: 'https://i.pravatar.cc/150?u=charlie' }
    ];

    const [selectedConversation, setSelectedConversation] = useState(null);

    const handleConversationClick = (conversation) => {
        setSelectedConversation(conversation);
    };

    const messages = selectedConversation
        ? [
              { text: 'Hello!', isSent: true },
              { text: 'How are you?', isSent: false },
              { text: "I'm good, thanks. How about you?", isSent: true },
              { text: 'Same here.', isSent: false },
              { text: 'What are you up to today?', isSent: false },
              { text: 'Not much, just working on this app. You?', isSent: true },
              { text: 'Just hanging out with some friends.', isSent: false },
              { text: 'Cool. Have fun!', isSent: true }
          ]
        : [];

    return (
        <Box sx={{ display: 'flex' }}>
            <List sx={{ width: '30%' }}>
                {conversations.map((conversation) => (
                    <ListItem button key={conversation.name} onClick={() => handleConversationClick(conversation)}>
                        <ListItemAvatar>
                            <Avatar alt={conversation.name} src={conversation.avatar} />
                        </ListItemAvatar>
                        <ListItemText primary={conversation.name} secondary={conversation.message} />
                    </ListItem>
                ))}
            </List>
            <Box sx={{ width: '70%' }}>
                <List>
                    {messages.map((message, index) => (
                        <ListItem key={index} sx={{ justifyContent: message.isSent ? 'flex-end' : 'flex-start' }}>
                            <ListItemText
                                primary={message.text}
                                sx={{ bgcolor: message.isSent ? 'primary.main' : 'grey.200', color: 'white', borderRadius: '10px', p: 2 }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>
            <QRCode value="2@HAcsE4tiZOLLoWrCbMUXyX7g9FsHusc3hBfFPoDRvGHa01wAcMPZ4Vm+xxgXFi+EBfFNYNQPLP4EEg==,6XzfgEAqVk47z3RL/QPdo5Q4u1yV6nxQflVpNwMRiis=,KeyfdLjRasFxYcXrVrnBx891t7ioDI4/s0JrG3ezqj4=,GLKJSosPKcIfPg+YpUZDlhnZ1qg72FatTAcmPqkSMzY=" />
        </Box>
    );
}

export default App;
