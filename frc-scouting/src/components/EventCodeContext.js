// EventCodeContext.js
import React, { createContext, useState, useContext } from 'react';

// Create a Context for the EventCode
const EventCodeContext = createContext();

// Custom hook to access the EventCode context
export const useEventCode = () => {
  return useContext(EventCodeContext);
};

// Provider component to wrap the app and provide the context values
export const EventCodeProvider = ({ children }) => {
  const [eventCode, setEventCode] = useState('');

  // Function to update the event code
  const updateEventCode = (newEventCode) => {
    setEventCode(newEventCode);
  };

  return (
    <EventCodeContext.Provider value={{ eventCode, updateEventCode }}>
      {children}
    </EventCodeContext.Provider>
  );
};
