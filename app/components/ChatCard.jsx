'use client'
import { useRef, useState, useEffect } from 'react';
import { Card, CardContent, TextField, Button, IconButton, Typography } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Message from './Message';

const ChatCard = () => {
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [doc, setDoc] = useState()

  const chatboxRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    setInputText(e.target.value)
  };

  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (inputText.trim() !== '') {
      const newMessage = {
        role: 'user',
        content: inputText
      }
      
      const payload = [...messages, newMessage]
      setMessages(payload);
      setInputText('');
      const formData = new FormData()
      formData.append('message', inputText)
      formData.append('document', doc)

      try {
        const botResponse = await fetch('/api/chat', {
          method: 'POST',
          body: formData
        });

        if (botResponse.ok) {
          const data = await botResponse.json();
          const messageObject = {role: 'assistant', content: data.message}
          setMessages(prev => ([...prev, messageObject]));
        } else {
          console.error('Failed to fetch');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  }

  const handleFileUpload = e => {
    setDoc(e.target.files[0])
  }

  // Note: add this so chat messages start at the bottom
  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card style={{width: '50%', margin: '20px auto'}}>
      <CardContent>
        <div ref={chatboxRef} style={{ height: '60vh', overflow: 'auto' }}>
          {messages.map((item, index) => (
            <Message key={index} message={item.content} username={item.role === 'assistant' ? 'Assistant' : 'User'} isCurrentUser={item.role === 'user'} />
          ))}
        </div>

        <form onSubmit={handleFormSubmit}>
          <TextField
            label="Type a message"
            value={inputText}
            onChange={handleInputChange}
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" disabled={!doc && !inputText}>
            Send
          </Button>
          <IconButton color="primary" onClick={handleFileButtonClick}>
            <AttachFileIcon />
          </IconButton>
          <input
            type="file"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <Typography variant="h6">
            {doc ? doc.name : ''}
          </Typography>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChatCard;

