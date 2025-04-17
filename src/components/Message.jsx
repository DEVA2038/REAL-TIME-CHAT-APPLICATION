import React from 'react';
import { motion } from 'framer-motion';

const messageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0 }
};

const Message = ({ message, isCurrentUser }) => {
  if (message.type === 'notification') {
    return (
      <motion.div
        className="notification"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={messageVariants}
        transition={{ duration: 0.3 }}
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
      transition={{ duration: 0.3 }}
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

export default Message;