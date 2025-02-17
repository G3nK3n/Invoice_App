'use client'

import React, { useEffect } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import Image from 'next/image'
import { League_Spartan } from 'next/font/google';

import { useQuery } from '@apollo/client';

import Nothing from './Nothing/Nothing';
import Invoice from './Invoice/Invoice';

import { useDispatch, useSelector } from "react-redux";
import { fetchInvoices } from "../redux/invoiceSlice";
import { RootState, AppDispatch } from "../redux/store";


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


export default function Home() {



    const dispatch = useDispatch<AppDispatch>();
    const { invoices, loading, error } = useSelector((state: RootState) => state.invoices);

    useEffect(() => { dispatch(fetchInvoices()); }, [dispatch]);

    return (
        <Box sx={{ height: '100vh', overflowY: 'scroll' }}>
            <Container maxWidth={'md'}>
                <Box sx={{ pt: '40px', display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ width: '150px' }}>
                        <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '34px', fontWeight: '800', color: "#201F24", display: 'inline-block' }}><b>Invoices</b></Typography>
                        <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '14px', color: "#888EB0", fontWeight: '400', display: 'inline-block' }}>There are 7 total invoices</Typography>
                    </Box>

                    <Box sx={{ paddingTop: '27px', paddingLeft: '340px' }}>
                        <Typography sx={{ cursor: 'pointer', fontFamily: leagueSpartan.style.fontFamily, fontSize: '14px', color: "black", fontWeight: '400', display: 'inline-block' }}><b>Filter by status</b>
                            <Image style={{ marginLeft: '15px' }} alt={'Logo'} src={'/images/icon-arrow-down.svg'} width={8} height={4} />
                        </Typography>
                    </Box>

                    <Button sx={{ display: 'flex', justifyContent: 'space-between', width: '150px', height: '48px', fontSize: '14px', fontFamily: leagueSpartan.style.fontFamily, textTransform: 'capitalize', backgroundColor: '#7C5DFA', color: 'white', padding: '15px 10px', borderRadius: '25px', marginTop: '15px' }}>
                        <Box sx={{ width: '32px', height: '32px', backgroundColor: 'white', display: 'flex', justifyContent: 'center', paddingTop: '11px', borderRadius: '25px' }}>
                            <Image alt={'Logo'} src={'/images/icon-plus.svg'} width={10} height={10} />
                        </Box>
                        <b>New Invoice</b>
                    </Button>
                </Box>

                {invoices ?
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', mt: '50px' }}>
                        {invoices.map((invoice: HomeInvoice) => {
                            return (
                                <Box key={invoice.InvoiceID}>
                                    <Invoice homeInvoice={invoice} />
                                </Box>

                            )
                        })}

                    </Box>
                    :
                    <Box sx={{ textAlign: 'center' }}>
                        <Nothing />
                    </Box>
                }


            </Container>

        </Box>
    )
}