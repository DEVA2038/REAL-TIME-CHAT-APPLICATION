import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { motion } from 'framer-motion';
import ChatContainer from './components/ChatContainer';
import OnlineUsers from './components/OnlineUsers';
import './App.css';

const socket = io('https://socket-io-chat-server.glitch.me/', {
  transports: ['websocket']
});

const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, delayChildren: 0.3 } },
  exit: { opacity: 0 },
};

const joinBoxVariants = {
  initial: { y: -50, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300 } },
  exit: { opacity: 0, y: -50 },
};

function App() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [joined, setJoined] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('message', (data) => {
      setMessages((prev) => [...prev, data]);
      scrollToBottom();
    });

    socket.on('user joined', (data) => {
      setMessages((prev) => [...prev, data]);
      setUsers(data.users);
      scrollToBottom();
    });

    socket.on('user left', (data) => {
      setMessages((prev) => [...prev, data]);
      setUsers(data.users);
      scrollToBottom();
    });

    socket.on('typing', (data) => {
      if (data.username !== username) {
        setIsTyping(true);
        setTypingUser(data.username);
        setTimeout(() => setIsTyping(false), 2000);
      }
    });

    socket.on('stop typing', () => {
      setIsTyping(false);
    });

    return () => {
      socket.off();
    };
  }, [username]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const joinChat = (e) => {
    e.preventDefault();
    if (username.trim()) {
      socket.emit('join', username);
      setJoined(true);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        username,
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'message'
      };
      socket.emit('message', newMessage);
      setMessage('');
      socket.emit('stop typing');
    }
  };

  const handleTyping = () => {
    if (!isTyping) {
      socket.emit('typing', { username });
    }
  };

  if (!joined) {
    return (
      <motion.div
        className="join-container"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <motion.div
          className="join-box"
          variants={joinBoxVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <h1>Join Chat</h1>
          <form onSubmit={joinChat}>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="chat-app"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <OnlineUsers users={users} currentUser={username} />
      <ChatContainer
        messages={messages}
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        handleTyping={handleTyping}
        isTyping={isTyping}
        typingUser={typingUser}
        username={username}
        messagesEndRef={messagesEndRef}
      />
    </motion.div>
  );
}

export default App;