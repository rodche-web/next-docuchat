'use client'
import { useRef, useState, useEffect } from 'react';
import { Card, CardContent, TextField, Button } from '@mui/material';
import Message from './Message';

const ChatCard = () => {
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')

  const chatboxRef = useRef(null);

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

      try {
        const botResponse = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages: payload }),
        });

        if (botResponse.ok) {
          const data = await botResponse.json();
          setMessages(prev => ([...prev, data.message]));
        } else {
          console.error('Failed to fetch');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  // Note: add this so chat messages start at the bottom
  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card>
      <CardContent>
        {/* Chatbox */}
        <div ref={chatboxRef} style={{ height: '60vh', overflow: 'auto' }}>
          {messages.map((item, index) => (
            <Message key={index} message={item.content} username={item.role === 'assistant' ? 'Assistant' : 'User'} isCurrentUser={item.role === 'user'} />
          ))}
        </div>

        {/* Text area and submit button */}
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
          <Button type="submit" variant="contained" color="primary">
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChatCard;

