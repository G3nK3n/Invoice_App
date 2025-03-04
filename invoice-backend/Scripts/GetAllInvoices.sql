SELECT 
    i.invoice_id,
    i.invoice_create_date,
    i.invoice_payment_due,
    i.invoice_description,
    i.invoice_payment_terms,
    i.status_id,
    i.billsfrom_id,
    i.invoice_total,
    c.client_id AS client_id,  
    c.client_name,
	c.client_email,
	c.client_address,
	c.client_city,
	c.client_postal_code,
	c.client_country,
	s.status_name,
	o.item_id,
	it.item_name,
	it.item_price,
	it.item_quantity,
	it.item_total
FROM dbo.Invoice i
INNER JOIN dbo.Client c ON i.client_id = c.client_id
INNER JOIN dbo.Invoice_Status s ON i.status_id = s.status_id
INNER JOIN dbo.Orders o ON i.invoice_id = o.invoice_id
INNER JOIN dbo.Items it ON o.item_id = it.item_id