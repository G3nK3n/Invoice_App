'use client'

import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import Image from 'next/image'
import { League_Spartan } from 'next/font/google';

import { useRouter, useSearchParams } from 'next/navigation';

import { useDispatch, useSelector } from "react-redux";
import { getInvoiceById } from "../../redux/invoiceSlice";
import { RootState, AppDispatch } from "../../redux/store";

import InvoiceInfoDetails from './InvoiceInfoDetails/InvoiceInfoDetails';
import EditModal from '../../components/Modals/EditModal';

const leagueSpartan = League_Spartan({
    subsets: ['latin'],
    weight: ['100', '200', '400', '800'],
    display: 'swap',

})

interface Items {
    ItemID: number,
    ItemName: string,
    ItemPrice: number,
    ItemQuantity: number,
    ItemTotal: number
}

interface InvoiceDetail {
    InvoiceID: number,
    InvoiceDescription: string,
    InvoiceCreateDate: Date,
    InvoicePaymentDue: Date,
    ClientName: string,
    ClientAddress: string,
    ClientCity: string,
    ClientPostalCode: string,
    ClientCountry: string,
    ClientEmail: string,
    BillsFromAddress: string,
    BillsFromCity: string,
    BillsFromPostalCode: string,
    BillsFromCountry: string,
    InvoiceTotal: number,
    StatusName: string,
    Items: Items[]
}

export default function InvoiceInfo() {



    const router = useRouter();

    const searchParams = useSearchParams();
    //This gets the id value in the url
    const theInvoiceID = Number(searchParams.get('id'));

    const dispatch = useDispatch<AppDispatch>();
    const { selectedInvoice, error } = useSelector((state: RootState) => state.invoices);

    const [invoiceDetail, setInvoiceDetail] = useState<InvoiceDetail | null>(selectedInvoice)
    const [editInvoice, setEditInvoice] = useState<boolean>(false)


    //This useEffect calls the dispatch with the provided ID to get the information of the Invoice
    useEffect(() => {
        if (theInvoiceID) {
            dispatch(getInvoiceById(theInvoiceID));
        }

        if (error) {
            console.log("The error message is: ", error)
        }
    }, [theInvoiceID, dispatch])

    //This useEffect checks if the selectedInvoice exist after the dispatch, then set the state with the Invoice
    useEffect(() => {
        if (selectedInvoice) {
            setInvoiceDetail(selectedInvoice)
        }
    }, [selectedInvoice])



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
                            <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '14px', color: "#888EB0", fontWeight: '400', display: 'inline-flex', alignItems: 'center', marginLeft: '15px' }}>
                                Status
                            </Typography>
                            <Box sx={{ display: 'inline-block', marginLeft: '25px', textAlign: 'center' }}>
                                <Box sx={{ backgroundColor: 'lightgreen', backdropFilter: 'blur(10px)', display: 'inline-block', width: '106px', padding: '10px', borderRadius: '7px' }}>
                                    <Box sx={{ display: 'inline-block', backgroundColor: 'green', borderRadius: '50%', width: '8px', height: '8px', marginRight: '12px' }} />
                                    <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '18px', color: 'green', fontWeight: '400', display: 'inline-flex', alignItems: 'center' }}>
                                        <b>Test</b>
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'inline-block' }}>
                            <Button onClick={() => setEditInvoice(!editInvoice)} sx={{ fontFamily: leagueSpartan.style.fontFamily, background: 'rgb(126, 136, 195, 0.1)', color: '#7E88C3', padding: '10px', fontSize: '16px', textTransform: 'capitalize', borderRadius: '20px', width: '75px', marginRight: '15px' }}>
                                Edit
                            </Button>
                            <Button sx={{ fontFamily: leagueSpartan.style.fontFamily, background: '#EC5757', color: 'white', padding: '10px', fontSize: '16px', textTransform: 'capitalize', borderRadius: '20px', width: '95px', marginRight: '15px' }}>
                                Delete
                            </Button>
                            <Button sx={{ fontFamily: leagueSpartan.style.fontFamily, background: '#7C5DFA', color: 'white', padding: '10px', fontSize: '16px', textTransform: 'capitalize', borderRadius: '20px', width: '145px', marginRight: '15px' }} >
                                Mark as Paid
                            </Button>
                        </Box>
                    </Box>
                </Box>
                <Box>
                    <InvoiceInfoDetails theInvoiceDetail={invoiceDetail} />
                </Box>
                {
                    editInvoice && <EditModal theInvoiceDetail={invoiceDetail} onClose={() => setEditInvoice(!editInvoice)} />
                }
            </Container >
        </Box >
    );
}