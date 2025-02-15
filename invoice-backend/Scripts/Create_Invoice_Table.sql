USE [Invoice_App_Database]
GO

/****** Object:  Table [dbo].[Invoice]    Script Date: 2/7/2025 1:07:52 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Invoice](
	[invoice_id] [int] IDENTITY(1,1) NOT NULL,
	[invoice_create_date] [date] NULL,
	[invoice_payment_due] [date] NULL,
	[invoice_description] [varchar](200) NULL,
	[invoice_payment_terms] [int] NULL,
	[status_id] [int] NULL,
	[billsfrom_id] [int] NULL,
	[invoice_total] [real] NULL,
 CONSTRAINT [PK_Invoice] PRIMARY KEY CLUSTERED 
(
	[invoice_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Invoice]  WITH CHECK ADD  CONSTRAINT [FK_BillsFrom_Invoice] FOREIGN KEY([billsfrom_id])
REFERENCES [dbo].[Bills_From] ([billsfrom_id])
GO

ALTER TABLE [dbo].[Invoice] CHECK CONSTRAINT [FK_BillsFrom_Invoice]
GO

ALTER TABLE [dbo].[Invoice]  WITH CHECK ADD  CONSTRAINT [FK_InvoiceStatus_Invoice] FOREIGN KEY([status_id])
REFERENCES [dbo].[Invoice_Status] ([status_id])
GO

ALTER TABLE [dbo].[Invoice] CHECK CONSTRAINT [FK_InvoiceStatus_Invoice]
GO


