'use client'

import React from 'react';
import { Box, Button, Container, CssBaseline, Typography } from '@mui/material';
import Image from 'next/image'
import { League_Spartan } from 'next/font/google';

import { useQuery } from '@apollo/client';
import { GET_ALL_INVOICES } from '../../graphql/queries';
import client from '../../lib/apolloClient'



const leagueSpartan = League_Spartan({
    subsets: ['latin'],
    weight: ['100', '200', '400', '800'],
    display: 'swap',

})

export default function Nothing() {
    return (
        <Box sx={{ mt: '150px' }}>
            <Box>
                <Image alt={'Empty'} src={'/images/illustration-empty.svg'} width={241} height={200} />
            </Box>
            <Box sx={{ mt: '25px' }}>
                <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '20px', fontWeight: '800', color: "#201F24", display: 'inline-block' }}><b>There is nothing here</b></Typography> <br />
                <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '14px', color: "#888EB0", fontWeight: '400', display: 'inline-block', mt: '10px' }}>Create an invoice by clicking the <b>New Invoice</b> button and get started</Typography>
            </Box>
        </Box>
    )
}
