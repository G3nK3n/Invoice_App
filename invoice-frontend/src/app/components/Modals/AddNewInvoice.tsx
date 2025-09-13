import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from '@mui/material';
import { League_Spartan } from 'next/font/google';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import Image from 'next/image';
import ConfirmationBox from './ConfirmationBox'

import { useDispatch } from 'react-redux';
import { updateInvoice, deleteItem, getInvoiceById, addNewInvoice, fetchInvoices } from '../../redux/invoiceSlice';
import { AppDispatch } from '../../redux/store';


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
    InvoicePaymentTerms: number,
    ClientID: number,
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
    onClose: Function,
}

export default function AddNewInvoices({ onClose }: InvoiceInfoDetailProps) {


    const [isOpen, setIsOpen] = useState(false)
    const [selectedItemDelete, setSelectedItemDelete] = useState<number | null>(null)
    const [itemsList, setItemsList] = useState<Items[]>([])
    const [isFieldsEmpty, setIsFieldEmpty] = useState<boolean>(true)
    const [itemNameErrors, setItemNameErrors] = useState<boolean[]>([])

    //For the forms
    const [clientInfo, setClientInfo] = useState({
        ClientID: 0,
        ClientName: '',
        ClientEmail: '',
        ClientAddress: '',
        ClientCity: '',
        ClientPostalCode: '',
        ClientCountry: ''
    });

    const [invoiceInfo, setInvoiceInfo] = useState({
        InvoiceDescription: '',
        InvoiceCreateDate: null as Date | null, //InvoiceCreateDate starts as null, But you intend to change it later to a Date
        InvoicePaymentDue: 0,
        InvoicePaymentTerms: 0,
        InvoiceTotal: 0,
        StatusName: '',
    })

    const dispatch = useDispatch<AppDispatch>();



    useEffect(() => {
        //FIX THIS


        if (itemsList.length > 0) {
            console.log("The initial state of isFieldEmpty is: ", isFieldsEmpty)

            const clientValid = clientInfo.ClientName === '';

            const invoiceValid = invoiceInfo.InvoicePaymentTerms == 0 || invoiceInfo.InvoiceCreateDate == null

            console.log("Passed here")
            const allValid = itemsList.some(item =>
                item.ItemName.trim() === '' ||
                item.ItemQuantity <= 0 ||
                item.ItemPrice <= 0
            )


            console.log('The value of clientValid is: ', clientValid)
            console.log('The value of invoicevalid is: ', invoiceValid)
            console.log('The value of AllValid is: ', allValid)

            //If these fields are empty or 0, set it to false
            setIsFieldEmpty(allValid || clientValid || invoiceValid)


            //setIsFieldEmpty(allValid)
        }


    }, [itemsList, clientInfo, invoiceInfo])



    useEffect(() => {
        setItemNameErrors(new Array(itemsList.length).fill(false))
    }, [itemsList.length])

    const handleConfirmBox = (itemID: number) => {

        setSelectedItemDelete(itemID)

        //Used the itemID instead of the 'selectedItemDelete' because it wont assign the new value until after function finishes.
        if (itemID === -1 || itemID === null) {
            alert('The item is not in the database yet')
        }
        else {
            setIsOpen(true)
        }

    }


    const closeConfirmBox = () => {
        setIsOpen(false)
    }

    const applyChanges = () => {

        //Recalculates the specific invoice total
        const newInvoiceTotal = itemsList.reduce((sum, item) => sum + item.ItemTotal, 0);

        //This will add the updated Items object in the theInvoiceDetail object before apllying the changes
        const addingNewInvoice = {
            ...clientInfo,
            ...invoiceInfo,
            InvoiceTotal: newInvoiceTotal,
            Items: itemsList
        }

        dispatch(addNewInvoice(addingNewInvoice))
            .unwrap()
            .then(() => {
                onClose(); // close modal after success
                alert("Invoice added successfully!");
            })
            .catch((err) => {
                console.error("Failed to add invoice:", err);
                alert("Failed to add invoice. Please try again.");
            });


    }

    const handleItemChanges = (index: number, field: keyof Items, value: string | number) => {
        const updatedItems = [...itemsList];
        const currentItem = { ...updatedItems[index] };

        (currentItem[field] as any) = value;

        if (field === 'ItemQuantity' || field === 'ItemPrice') {

            const isValidNumber = (value: any) => /^[0-9]*\.?[0-9]+$/.test(value);

            const qty = field === 'ItemQuantity' && isValidNumber(value) ? Number(value) : currentItem.ItemQuantity
            const price = field === 'ItemPrice' && isValidNumber(value) ? Number(value) : currentItem.ItemPrice
            currentItem.ItemTotal = parseFloat((qty * price).toFixed(2));
        }

        //This checks if there are any digits in the ItemName field
        if (field === 'ItemName') {
            const theErrors = [...itemNameErrors]
            theErrors[index] = /\d/.test(String(value));
            setItemNameErrors(theErrors)
        }


        updatedItems[index] = currentItem;

        setItemsList(updatedItems)
    }


    const addItem = () => {
        const newItem: Items = {
            ItemID: -1, // Temporary unique ID (replace with proper ID later if needed)
            ItemName: '',
            ItemPrice: 0,
            ItemQuantity: 0,
            ItemTotal: 0
        };

        setItemsList(prevItems => [...prevItems, newItem]);
    }

    return (
        //This is the actual modal background
        <Box sx={{ display: 'block', position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', background: '#00000099', zIndex: '1' }}>

            {/* This is the actual box for the form */}
            <Box sx={{ padding: '55px', position: 'fixed', background: 'white', maxHeight: '100vh', width: '719px', left: '103px', display: 'flex', flexDirection: 'column', borderRadius: '0px 20px 20px 0px', zIndex: '1', overflow: 'scroll' }}>

                {/* This is the Invoice Title */}
                <Box>
                    <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '18px', color: "black", fontWeight: '400', display: 'inline-block' }}>
                        <b>ADD NEW INVOICE</b>
                    </Typography>
                </Box>

                {/* This is the Bills From section */}
                <Box sx={{ mt: '50px' }}>
                    <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '16px', color: "#7C5DFA", fontWeight: '400', display: 'block' }}><b>Bill From</b></Typography>
                    <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '14px', color: "#7E88C3", fontWeight: '400', display: 'block', mt: '20px' }}>Street Address</Typography>
                    <TextField
                        value={"19 Union Terrace"}
                        id="outlined-basic"
                        label={false}
                        variant="outlined"
                        size='small'
                        fullWidth
                        slotProps={{
                            input: {
                                style: {
                                    fontWeight: 'bold',
                                    fontFamily: leagueSpartan.style.fontFamily
                                }
                            }
                        }}
                        sx={{ mt: '5px' }}
                        disabled={true}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '20px' }}>
                        <Box>
                            <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '14px', color: "#7E88C3", fontWeight: '400', display: 'block' }}>City</Typography>
                            <TextField
                                value={"London"}
                                sx={{ width: '180px', mt: '5px' }}
                                id="outlined-basic"
                                label={false}
                                variant="outlined"
                                size='small'
                                slotProps={{
                                    input: {
                                        style: {
                                            fontWeight: 'bold',
                                            fontFamily: leagueSpartan.style.fontFamily
                                        }
                                    }
                                }}
                                disabled={true}

                            />
                        </Box>
                        <Box>
                            <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '14px', color: "#7E88C3", fontWeight: '400', display: 'block' }}>Post Code</Typography>
                            <TextField
                                value={"E1 3EZ"}
                                sx={{ width: '180px', mt: '5px' }}
                                id="outlined-basic"
                                label={false}
                                variant="outlined"
                                size='small'
                                slotProps={{
                                    input: {
                                        style: {
                                            fontWeight: 'bold',
                                            fontFamily: leagueSpartan.style.fontFamily
                                        }
                                    }
                                }}
                                disabled={true}
                            />
                        </Box>
                        <Box>
                            <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '14px', color: "#7E88C3", fontWeight: '400', display: 'block' }}>Country</Typography>
                            <TextField
                                value={"United Kingdom"}
                                sx={{ width: '180px', mt: '5px' }}
                                id="outlined-basic"
                                label={false}
                                variant="outlined"
                                size='small'
                                slotProps={{
                                    input: {
                                        style: {
                                            fontWeight: 'bold',
                                            fontFamily: leagueSpartan.style.fontFamily
                                        }
                                    }
                                }}
                                disabled={true}
                            />
                        </Box>
                    </Box>
                </Box>

                {/* This is the Bills To section */}
                <Box>
                    <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '16px', color: "#7C5DFA", fontWeight: '400', display: 'block', mt: '50px' }}><b>Bill To</b></Typography>
                    <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '14px', color: "#7E88C3", fontWeight: '400', display: 'block', mt: '20px' }}>Client's Name</Typography>
                    <TextField
                        onChange={(e) => setClientInfo({ ...clientInfo, ClientName: e.target.value })}
                        id="outlined-basic"
                        label={false}
                        variant="outlined"
                        size='small'
                        fullWidth
                        slotProps={{
                            input: {
                                style: {
                                    fontWeight: 'bold',
                                    fontFamily: leagueSpartan.style.fontFamily
                                }
                            }
                        }}
                        sx={{ mt: '5px' }}
                    />

                    <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '14px', color: "#7E88C3", fontWeight: '400', display: 'block', mt: '20px' }}>Client's Email</Typography>
                    <TextField
                        onChange={(e) => setClientInfo({ ...clientInfo, ClientEmail: e.target.value })}
                        id="outlined-basic"
                        label={false}
                        variant="outlined"
                        size='small'
                        fullWidth
                        slotProps={{
                            input: {
                                style: {
                                    fontWeight: 'bold',
                                    fontFamily: leagueSpartan.style.fontFamily
                                }
                            }
                        }}
                        sx={{ mt: '5px' }}
                    />

                    <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '14px', color: "#7E88C3", fontWeight: '400', display: 'block', mt: '20px' }}>Street Address</Typography>
                    <TextField
                        onChange={(e) => setClientInfo({ ...clientInfo, ClientAddress: e.target.value })}
                        id="outlined-basic"
                        label={false}
                        variant="outlined"
                        size='small'
                        fullWidth
                        slotProps={{
                            input: {
                                style: {
                                    fontWeight: 'bold',
                                    fontFamily: leagueSpartan.style.fontFamily
                                }
                            }
                        }}
                        sx={{ mt: '5px' }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '20px' }}>
                        <Box>
                            <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '14px', color: "#7E88C3", fontWeight: '400', display: 'block' }}>City</Typography>
                            <TextField
                                onChange={(e) => setClientInfo({ ...clientInfo, ClientCity: e.target.value })}
                                sx={{ width: '180px', mt: '5px' }}
                                id="outlined-basic"
                                label={false}
                                variant="outlined"
                                size='small'
                                slotProps={{
                                    input: {
                                        style: {
                                            fontWeight: 'bold',
                                            fontFamily: leagueSpartan.style.fontFamily
                                        }
                                    }
                                }}

                            />
                        </Box>
                        <Box>
                            <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '14px', color: "#7E88C3", fontWeight: '400', display: 'block' }}>Post Code</Typography>
                            <TextField
                                onChange={(e) => setClientInfo({ ...clientInfo, ClientPostalCode: e.target.value })}
                                sx={{ width: '180px', mt: '5px' }}
                                id="outlined-basic"
                                label={false}
                                variant="outlined"
                                size='small'
                                slotProps={{
                                    input: {
                                        style: {
                                            fontWeight: 'bold',
                                            fontFamily: leagueSpartan.style.fontFamily
                                        }
                                    }
                                }}
                            />
                        </Box>
                        <Box>
                            <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '14px', color: "#7E88C3", fontWeight: '400', display: 'block' }}>Country</Typography>
                            <TextField
                                onChange={(e) => setClientInfo({ ...clientInfo, ClientCountry: e.target.value })}
                                sx={{ width: '180px', mt: '5px' }}
                                id="outlined-basic"
                                label={false}
                                variant="outlined"
                                size='small'
                                slotProps={{
                                    input: {
                                        style: {
                                            fontWeight: 'bold',
                                            fontFamily: leagueSpartan.style.fontFamily
                                        }
                                    }
                                }}
                            />
                        </Box>

                    </Box>

                </Box>


                {/* This is the Invoice and Project Description section */}
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '20px' }}>
                        <Box>
                            <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '14px', color: "#7E88C3", fontWeight: '400', display: 'block' }}>Invoice Date</Typography>

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label={false}
                                    // value={invoiceInfo.InvoiceCreateDate ? dayjs(invoiceInfo?.InvoiceCreateDate) : null}
                                    //Set the time to 12 to avoid UTC shifts if using the Date type
                                    onChange={(newValue) => setInvoiceInfo({ ...invoiceInfo, InvoiceCreateDate: newValue ? new Date(newValue.year(), newValue.month(), newValue.date(), 12) : null })}


                                />
                            </LocalizationProvider>
                        </Box>

                        <Box>
                            <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '14px', color: "#7E88C3", fontWeight: '400', display: 'block' }}>Payment Terms</Typography>
                            <TextField
                                onChange={(e) => setInvoiceInfo({ ...invoiceInfo, InvoicePaymentTerms: Number(e.target.value) })}
                                sx={{ mt: '5px', width: '290px' }}
                                id="outlined-basic"
                                label={false}
                                variant="outlined"
                                size='small'
                                slotProps={{
                                    input: {
                                        style: {
                                            fontWeight: 'bold',
                                            fontFamily: leagueSpartan.style.fontFamily
                                        }
                                    }
                                }}

                            />
                        </Box>
                    </Box>

                    <Box>
                        <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '14px', color: "#7E88C3", fontWeight: '400', display: 'block', mt: '20px' }}>Project Description</Typography>
                        <TextField
                            onChange={(e) => setInvoiceInfo({ ...invoiceInfo, InvoiceDescription: e.target.value })}
                            id="outlined-basic"
                            label={false}
                            variant="outlined"
                            size='small'
                            fullWidth
                            slotProps={{
                                input: {
                                    style: {
                                        fontWeight: 'bold',
                                        fontFamily: leagueSpartan.style.fontFamily
                                    }
                                }
                            }}
                            sx={{ mt: '5px' }}
                        />
                    </Box>
                </Box>

                {/* This is the Item List section */}
                <Box sx={{ marginTop: '35px' }}>
                    <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '18px', color: "#777F98", fontWeight: '400', display: 'block' }}><b>Item List</b></Typography>

                    <Box sx={{ mt: '15px', mb: '10px' }}>
                        <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '14px', color: "#7E88C3", fontWeight: '400', display: 'inline-block' }}>Item Name</Typography>
                        <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '14px', color: "#7E88C3", fontWeight: '400', display: 'inline-block', ml: '235px' }}>Qty.</Typography>
                        <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '14px', color: "#7E88C3", fontWeight: '400', display: 'inline-block', ml: '40px' }}>Price</Typography>
                        <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '14px', color: "#7E88C3", fontWeight: '400', display: 'inline-block', ml: '90px' }}>Total</Typography>
                    </Box>



                    {itemsList ?
                        itemsList.map((item, index) => {
                            return (
                                <Box key={index}>
                                    <TextField
                                        type='text'
                                        defaultValue={item.ItemName}
                                        sx={{ width: '276px', mt: '5px' }}
                                        id="outlined-basic"
                                        label={false}
                                        variant="outlined"
                                        size='small'
                                        slotProps={{
                                            input: {
                                                style: {
                                                    fontWeight: 'bold',
                                                    fontFamily: leagueSpartan.style.fontFamily
                                                }
                                            }
                                        }}
                                        onChange={(e) => handleItemChanges(index, 'ItemName', e.target.value)}
                                        helperText={itemNameErrors[index] ? "Numbers not allowed" : ""}
                                        error={itemNameErrors[index]}


                                    />

                                    <TextField
                                        defaultValue={item.ItemQuantity}
                                        type='number'
                                        sx={{ width: '46px', mt: '5px', ml: '20px' }}
                                        id="outlined-basic"
                                        label={false}
                                        variant="outlined"
                                        size='small'
                                        slotProps={{
                                            input: {
                                                style: {
                                                    fontWeight: 'bold',
                                                    fontFamily: leagueSpartan.style.fontFamily
                                                }
                                            }
                                        }}
                                        onChange={(e) => handleItemChanges(index, 'ItemQuantity', Number(e.target.value))}
                                    />

                                    <TextField
                                        defaultValue={parseFloat(Number(item.ItemPrice).toFixed(2))}
                                        sx={{ width: '100px', mt: '5px', ml: '20px' }}
                                        id="outlined-basic"
                                        label={false}
                                        variant="outlined"
                                        size='small'
                                        slotProps={{
                                            input: {
                                                style: {
                                                    fontWeight: 'bold',
                                                    fontFamily: leagueSpartan.style.fontFamily
                                                }
                                            }
                                        }}
                                        onChange={(e) => handleItemChanges(index, 'ItemPrice', Number(e.target.value))}
                                        type={'number'}
                                    />

                                    <TextField
                                        value={parseFloat(Number(item.ItemTotal).toFixed(2))}
                                        sx={{ width: '80px', mt: '5px', ml: '20px' }}
                                        id="outlined-basic"
                                        label={false}
                                        variant="outlined"
                                        size='small'
                                        disabled={true}
                                        slotProps={{
                                            input: {
                                                style: {
                                                    fontWeight: 'bold',
                                                    fontFamily: leagueSpartan.style.fontFamily
                                                }
                                            }
                                        }}
                                    />

                                    <Box onClick={() => handleConfirmBox(item.ItemID)} sx={{ display: 'inline-block', margin: '15px 0px 0px 20px', cursor: 'pointer' }}>
                                        <Image alt="Arrow" src="/images/icon-delete.svg" width={12} height={16} />
                                    </Box>
                                </Box>
                            )
                        })
                        :
                        null
                    }

                    <Button onClick={addItem} sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '13px', color: "#7E88C3", fontWeight: '400', display: 'block', width: '100%', mt: '10px' }}>
                        <b>+ Add New Item</b>
                    </Button>
                </Box>

                {/* This is the Buttons From section */}
                <Box sx={{ textAlign: 'right', mt: '15px' }}>
                    <Button
                        onClick={() => onClose()}
                        sx={{
                            fontFamily: leagueSpartan.style.fontFamily,
                            fontSize: '12px',
                            color: "#7E88C3",
                            fontWeight: '600',
                            background: '#F9FAFE',
                            padding: '10px 20px',
                            borderRadius: '15px',
                            textTransform: 'capitalize',
                            marginRight: '15px',
                            letterSpacing: '1px'
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isFieldsEmpty}
                        onClick={() => applyChanges()}
                        sx={{
                            fontFamily: leagueSpartan.style.fontFamily,
                            fontSize: '12px',
                            color: "white",
                            fontWeight: '500',
                            background: '#7C5DFA',
                            padding: '10px 20px',
                            borderRadius: '15px',
                            textTransform: 'capitalize',
                            letterSpacing: '1px'
                        }}
                    >
                        Save Changes
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}