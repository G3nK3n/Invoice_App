'use client'

import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import Image from 'next/image'
import { League_Spartan } from 'next/font/google';

import { useQuery } from '@apollo/client';
import { GET_HOME_INVOICE } from '../../graphql/queries';

import Nothing from '../Nothing/Nothing';


const leagueSpartan = League_Spartan({
    subsets: ['latin'],
    weight: ['100', '200', '400', '800'],
    display: 'swap',

})

interface HomeInvoice {
    InvoiceID: number,
    InvoicePaymentDue: Date,
    ClientName: string,
    StatusName: string,
    InvoiceTotal: number
}

interface HomeInvoiceProps {
    homeInvoice: HomeInvoice;  // ✅ Expect a single invoice, not an array
}

//This converts the date to this format: DD-MMM-YYYY. Ex: 18 Aug 2021
const formattedDate = (payementDueDate: Date) => {
    const formattedDate = new Date(payementDueDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    return formattedDate;
}

export default function Home({ homeInvoice }: HomeInvoiceProps) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', width: '750px', background: 'lightgrey' }}>
            <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '18px', color: "black", fontWeight: '400', display: 'inline-block' }}>
                <b>#{homeInvoice.InvoiceID}</b>
            </Typography>
            <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '14px', color: "#888EB0", fontWeight: '400', display: 'inline-block' }}>
                Due {formattedDate(homeInvoice.InvoicePaymentDue)}
            </Typography>
            <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '14px', color: "#888EB0", fontWeight: '400', display: 'inline-block' }}>
                {homeInvoice.ClientName}
            </Typography>
            <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '18px', color: "black", fontWeight: '400', display: 'inline-block' }}>
                <b>{"\u00A3" + parseFloat(Number(homeInvoice.InvoiceTotal).toFixed(2))}</b>
            </Typography>
            <Box>
                {homeInvoice.StatusName}
            </Box>
        </Box>
    )
}