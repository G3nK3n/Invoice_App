import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import Image from 'next/image'
import { League_Spartan } from 'next/font/google';

import EditModal from '../../../components/Modals/EditModal';

const leagueSpartan = League_Spartan({
    subsets: ['latin'],
    weight: ['100', '200', '400', '800'],
    display: 'swap',

})

const cssStyles = {
    textSmall: {
        fontFamily: leagueSpartan.style.fontFamily,
        fontSize: '14px',
        color: "#888EB0",
        fontWeight: '400',
        display: 'inline-block',
    },
    textMedium: {
        fontFamily: leagueSpartan.style.fontFamily,
        fontSize: '16px',
        fontWeight: '800',
        color: "#201F24",
        display: 'inline-block',
    },
    textMediumMargin: {
        fontFamily: leagueSpartan.style.fontFamily,
        fontSize: '16px',
        fontWeight: '800',
        color: "#201F24",
        display: 'inline-block',
        mt: '10px'
    },
    boxWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    gridWrapper: {
        display: 'grid',
        gridTemplateColumns: '201px 202px 202px 167px',
        textAlign: 'center',
    },
    amountDueBox: {
        display: 'flex',
        justifyContent: 'space-evenly',
        backgroundColor: '#373B53',
        padding: '35px 49px',
        mt: '40px',
    },
    amountDueText: {
        fontFamily: leagueSpartan.style.fontFamily,
        fontSize: '18px',
        fontWeight: '800',
        color: "white",
        display: 'inline-block',
        ml: '400px',
    }
};

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

interface InvoiceInfoDetailProps {
    theInvoiceDetail: InvoiceDetail | null
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



export default function InvoiceInfoDetails({ theInvoiceDetail }: InvoiceInfoDetailProps) {


    //console.log("The invoice detail is: ", theInvoiceDetail)

    return (
        <Box sx={{ background: 'white', mt: '15px', padding: '40px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                    <p style={{ display: 'inline-block', fontSize: '16px', fontFamily: leagueSpartan.style.fontFamily, color: "#888EB0" }}>#</p>
                    <Typography sx={cssStyles.textMedium}>{theInvoiceDetail?.InvoiceID}</Typography> <br />
                    <Typography sx={cssStyles.textSmall}>{theInvoiceDetail?.InvoiceDescription}</Typography>
                </Box>
                <Box>
                    <Typography sx={cssStyles.textSmall}>{theInvoiceDetail?.BillsFromAddress}</Typography> <br />
                    <Typography sx={cssStyles.textSmall}>{theInvoiceDetail?.BillsFromCity}</Typography> <br />
                    <Typography sx={cssStyles.textSmall}>{theInvoiceDetail?.BillsFromPostalCode}</Typography> <br />
                    <Typography sx={cssStyles.textSmall}>{theInvoiceDetail?.BillsFromCountry}</Typography>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '20px' }}>
                <Box>
                    <Box>
                        <Typography sx={cssStyles.textSmall}>Invoice Date</Typography> <br />
                        <Typography sx={cssStyles.textMediumMargin}>{formattedDate(theInvoiceDetail?.InvoiceCreateDate ?? new Date())}</Typography>
                    </Box>
                    <Box sx={{ mt: '15px' }}>
                        <Typography sx={cssStyles.textSmall}>Payment Due</Typography> <br />
                        <Typography sx={cssStyles.textMediumMargin}>{formattedDate(theInvoiceDetail?.InvoicePaymentDue ?? new Date())}</Typography>
                    </Box>
                </Box>
                <Box>
                    <Typography sx={cssStyles.textSmall}>Bill To</Typography> <br />
                    <Typography sx={cssStyles.textMediumMargin}>{theInvoiceDetail?.ClientName}</Typography> <br />
                    <Typography sx={cssStyles.textSmall}>{theInvoiceDetail?.ClientAddress}</Typography> <br />
                    <Typography sx={cssStyles.textSmall}>{theInvoiceDetail?.ClientCity}</Typography> <br />
                    <Typography sx={cssStyles.textSmall}>{theInvoiceDetail?.ClientPostalCode}</Typography> <br />
                    <Typography sx={cssStyles.textSmall}>{theInvoiceDetail?.ClientCountry}</Typography>
                </Box>
                <Box>
                    <Typography sx={cssStyles.textSmall}>Sent to</Typography> <br />
                    <Typography sx={{ ...cssStyles.textMediumMargin, overflowWrap: 'break-word' }}>{theInvoiceDetail?.ClientEmail}</Typography>
                </Box>
            </Box>
            <Box sx={{ mt: '80px', backgroundColor: '#F8F8FB', pt: '20px' }}>
                <Box sx={cssStyles.gridWrapper}>
                    <Typography sx={cssStyles.textSmall}>Item name</Typography>
                    <Typography sx={cssStyles.textSmall}>QTY.</Typography>
                    <Typography sx={cssStyles.textSmall}>Price</Typography>
                    <Typography sx={cssStyles.textSmall}>Total</Typography>
                </Box>
                <Box>
                    {theInvoiceDetail?.Items ?
                        theInvoiceDetail.Items.map((item, index) => {
                            return (
                                <Box sx={{ display: 'grid', gridTemplateColumns: '201px 202px 202px 167px', textAlign: 'center', mt: '20px' }} key={index}>
                                    <Typography sx={cssStyles.textMedium}>{item.ItemName}</Typography>
                                    <Typography sx={cssStyles.textSmall}><b>{item.ItemQuantity}</b></Typography>
                                    <Typography sx={cssStyles.textSmall}><b>£ {parseFloat(Number(item.ItemPrice).toFixed(2))}</b></Typography>
                                    <Typography sx={cssStyles.textMedium}>£ {parseFloat(Number(item.ItemTotal).toFixed(2))}</Typography>
                                </Box>
                            )
                        })
                        :
                        null
                    }
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-evenly', backgroundColor: '#373B53', padding: '35px 49px', mt: '40px' }}>
                    <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '14px', color: "white", fontWeight: '400', display: 'inline-block' }}>Amount Due</Typography>
                    <Typography sx={cssStyles.amountDueText}>£ {parseFloat(Number(theInvoiceDetail?.InvoiceTotal).toFixed(2))}</Typography>
                </Box>



            </Box>
        </Box>
    )
}