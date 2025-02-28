'use client'

import React, { useEffect } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import Image from 'next/image'
import { League_Spartan } from 'next/font/google';

import { useQuery } from '@apollo/client';

import { useRouter, usePathname } from 'next/navigation';


// import { useDispatch, useSelector } from "react-redux";
// import { fetchInvoices } from "../redux/invoiceSlice";
// import { RootState, AppDispatch } from "../redux/store";


const leagueSpartan = League_Spartan({
    subsets: ['latin'],
    weight: ['100', '200', '400', '800'],
    display: 'swap',

})

export default function InvoiceInfo() {

    const router = useRouter();

    return (
        <Box sx={{ height: '100vh', overflowY: 'scroll' }}>
            <Container maxWidth={'md'}>
                <Box
                    onClick={() => router.push('/Home')}
                    sx={{
                        display: 'flex',  // Align items horizontally
                        alignItems: 'center', // Align them vertically in the center
                        cursor: 'pointer',
                        gap: 3, // Adds spacing between the arrow and text
                        mt: '40px',
                        width: '90px'
                    }}
                >
                    <Image alt="Arrow" src="/images/icon-arrow-left.svg" width={8} height={8} />
                    <Typography
                        sx={{
                            fontFamily: leagueSpartan.style.fontFamily,
                            fontSize: '15px',
                            color: "black",
                            fontWeight: 800,
                            paddingTop: '2px'
                        }}
                    >
                        Go Back
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px', mt: '50px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '850px', background: 'white', borderRadius: '10px', padding: '15px' }}>
                        <Box sx={{ display: 'inline-block' }}>
                            <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '14px', color: "#888EB0", fontWeight: '400', display: 'inline-flex', alignItems: 'center' }}>
                                Status
                            </Typography>
                            <Box sx={{ display: 'inline-block' }}>
                                <Box sx={{ backgroundColor: 'lightgreen', backdropFilter: 'blur(10px)', display: 'inline-block', width: '106px', padding: '10px' }}>
                                    <Box sx={{ display: 'inline-block', backgroundColor: 'green', borderRadius: '50%', width: '8px', height: '8px', marginRight: '12px' }} />
                                    <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '18px', color: 'green', fontWeight: '400', display: 'inline-flex', alignItems: 'center' }}>
                                        <b>Test</b>
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'inline-block' }}>
                            <Button sx={{ fontFamily: leagueSpartan.style.fontFamily, background: 'rgb(126, 136, 195, 0.1)', color: '#7E88C3' }}>
                                Edit
                            </Button>
                            <Button sx={{ fontFamily: leagueSpartan.style.fontFamily, background: '#EC5757', color: 'white' }}>
                                Delete
                            </Button>
                            <Button sx={{ fontFamily: leagueSpartan.style.fontFamily, background: '#7C5DFA', color: 'white' }} >
                                Mark as Paid
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Container >
        </Box >
    );
}