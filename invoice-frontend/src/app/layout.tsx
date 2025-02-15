'use client'

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Box } from "@mui/material";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import Sidebar from "./components/Sidebar/Sidebar";

import { ApolloProvider } from '@apollo/client';
import client from './lib/apolloClient';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Box sx={{ display: 'flex', backgroundColor: '#F8F8FB', minHeight: '100vh' }}>
          <AppRouterCacheProvider>
            <ApolloProvider client={client}>
              <Sidebar />
              <Box sx={{ flexGrow: 1 }}>{children}</Box>
            </ApolloProvider>
          </AppRouterCacheProvider>
        </Box>
      </body>
    </html>
  );
}
