import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Accessibility Audit Completed',
      message: 'Website scan for example.com achieved 94% WCAG compliance.',
      type: 'success',
      timestamp: '5 mins ago',
      read: false,
    },
    {
      id: '2',
      title: 'Document Processing Ready',
      message: 'User_Manual_v2.pdf text extraction completed successfully.',
      type: 'info',
      timestamp: '25 mins ago',
      read: false,
    },
    {
      id: '3',
      title: 'New OpenAI Engine Active',
      message: 'Multimodal prompt generation engine initialized.',
      type: 'info',
      timestamp: '2 hours ago',
      read: true,
    },
  ]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const togglePanel = () => setIsPanelOpen((prev) => !prev);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        notifications,
        isPanelOpen,
        addToast,
        removeToast,
        togglePanel,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};

export default NotificationContext;
