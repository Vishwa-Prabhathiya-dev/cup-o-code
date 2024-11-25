"use client";

import { SessionProvider } from "next-auth/react";
import {ReactNode} from 'react' 

const SessionProviderWrapper: React.FC<{ sessionData: object, children: ReactNode }> = ({ sessionData, children }) => {
  return <SessionProvider session={sessionData}>{children}</SessionProvider>;
};

export default SessionProviderWrapper;