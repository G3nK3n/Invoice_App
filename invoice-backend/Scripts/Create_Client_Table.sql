USE [Invoice_App_Database]
GO

/****** Object:  Table [dbo].[Budget]    Script Date: 2/5/2025 7:09:48 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Client](
	[client_id] [int] IDENTITY(1,1) NOT NULL,
	[client_name] [VARCHAR](50) NULL,
	[client_email] [VARCHAR](100) NULL,
	[client_address] [VARCHAR](150) NULL,
	[client_city] [VARCHAR](20) NULL,
	[client_postal_code] [varchar](8) NULL
) ON [PRIMARY]
GO