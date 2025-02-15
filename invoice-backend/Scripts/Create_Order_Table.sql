USE [Invoice_App_Database]
GO

/****** Object:  Table [dbo].[Budget]    Script Date: 2/5/2025 7:09:48 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

DROP TABLE dbo.Orders

CREATE TABLE [dbo].[Orders](
    [order_item_id] INT IDENTITY(1,1) NOT NULL,       -- Unique ID for each order item (Auto-Incremented)
    [item_id] INT NULL,                                -- ID of the item (Foreign Key to Items table)
    [client_id] INT NULL,                              -- ID of the client (Foreign Key to Client table)
    [invoice_id] INT NULL,                             -- Foreign Key referencing the Invoice ID
    CONSTRAINT PK_Orders PRIMARY KEY ([order_item_id]),   -- Primary Key for individual order items
    CONSTRAINT FK_Orders_Invoice FOREIGN KEY ([invoice_id]) REFERENCES [dbo].[Invoice]([invoice_id]),
    CONSTRAINT FK_Orders_Item FOREIGN KEY ([item_id]) REFERENCES [dbo].[Items]([item_id]),
    CONSTRAINT FK_Orders_Client FOREIGN KEY ([client_id]) REFERENCES [dbo].[Client]([client_id])
) ON [PRIMARY]