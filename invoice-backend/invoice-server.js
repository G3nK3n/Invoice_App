const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { GraphQLScalarType, Kind } = require('graphql');
const sql = require('mssql');

var config = {
    user: 'Ken',
    password: 'abcd',
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
`);


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

    getInvoiceById: async ({ id }) => {
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
