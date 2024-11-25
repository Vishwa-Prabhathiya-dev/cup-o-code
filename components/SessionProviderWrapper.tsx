"use client";

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import {ReactNode} from 'react' 

const SessionProviderWrapper: React.FC<{ sessionData: Session | null, children: ReactNode }> = ({ sessionData, children }) => {
  return <SessionProvider session={sessionData}>{children}</SessionProvider>;
};

export default SessionProviderWrapper;