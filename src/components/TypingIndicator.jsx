import React from 'react';
import { motion } from 'framer-motion';

const dotVariants = {
  animate: {
    y: [0, -4, 0],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      repeatType: 'reverse'
    }
  }
};

const TypingIndicator = ({ username }) => {
  return (
    <motion.div
      className="typing-indicator"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <span className="typing-text">{username} is typing</span>
      <div className="typing-dots">
        <motion.span variants={dotVariants} animate="animate" />
        <motion.span
          variants={dotVariants}
          animate="animate"
          transition={{ delay: 0.2 }}
        />
        <motion.span
          variants={dotVariants}
          animate="animate"
          transition={{ delay: 0.4 }}
        />
      </div>
    </motion.div>
  );
};

export default TypingIndicator;