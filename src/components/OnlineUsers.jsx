import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const onlineUsersVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0, transition: { delay: 0.3 } },
  exit: { opacity: 0, x: -20 },
};

const userVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
};

const OnlineUsers = ({ users, currentUser }) => {
  return (
    <motion.div
      className="online-users"
      variants={onlineUsersVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <h3>Online Users ({users.length})</h3>
      <ul>
        <AnimatePresence>
          {users.map((user, index) => (
            <motion.li
              key={index}
              variants={userVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ delay: index * 0.05 }}
              className={user === currentUser ? 'current-user' : ''}
            >
              {user} {user === currentUser && '(You)'}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </motion.div>
  );
};

export default OnlineUsers;