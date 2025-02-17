'use client'

import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import Image from 'next/image'
import { League_Spartan } from 'next/font/google';



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
    homeInvoice: HomeInvoice;
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

const checkStatusBackgroundColor = (statusName: string) => {
    let backgroundColor: string = "";

    if (statusName === 'Paid') {
        backgroundColor = 'rgba(51, 214, 159, 0.2)';
    }
    else if (statusName === 'Pending') {
        backgroundColor = 'rgba(255, 143, 0, 0.2)';
    }
    else {
        backgroundColor = 'rgba(55, 59, 83,0.2)';
    }

    return backgroundColor;
}

const checkStatusFontColor = (statusName: string) => {
    let fontColor: string = "";

    if (statusName === 'Paid') {
        fontColor = '#33D69F'
    }
    else if (statusName === 'Pending') {
        fontColor = '#FF8F00'
    }
    else {
        fontColor = '#373B53'
    }

    return fontColor;
}

export default function Home({ homeInvoice }: HomeInvoiceProps) {
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: '140px 200px 200px 120px 104px 60px', alignItems: 'center', width: '850px', background: 'white', borderRadius: '10px', padding: '15px' }}>
            <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '18px', color: "black", fontWeight: '400', display: 'inline-flex', alignItems: 'center' }}>
                <b>#{homeInvoice.InvoiceID}</b>
            </Typography>
            <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '14px', color: "#888EB0", fontWeight: '400', display: 'inline-flex', alignItems: 'center' }}>
                Due {formattedDate(homeInvoice.InvoicePaymentDue)}
            </Typography>
            <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '14px', color: "#888EB0", fontWeight: '400', display: 'inline-flex', alignItems: 'center' }}>
                {homeInvoice.ClientName}
            </Typography>
            <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '18px', color: "black", fontWeight: '400', display: 'inline-flex', alignItems: 'center' }}>
                <b>{"\u00A3" + parseFloat(Number(homeInvoice.InvoiceTotal).toFixed(2))}</b>
            </Typography>
            <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ backgroundColor: checkStatusBackgroundColor(homeInvoice.StatusName), backdropFilter: 'blur(10px)', display: 'inline-block', width: '106px', padding: '10px' }}>
                    <Box sx={{ display: 'inline-block', backgroundColor: checkStatusFontColor(homeInvoice.StatusName), borderRadius: '50%', width: '8px', height: '8px', marginRight: '12px' }} />
                    <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '18px', color: checkStatusFontColor(homeInvoice.StatusName), fontWeight: '400', display: 'inline-flex', alignItems: 'center' }}>
                        <b>{homeInvoice.StatusName}</b>
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ display: 'inline-flex' }}>
                <Box sx={{ display: 'inline-block', width: '10px', cursor: 'pointer', marginLeft: '40px' }}>
                    <Image alt={'Arrow'} src={'/images/icon-arrow-right.svg'} width={4} height={8} />
                </Box>
            </Box>
        </Box>
    )
}