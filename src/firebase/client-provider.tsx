// src/firebase/client-provider.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';

const FirebaseContext = createContext({});

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  return (
    <FirebaseContext.Provider value={{}}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  return useContext(FirebaseContext);
}