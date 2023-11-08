// src/app/layout.tsx
import React from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import './globals.css';

export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <>
            <Head>
                <title>禮品訂製所 Gift For You</title>
                <meta name='description' content='親手繪製您獨一無二的紀念品' />
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </>
    );
}
