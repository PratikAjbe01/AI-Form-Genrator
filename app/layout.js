import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { UserProvider } from "./_context/UserContext";
import "./globals.css";
import Header from "./_components/Header";

import ClientWrapper from './_components/ClientWrapper'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI-Form-Builder",
  description: "Create Form In Seconds Using AI.",
  icons: {
    icon: "/favicon.ico", 
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <UserProvider>
    <html lang="en" >
  
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header/>
             <ClientWrapper>
        {children}
</ClientWrapper>
          
      </body>
    </html>
    </UserProvider>
    </ClerkProvider>
  );
}
