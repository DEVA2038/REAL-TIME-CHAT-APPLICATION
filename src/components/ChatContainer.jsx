import React from 'react';
import { motion } from 'framer-motion';
import TypingIndicator from './TypingIndicator';
import EmojiPicker from 'emoji-picker-react';

const chatContainerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0 },
};

const messagesContainerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }, // Slightly adjusted stagger
  exit: { opacity: 0 },
};

const messageVariants = {
  hidden: { opacity: 0, y: 10 }, // Slightly less pronounced slide
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }, // Slightly less pronounced slide
};

const Message = ({ message, isCurrentUser }) => {
  if (!message || !message.text) {
    return null; // Ensure message exists and has text
  }

  if (message.type === 'notification') {
    return (
      <motion.div
        className="notification"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={messageVariants}
        transition={{ duration: 0.2 }} // Slightly faster transition
      >
        <p>{message.text}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`message ${isCurrentUser ? 'current-user' : 'other-user'}`}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={messageVariants}
      transition={{ duration: 0.2 }} // Slightly faster transition
    >
      {/* Display username and timestamp for other users */}
      {!isCurrentUser && (
        <div className="message-header">
          <span className="username">{message.username}</span>
          <span className="timestamp">{message.time}</span>
        </div>
      )}

      {/* Message content */}
      <div className="message-content">
        <p>{message.text}</p>
        {isCurrentUser && (
          <span className="timestamp">{message.time}</span>
        )}
      </div>
    </motion.div>
  );
};

const ChatContainer = ({
  messages,
  message,
  setMessage,
  sendMessage,
  handleTyping,
  isTyping,
  typingUser,
  username,
  messagesEndRef
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);

  const onEmojiClick = (emojiObject) => {
    setMessage(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <motion.div
      className="chat-container"
      variants={chatContainerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        className="messages-container"
        variants={messagesContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {messages.map((msg, i) => (
          <Message
            key={i}
            message={msg}
            isCurrentUser={msg.username === username}
          />
        ))}
        {isTyping && <TypingIndicator username={typingUser} />}
        <div ref={messagesEndRef} />
      </motion.div>

      <form onSubmit={sendMessage} className="message-form">
        <div className="emoji-picker-container">
          <motion.button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="emoji-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            😊
          </motion.button>
          {showEmojiPicker && (
            <motion.div
              className="emoji-picker"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </motion.div>
          )}
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          placeholder="Type a message..."
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Send
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ChatContainer;