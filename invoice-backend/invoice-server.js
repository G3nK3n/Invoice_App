const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { GraphQLScalarType, Kind } = require('graphql');
const sql = require('mssql');

var config = {
    user: 'Ken',
    password: '1234',
    server: 'DESKTOP-BRJAM44\\SQLEXPRESS',
    database: 'Invoice_App_Database',
    options: {
        trustedConnection: true,
        trustServerCertificate: true
    }
};

const app = express();

app.use(cors());

// ✅ Define a custom Date scalar type
const DateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Custom Date Scalar Type',
    serialize(value) {
        return value instanceof Date ? value.toISOString() : null; // Ensure valid Date
    },
    parseValue(value) {
        return new Date(value); // Convert client input to a Date object
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return new Date(ast.value);
        }
        return null;
    }
});

// ✅ Define GraphQL Schema (Make sure to include `scalar Date`)
const schema = buildSchema(`
    scalar Date

    type Item {
        ItemID: Int
        ItemName: String
        ItemPrice: Float
        ItemQuantity: Int
        ItemTotal: Float
    }

    type Invoice {
        InvoiceID: Int
        InvoiceCreateDate: Date
        InvoicePaymentDue: Date
        InvoiceDescription: String
        InvoicePaymentTerms: Int
        StatusID: Int
        BillsFromID: Int
        InvoiceTotal: Float
        BillsFromAddress: String
        BillsFromCity: String
        BillsFromPostalCode: String
        BillsFromCountry: String
        ClientID: Int
        ClientName: String
        ClientEmail: String
        ClientAddress: String
        ClientCity: String
        ClientPostalCode: String
        ClientCountry: String
        StatusName: String
        Items: [Item]

    }

    type HomeInvoice {
        InvoiceID: Int
        InvoicePaymentDue: Date
        ClientName: String
        StatusName: String
        InvoiceTotal: Float
    }

    type Query {
        getAllInvoices: [Invoice]
        getHomeInvoices: [HomeInvoice]
        getInvoiceById(id: Int!): Invoice
    }

    input ItemsInput {
        ItemID: Int,
        ItemName: String,
        ItemPrice: Float,
        ItemQuantity: Int,
        ItemTotal: Float
    }

    input InvoiceDetailInput {
        InvoiceID: Int,
        InvoiceDescription: String,
        InvoiceCreateDate: Date,
        InvoicePaymentDue: Date,
        InvoicePaymentTerms: Int,
        ClientID: Int,
        ClientName: String,
        ClientAddress: String,
        ClientCity: String,
        ClientPostalCode: String,
        ClientCountry: String,
        ClientEmail: String,
        BillsFromAddress: String,
        BillsFromCity: String,
        BillsFromPostalCode: String,
        BillsFromCountry: String,
        InvoiceTotal: Float,
        StatusName: String,
        Items: [ItemsInput]
    }

    type Mutation {
        updateInvoice(invoice: InvoiceDetailInput!): Invoice
        deleteItem(item_id: Int!) : String
        markInvoiceAsPaid(invoice_id: Int!) : String
        addNewInvoice(invoice: InvoiceDetailInput!) : Invoice
    }
`);
``

const root = {
    Date: DateScalar, // Register custom Date scalar
    getAllInvoices: async () => {
        try {
            const pool = await sql.connect(config);
            const result = await pool.request()
                .query('SELECT ' +
                    'i.invoice_id, i.invoice_create_date, i.invoice_payment_due, i.invoice_description, i.invoice_payment_terms, i.status_id, i.billsfrom_id, i.invoice_total, ' +
                    'c.client_id AS client_id, c.client_name, c.client_email, c.client_address, c.client_city, c.client_postal_code, c.client_country, s.status_name, ' +
                    'o.item_id, it.item_name, it.item_price, it.item_quantity, it.item_total ' +
                    'FROM dbo.Invoice i ' +
                    'INNER JOIN dbo.Client c ON i.client_id = c.client_id ' +
                    'INNER JOIN dbo.Invoice_Status s ON i.status_id = s.status_id ' +
                    'INNER JOIN dbo.Orders o ON i.invoice_id = o.invoice_id ' +
                    'INNER JOIN dbo.Items it ON o.item_id = it.item_id')

            return result.recordset.map(invoice => ({
                InvoiceID: invoice.invoice_id,
                InvoiceCreateDate: invoice.invoice_create_date ? new Date(invoice.invoice_create_date) : null,
                InvoicePaymentDue: invoice.invoice_payment_due ? new Date(invoice.invoice_payment_due) : null,
                InvoiceDescription: invoice.invoice_description,
                InvoicePaymentTerms: invoice.invoice_payment_terms,
                StatusID: invoice.status_id,
                BillsFromID: invoice.billsfrom_id,
                InvoiceTotal: invoice.invoice_total,
                ClientID: invoice.client_id,
                ClientName: invoice.client_name,
                ClientEmail: invoice.client_email,
                ClientAddress: invoice.client_address,
                ClientCity: invoice.client_city,
                ClientPostalCode: invoice.client_postal_code,
                ClientCountry: invoice.client_country,
                ClientName: invoice.client_name,
                StatusName: invoice.status_name,
                ItemID: invoice.item_id,
                ItemName: invoice.item_name,
                ItemPrice: invoice.item_price,
                ItemQuantity: invoice.item_quantity,
                ItemTotal: invoice.item_total
            }));
        } catch (err) {
            console.error('SQL error', err);
            throw new Error('Error retrieving data from database');
        }
    },


    // getInvoiceById: async ({ id }) => {
    //     try {
    //         const pool = await sql.connect(config);
    //         const result = await pool.request()
    //             .input('invoiceId', sql.Int, id) // Bind parameter securely
    //             .query(`
    //                 SELECT 
    //                     i.invoice_id, i.invoice_create_date, i.invoice_payment_due, i.invoice_description, 
    //                     i.invoice_payment_terms, i.status_id, i.billsfrom_id, i.invoice_total,
    //                     b.billsfrom_address, b.billsfrom_city, b.billsfrom_postal_code, b.billsfrom_country,  
    //                     c.client_id, c.client_name, c.client_email, c.client_address, c.client_city, 
    //                     c.client_postal_code, c.client_country, s.status_name, 
    //                     o.item_id, it.item_name, it.item_price, it.item_quantity, it.item_total 
    //                 FROM dbo.Invoice i
    //                 INNER JOIN dbo.Client c ON i.client_id = c.client_id
    //                 INNER JOIN dbo.Invoice_Status s ON i.status_id = s.status_id
    //                 INNER JOIN dbo.Orders o ON i.invoice_id = o.invoice_id
    //                 INNER JOIN dbo.Items it ON o.item_id = it.item_id
    //                 INNER JOIN dbo.Bills_From b ON i.billsFrom_id = b.billsFrom_id
    //                 WHERE i.invoice_id = @invoiceId
    //             `);

    //         // Group items by invoice
    //         if (result.recordset.length === 0) {
    //             throw new Error('Invoice not found');
    //         }

    //         const invoiceData = result.recordset[0]; // Base invoice data


    //         return {
    //             InvoiceID: invoiceData.invoice_id,
    //             InvoiceCreateDate: invoiceData.invoice_create_date ? new Date(invoiceData.invoice_create_date) : null,
    //             InvoicePaymentDue: invoiceData.invoice_payment_due ? new Date(invoiceData.invoice_payment_due) : null,
    //             InvoiceDescription: invoiceData.invoice_description,
    //             InvoicePaymentTerms: invoiceData.invoice_payment_terms,
    //             StatusID: invoiceData.status_id,
    //             BillsFromID: invoiceData.billsfrom_id,
    //             InvoiceTotal: invoiceData.invoice_total,
    //             BillsFromAddress: invoiceData.billsfrom_address,
    //             BillsFromCity: invoiceData.billsfrom_city,
    //             BillsFromPostalCode: invoiceData.billsfrom_postal_code,
    //             BillsFromCountry: invoiceData.billsfrom_country,
    //             ClientID: invoiceData.client_id,
    //             ClientName: invoiceData.client_name,
    //             ClientEmail: invoiceData.client_email,
    //             ClientAddress: invoiceData.client_address,
    //             ClientCity: invoiceData.client_city,
    //             ClientPostalCode: invoiceData.client_postal_code,
    //             ClientCountry: invoiceData.client_country,
    //             StatusName: invoiceData.status_name,
    //             Items: result.recordset.map(item => ({
    //                 ItemID: item.item_id,
    //                 ItemName: item.item_name,
    //                 ItemPrice: item.item_price,
    //                 ItemQuantity: item.item_quantity,
    //                 ItemTotal: item.item_total
    //             }))
    //         };
    //     } catch (err) {
    //         console.error('SQL error', err);
    //         throw new Error('Error retrieving invoice');
    //     }
    // },

    fetchInvoiceById: async ({ id }) => {
        try {
            const pool = await sql.connect(config);
            const result = await pool.request()
                .input('invoiceId', sql.Int, id) // Bind parameter securely
                .query(`
                    SELECT 
                        i.invoice_id, i.invoice_create_date, i.invoice_payment_due, i.invoice_description, 
                        i.invoice_payment_terms, i.status_id, i.billsfrom_id, i.invoice_total,
                        b.billsfrom_address, b.billsfrom_city, b.billsfrom_postal_code, b.billsfrom_country,  
                        c.client_id, c.client_name, c.client_email, c.client_address, c.client_city, 
                        c.client_postal_code, c.client_country, s.status_name, 
                        o.item_id, it.item_name, it.item_price, it.item_quantity, it.item_total 
                    FROM dbo.Invoice i
                    INNER JOIN dbo.Client c ON i.client_id = c.client_id
                    INNER JOIN dbo.Invoice_Status s ON i.status_id = s.status_id
                    INNER JOIN dbo.Orders o ON i.invoice_id = o.invoice_id
                    INNER JOIN dbo.Items it ON o.item_id = it.item_id
                    INNER JOIN dbo.Bills_From b ON i.billsFrom_id = b.billsFrom_id
                    WHERE i.invoice_id = @invoiceId
                `);

            // Group items by invoice
            if (result.recordset.length === 0) {
                throw new Error('Invoice not found');
            }

            const invoiceData = result.recordset[0]; // Base invoice data

            return {
                InvoiceID: invoiceData.invoice_id,
                InvoiceCreateDate: invoiceData.invoice_create_date ? new Date(invoiceData.invoice_create_date) : null,
                InvoicePaymentDue: invoiceData.invoice_payment_due ? new Date(invoiceData.invoice_payment_due) : null,
                InvoiceDescription: invoiceData.invoice_description,
                InvoicePaymentTerms: invoiceData.invoice_payment_terms,
                StatusID: invoiceData.status_id,
                BillsFromID: invoiceData.billsfrom_id,
                InvoiceTotal: invoiceData.invoice_total,
                BillsFromAddress: invoiceData.billsfrom_address,
                BillsFromCity: invoiceData.billsfrom_city,
                BillsFromPostalCode: invoiceData.billsfrom_postal_code,
                BillsFromCountry: invoiceData.billsfrom_country,
                ClientID: invoiceData.client_id,
                ClientName: invoiceData.client_name,
                ClientEmail: invoiceData.client_email,
                ClientAddress: invoiceData.client_address,
                ClientCity: invoiceData.client_city,
                ClientPostalCode: invoiceData.client_postal_code,
                ClientCountry: invoiceData.client_country,
                StatusName: invoiceData.status_name,
                Items: result.recordset.map(item => ({
                    ItemID: item.item_id,
                    ItemName: item.item_name,
                    ItemPrice: item.item_price,
                    ItemQuantity: item.item_quantity,
                    ItemTotal: item.item_total
                }))
            };
        } catch (err) {
            console.error('SQL error', err);
            throw new Error('Error retrieving invoice');
        }
    },

    getInvoiceById: ({ id }) => root.fetchInvoiceById({ id }),

    getHomeInvoices: async () => {
        try {
            const pool = await sql.connect(config);
            const result = await pool.request().query('SELECT i.invoice_id, i.invoice_payment_due, i.invoice_total, c.client_name, s.status_name FROM dbo.Invoice i, dbo.Client c, dbo.Invoice_Status s'
                + ' WHERE i.status_id = s.status_id AND i.client_id = c.client_id');

            return result.recordset.map(invoice => ({
                InvoiceID: invoice.invoice_id,
                InvoicePaymentDue: invoice.invoice_payment_due ? new Date(invoice.invoice_payment_due) : null,
                ClientName: invoice.client_name,
                StatusName: invoice.status_name,
                InvoiceTotal: invoice.invoice_total


            }));
        } catch (err) {
            console.error('SQL error', err);
            throw new Error('Error retrieving data from database');
        }
    },

    deleteItem: async ({ item_id }) => {
        const pool = await sql.connect(config);

        //This will help for rolling back everything if therre is an error
        const transaction = new sql.Transaction(pool);

        try {

            await transaction.begin();

            const ordersRequest = new sql.Request(transaction);

            await ordersRequest
                .input('ItemID', sql.Int, item_id)

                .query(`
                    DELETE FROM Orders
                    WHERE item_id = @ItemID
                `)

            const itemRequest = new sql.Request(transaction);

            await itemRequest
                .input('ItemID', sql.Int, item_id)

                .query(`
                    DELETE FROM Items
                    WHERE item_id = @ItemID;
                `)

            await transaction.commit();
            console.log('Item deleted successfully.');

        } catch (error) {
            await transaction.rollback();
            console.error('Failed to delete item:', error);
            throw new Error('Failed to delete item.');
        }
    },

    markInvoiceAsPaid: async ({ invoice_id }) => {
        const pool = await sql.connect(config);

        //This will help for rolling back everything if therre is an error
        const transaction = new sql.Transaction(pool);

        try {
            await transaction.begin();

            const paidRequest = new sql.Request(transaction);

            await paidRequest
                .input('InvoiceID', sql.Int, invoice_id)

                .query(`
                    UPDATE Invoice SET
                    status_id = 3
                    WHERE invoice_id = @InvoiceID
                `)

            await transaction.commit();
            console.log("Invoice marked as Paid succesfully")
        } catch (err) {
            await transaction.rollback();
            console.error('Failed to mark invoice as paid:', err);
            throw new Error('Failed to mark invoice as paid.');
        }
    },

    addNewInvoice: async ({ invoice }) => {
        const pool = await sql.connect(config);

        const transaction = new sql.Transaction(pool);

        try {
            await transaction.begin();

            const clientRequest = new sql.Request(transaction);

            //To get the result, need to make a new const variable, since result is not in Request object
            //Also, to get a result while inserting, add 'OUTPUT INSERTED.???' to get the data
            const clientRequestResult = await clientRequest
                .input('ClientName', sql.VarChar, invoice.ClientName)
                .input('ClientAddress', sql.VarChar, invoice.ClientAddress)
                .input('ClientCity', sql.VarChar, invoice.ClientCity)
                .input('ClientPostalCode', sql.VarChar, invoice.ClientPostalCode)
                .input('ClientCountry', sql.VarChar, invoice.ClientCountry)
                .input('ClientEmail', sql.VarChar, invoice.ClientEmail)

                .query(`
                    INSERT INTO Client (client_name, client_email, client_address, client_city, client_postal_code, client_country)
                    OUTPUT INSERTED.client_id
                    VALUES (@ClientName, @ClientEmail, @ClientAddress, @ClientCity, @ClientPostalCode, @ClientCountry)
                `)

            const getClientId = clientRequestResult.recordset[0].client_id

            // -----

            const invoiceRequest = new sql.Request(transaction);

            const invoiceRequestResult = await invoiceRequest
                .input('InvoiceCreateDate', sql.DateTime, invoice.InvoiceCreateDate)
                .input('InvoicePaymentDue', sql.DateTime, invoice.InvoicePaymentDue)
                .input('InvoiceDescription', sql.NVarChar, invoice.InvoiceDescription)
                .input('InvoicePaymentTerms', sql.Int, invoice.InvoicePaymentTerms)
                .input('StatusId', sql.Int, 2)
                .input('BillsFromId', sql.Int, 1)
                .input('InvoiceTotal', sql.Float, invoice.InvoiceTotal)
                .input('ClientID', sql.Int, getClientId)


                .query(`
                    INSERT INTO Invoice (invoice_create_date, invoice_payment_due, invoice_description, invoice_payment_terms, status_id, billsfrom_id, invoice_total, client_id)
                    OUTPUT INSERTED.invoice_id
                    VALUES (@InvoiceCreateDate, @InvoicePaymentDue, @InvoiceDescription, @InvoicePaymentTerms, @StatusId, @BillsFromId, @InvoiceTotal, @ClientID)
                `)

            const getInvoiceId = invoiceRequestResult.recordset[0].invoice_id

            for (const item of invoice.Items) {

                const itemsRequest = new sql.Request(transaction);

                const itemsRequestResult = await itemsRequest
                    .input('ItemName', sql.VarChar, item.ItemName)
                    .input('ItemPrice', sql.Real, item.ItemPrice)
                    .input('ItemQuantity', sql.Int, item.ItemQuantity)
                    .input('ItemTotal', sql.Real, item.ItemTotal)

                    .query(`
                        INSERT INTO Items (item_quantity, item_name, item_price, item_total)
                        OUTPUT INSERTED.item_id
                        VALUES (@ItemQuantity, @ItemName, @ItemPrice, @ItemTotal)
                    `)

                const getItemId = itemsRequestResult.recordset[0].item_id

                // -----

                const orderRequest = new sql.Request(transaction);

                await orderRequest
                    .input('ItemID', sql.Int, getItemId)
                    .input('InvoiceID', sql.Int, getInvoiceId)

                    .query(`
                        INSERT INTO Orders (item_id, invoice_id)
                        VALUES (@ItemID, @InvoiceID)
                    `)

            }


            console.log('Transaction committed successfully.');

            await transaction.commit();

            return {
                InvoiceID: getInvoiceId,
                InvoicePaymentDue: invoice.InvoicePaymentDue,
                ClientName: invoice.ClientName,
                StatusName: "Pending", // or whatever default status you use
                InvoiceTotal: invoice.InvoiceTotal
            };

        } catch (err) {
            await transaction.rollback();
            console.error('SQL error', err);
            throw new Error('Adding invoice error');
        }
    },


    updateInvoice: async ({ invoice }) => {

        const pool = await sql.connect(config);

        //This will help for rolling back everything if therre is an error
        const transaction = new sql.Transaction(pool);

        try {

            await transaction.begin();

            const clientRequest = new sql.Request(transaction);

            await clientRequest
                .input('ClientID', sql.Int, invoice.ClientID)
                .input('ClientName', sql.VarChar, invoice.ClientName)
                .input('ClientAddress', sql.VarChar, invoice.ClientAddress)
                .input('ClientCity', sql.VarChar, invoice.ClientCity)
                .input('ClientPostalCode', sql.VarChar, invoice.ClientPostalCode)
                .input('ClientCountry', sql.VarChar, invoice.ClientCountry)
                .input('ClientEmail', sql.VarChar, invoice.ClientEmail)

                .query(`
                    UPDATE Client SET
                    client_name = @ClientName,
                    client_email = @ClientEmail,
                    client_address = @ClientAddress,
                    client_city = @ClientCity,
                    client_postal_code = @ClientPostalCode,
                    client_country = @ClientCountry
                    WHERE client_id = @ClientID
                `)

            const request = new sql.Request(transaction);

            //Update the invoice
            await request
                .input('InvoiceID', sql.Int, invoice.InvoiceID)
                .input('InvoiceCreateDate', sql.DateTime, invoice.InvoiceCreateDate)
                .input('InvoicePaymentDue', sql.DateTime, invoice.InvoicePaymentDue)
                .input('InvoiceDescription', sql.NVarChar, invoice.InvoiceDescription)
                .input('InvoicePaymentTerms', sql.Int, invoice.InvoicePaymentTerms)
                .input('BillsFromAddress', sql.VarChar, invoice.BillsFromAddress)
                .input('BillsFromCity', sql.VarChar, invoice.BillsFromCity)
                .input('BillsFromPostalCode', sql.VarChar, invoice.BillsFromPostalCode)
                .input('BillsFromCountry', sql.VarChar, invoice.BillsFromCountry)
                .input('InvoiceTotal', sql.Float, invoice.InvoiceTotal)

                .query(`
                    UPDATE Invoice SET
                    invoice_create_date = @InvoiceCreateDate,
                    invoice_payment_due = @InvoicePaymentDue,
                    invoice_description = @InvoiceDescription,
                    invoice_payment_terms = @InvoicePaymentTerms,
                    invoice_total = @InvoiceTotal
                    WHERE invoice_id = @InvoiceID
                `);


            for (const item of invoice.Items) {

                const itemReq = new sql.Request(transaction)

                if (item.ItemID > 0) {
                    await itemReq
                        .input('ItemID', sql.Int, item.ItemID)
                        .input('ItemName', sql.VarChar, item.ItemName)
                        .input('ItemPrice', sql.Real, item.ItemPrice)
                        .input('ItemQuantity', sql.Int, item.ItemQuantity)
                        .input('ItemTotal', sql.Real, item.ItemTotal)

                        .query(
                            `
                                UPDATE Items SET
                                    item_quantity = @ItemQuantity,
                                    item_name = @ItemName,
                                    item_price = @ItemPrice,
                                    item_total = @ItemTotal
                                WHERE item_id = @ItemID
                            `
                        )
                }
                else {
                    const itemResult = await itemReq
                        .input('ItemName', sql.VarChar, item.ItemName)
                        .input('ItemPrice', sql.Real, item.ItemPrice)
                        .input('ItemQuantity', sql.Int, item.ItemQuantity)
                        .input('ItemTotal', sql.Real, item.ItemTotal)

                        .query(
                            `
                                INSERT INTO Items (item_name, item_price, item_quantity, item_total)
                                OUTPUT INSERTED.item_id
                                VALUES (@ItemName, @ItemPrice, @ItemQuantity, @ItemTotal)
                            `
                        )

                    const itemId = itemResult.recordset[0].item_id;

                    await new sql.Request(transaction)
                        .input('InvoiceID', sql.Int, invoice.InvoiceID)
                        .input('ItemID', sql.Int, itemId)
                        .query(`
                                INSERT INTO Orders (invoice_id, item_id)
                                VALUES (@InvoiceID, @ItemID)
                            `)
                }
            }

            await transaction.commit();
            console.log('Transaction committed successfully.');
            // return {
            //     InvoiceID: invoice.InvoiceID,
            //     InvoicePaymentDue: invoice.InvoicePaymentDue,
            //     ClientName: invoice.ClientName,
            //     StatusName: invoice.StatusName, // or whatever default status you use
            //     InvoiceTotal: invoice.InvoiceTotal
            // };


            return await root.fetchInvoiceById({ id: invoice.InvoiceID });



        } catch (err) {
            await transaction.rollback();
            console.error('SQL error', err);
            throw new Error('Error updating invoice');
        }
    }
};

// ✅ Apply GraphQL Middleware
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(5000, function () {
    console.log('🚀 Server running at http://localhost:5000/graphql');
});
