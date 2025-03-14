import React, { useEffect } from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import Image from 'next/image'
import { League_Spartan } from 'next/font/google';

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

interface InvoiceInfoDetailProps {
    theInvoiceDetail: InvoiceDetail | null,
    onClose: Function
}

export default function EditModal({ theInvoiceDetail, onClose }: InvoiceInfoDetailProps) {

    return (
        //This is the actual modal background
        <Box sx={{ display: 'block', position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', background: '#00000099', zIndex: '1' }}>

            {/* This is the actual box for the form */}
            <Box sx={{ padding: '55px', position: 'fixed', background: 'white', width: '719px', height: '512px', top: '256px', left: '463px', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', borderRadius: '0px 20px 20px 0px', zIndex: '1' }}>

                <Box>
                    <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '18px', color: "black", fontWeight: '400', display: 'inline-block' }}>
                        <b>Edit <span style={{ color: 'grey' }}>#</span>{theInvoiceDetail?.InvoiceID}</b>
                    </Typography>
                </Box>

                <Box>
                    <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '16px', color: "#7C5DFA", fontWeight: '400', display: 'block' }}><b>Bill From</b></Typography>
                    <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '14px', color: "#7E88C3", fontWeight: '400', display: 'block' }}>Street Address</Typography>
                    <TextField
                        defaultValue={theInvoiceDetail?.ClientAddress}
                        id="outlined-basic"
                        label={false}
                        variant="outlined"
                        size='small'
                        fullWidth
                        slotProps={{
                            input: {
                                style: {
                                    fontWeight: 'bold'
                                }
                            }
                        }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '14px', color: "#7E88C3", fontWeight: '400', display: 'block' }}>City</Typography>
                            <TextField
                                defaultValue={theInvoiceDetail?.ClientCity}
                                sx={{ width: '180px' }}
                                id="outlined-basic"
                                label={false}
                                variant="outlined"
                                size='small'
                                slotProps={{
                                    input: {
                                        style: {
                                            fontWeight: 'bold'
                                        }
                                    }
                                }}
                            />
                        </Box>
                        <Box>
                            <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '14px', color: "#7E88C3", fontWeight: '400', display: 'block' }}>Post Code</Typography>
                            <TextField
                                defaultValue={theInvoiceDetail?.ClientPostalCode}
                                sx={{ width: '180px' }}
                                id="outlined-basic"
                                label={false}
                                variant="outlined"
                                size='small'
                                slotProps={{
                                    input: {
                                        style: {
                                            fontWeight: 'bold'
                                        }
                                    }
                                }}
                            />
                        </Box>
                        <Box>
                            <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '14px', color: "#7E88C3", fontWeight: '400', display: 'block' }}>Country</Typography>
                            <TextField
                                defaultValue={theInvoiceDetail?.ClientCountry}
                                sx={{ width: '180px' }}
                                id="outlined-basic"
                                label={false}
                                variant="outlined"
                                size='small'
                                slotProps={{
                                    input: {
                                        style: {
                                            fontWeight: 'bold'
                                        }
                                    }
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
                <Box>
                    <Button onClick={() => onClose()}>Close</Button>
                    <Button>Save Changes</Button>
                </Box>
            </Box>
        </Box>
    )
}