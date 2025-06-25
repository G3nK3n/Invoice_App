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
import { updateInvoice, deleteItem, getInvoiceById } from '../../redux/invoiceSlice';
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
    theInvoiceDetail: InvoiceDetail | null,
    onClose: Function,
    refetchInvoice: Function
}

export default function EditModal({ theInvoiceDetail, onClose, refetchInvoice }: InvoiceInfoDetailProps) {


    const [isOpen, setIsOpen] = useState(false)
    const [selectedItemDelete, setSelectedItemDelete] = useState<number | null>(null)
    const [itemsList, setItemsList] = useState<Items[]>(theInvoiceDetail?.Items || [])
    const [isFieldsEmpty, setIsFieldEmpty] = useState<boolean>(false)
    const [itemNameErrors, setItemNameErrors] = useState<boolean[]>([])

    //For the forms
    const [clientInfo, setClientInfo] = useState({
        ClientID: theInvoiceDetail?.ClientID || 0,
        ClientName: theInvoiceDetail?.ClientName || '',
        ClientEmail: theInvoiceDetail?.ClientEmail || '',
        ClientAddress: theInvoiceDetail?.ClientAddress || '',
        ClientCity: theInvoiceDetail?.ClientCity || '',
        ClientPostalCode: theInvoiceDetail?.ClientPostalCode || '',
        ClientCountry: theInvoiceDetail?.ClientCountry || ''
    });

    const [invoiceInfo, setInvoiceInfo] = useState({
        InvoiceDescription: theInvoiceDetail?.InvoiceDescription,
        InvoiceCreateDate: theInvoiceDetail?.InvoiceCreateDate || null,
        InvoicePaymentDue: theInvoiceDetail?.InvoicePaymentDue,
        InvoicePaymentTerms: theInvoiceDetail?.InvoicePaymentTerms || 0,
        InvoiceTotal: theInvoiceDetail?.InvoiceTotal,
        StatusName: theInvoiceDetail?.StatusName,
    })

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const allValid = itemsList.some(item =>
            item.ItemName.trim() === '' ||
            item.ItemQuantity <= 0 ||
            item.ItemPrice <= 0
        )
        setIsFieldEmpty(allValid)
    }, [itemsList])

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

    //Made a try-catch and async to wait for deletion to be done, then refetches the Invoice. Safer this way
    const handleDelete = async () => {
        try {
            if (selectedItemDelete !== null) {
                await dispatch(deleteItem(selectedItemDelete))
                alert('item deleted! Item number is: ' + selectedItemDelete)

                const updatedItems = itemsList.filter(it => it.ItemID !== selectedItemDelete);
                //Calculates the new total of the item list
                const newInvoiceTotal = updatedItems.reduce((sum, item) => sum + item.ItemTotal, 0);

                //This sets the itemList again by re-rendering the list and filter out the deleted one, which now shows the updated list
                setItemsList(updatedItems)

                //The reason why there is ({...}) is because its returning an object, not a function
                setInvoiceInfo(previousInfo => ({
                    ...previousInfo,
                    InvoiceTotal: newInvoiceTotal
                }))


                //This updates the invoice page with updated information
                const updatedInvoice = {
                    ...theInvoiceDetail,
                    ...clientInfo,
                    ...invoiceInfo,
                    Items: updatedItems,
                    InvoiceTotal: newInvoiceTotal
                }

                //Calls dispatch to update invoice 
                await dispatch(updateInvoice(updatedInvoice))

                //This one refetches the updated info to show new information
                await refetchInvoice()


                closeConfirmBox()
            }

        } catch (error) {
            console.error(error);
            alert('Delete failed – please try again');
        }

    }

    const closeConfirmBox = () => {
        setIsOpen(false)
    }

    const applyChanges = () => {

        //Recalculates the specific invoice total
        const newInvoiceTotal = itemsList.reduce((sum, item) => sum + item.ItemTotal, 0);

        //This will add the updated Items object in the theInvoiceDetail object before apllying the changes
        const updatedInvoice = {
            ...theInvoiceDetail,
            ...clientInfo,
            ...invoiceInfo,
            InvoiceTotal: newInvoiceTotal,
            Items: itemsList
        }

        dispatch(updateInvoice(updatedInvoice))
        onClose() //Closes the EditModal
        alert("Changes has been applied")
        refetchInvoice()
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
                        <b>Edit <span style={{ color: 'grey' }}>#</span>{theInvoiceDetail?.InvoiceID}</b>
                    </Typography>
                </Box>

                {/* This is the Bills From section */}
                <Box sx={{ mt: '50px' }}>
                    <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '16px', color: "#7C5DFA", fontWeight: '400', display: 'block' }}><b>Bill From</b></Typography>
                    <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '14px', color: "#7E88C3", fontWeight: '400', display: 'block', mt: '20px' }}>Street Address</Typography>
                    <TextField
                        value={theInvoiceDetail?.BillsFromAddress}
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
                                defaultValue={theInvoiceDetail?.BillsFromCity}
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
                                defaultValue={theInvoiceDetail?.BillsFromPostalCode}
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
                                defaultValue={theInvoiceDetail?.BillsFromCountry}
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
                        value={clientInfo.ClientName}
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
                        value={clientInfo.ClientEmail}
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
                        value={clientInfo.ClientAddress}
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
                                value={clientInfo.ClientCity}
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
                                value={clientInfo.ClientPostalCode}
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
                                value={clientInfo.ClientCountry}
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
                                    value={invoiceInfo.InvoiceCreateDate ? dayjs(invoiceInfo?.InvoiceCreateDate) : null}
                                    //Set the time to 12 to avoid UTC shifts if using the Date type
                                    onChange={(newValue) => setInvoiceInfo({ ...invoiceInfo, InvoiceCreateDate: newValue ? new Date(newValue.year(), newValue.month(), newValue.date(), 12) : null })}


                                />
                            </LocalizationProvider>
                        </Box>

                        <Box>
                            <Typography sx={{ fontFamily: leagueSpartan.style.fontFamily, fontSize: '14px', color: "#7E88C3", fontWeight: '400', display: 'block' }}>Payment Terms</Typography>
                            <TextField
                                value={invoiceInfo.InvoicePaymentTerms}
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
                            value={invoiceInfo.InvoiceDescription}
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

            {isOpen ?
                <Box>
                    <ConfirmationBox selectedItemDelete={selectedItemDelete} isOpen={isOpen} onCancel={closeConfirmBox} onConfirm={handleDelete} />
                </Box>
                : null
            }
        </Box>
    )
}