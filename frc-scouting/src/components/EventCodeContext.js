import React, { createContext, useContext, useState } from 'react';

// Create the context for event code
const EventCodeContext = createContext();

// Provider component that wraps your app and provides the eventCode state
export const EventCodeProvider = ({ children }) => {
  const [eventCode, setEventCode] = useState('');

  return (
    <EventCodeContext.Provider value={{ eventCode, setEventCode }}>
      {children}
    </EventCodeContext.Provider>
  );
};

// Custom hook to use the EventCodeContext
export const useEventCode = () => {
  return useContext(EventCodeContext);
};
