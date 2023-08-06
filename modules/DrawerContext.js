import React, { createContext, useContext } from 'react';

const DrawerContext = createContext();

export const useDrawer = () => {
  return useContext(DrawerContext);
};

export const DrawerProvider = ({ children, value }) => {
  return (
    <DrawerContext.Provider value={value}>
      {children}
    </DrawerContext.Provider>
  );
};