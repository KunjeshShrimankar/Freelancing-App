import React, { createContext, useContext, useState } from "react";

const ClientDashboardModalContext = createContext();

export function useClientDashboardModal() {
  return useContext(ClientDashboardModalContext);
}

export function ClientDashboardModalProvider({ children }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  return (
    <ClientDashboardModalContext.Provider value={{ showCreateModal, setShowCreateModal }}>
      {children}
    </ClientDashboardModalContext.Provider>
  );
}