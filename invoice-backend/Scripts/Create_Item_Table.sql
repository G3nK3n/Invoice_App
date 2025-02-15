USE [Invoice_App_Database]
GO

/****** Object:  Table [dbo].[Budget]    Script Date: 2/5/2025 7:09:48 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Items](
	[item_id] [int] IDENTITY(1,1) NOT NULL,
	[item_quantity] [int] NULL,
	[item_name] [VARCHAR](50) NULL,
	[item_price] [real] NULL,
	[item_total] [real] NULL
) ON [PRIMARY]
GO