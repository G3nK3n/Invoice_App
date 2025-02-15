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

    type Invoice {
        InvoiceID: Int
        InvoiceCreateDate: Date
        InvoicePaymentDue: Date
        InvoiceDescription: String
        InvoicePaymentTerms: Int
        StatusID: Int
        BillsFromID: Int
        InvoiceTotal: Float
        ClientName: String
        StatusName: String
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
    }
`);


const root = {
    Date: DateScalar, // Register custom Date scalar
    getAllInvoices: async () => {
        try {
            const pool = await sql.connect(config);
            const result = await pool.request().query('SELECT * FROM dbo.Invoice i, dbo.Client c, dbo.Invoice_Status s'
                + ' WHERE i.status_id = s.status_id AND i.client_id = c.client_id');

            return result.recordset.map(invoice => ({
                InvoiceID: invoice.invoice_id,
                InvoiceCreateDate: invoice.invoice_create_date ? new Date(invoice.invoice_create_date) : null,
                InvoicePaymentDue: invoice.invoice_payment_due ? new Date(invoice.invoice_payment_due) : null,
                InvoiceDescription: invoice.invoice_description,
                InvoicePaymentTerms: invoice.invoice_payment_terms,
                StatusID: invoice.status_id,
                BillsFromID: invoice.billsfrom_id,
                InvoiceTotal: invoice.invoice_total,
                ClientName: invoice.client_name,
                StatusName: invoice.status_name


            }));
        } catch (err) {
            console.error('SQL error', err);
            throw new Error('Error retrieving data from database');
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
