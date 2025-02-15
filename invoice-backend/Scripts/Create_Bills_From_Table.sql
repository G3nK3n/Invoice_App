USE [Invoice_App_Database]
GO

/****** Object:  Table [dbo].[Budget]    Script Date: 2/5/2025 7:09:48 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Bills_From](
	[billsfrom_id] [int] IDENTITY(1,1) NOT NULL,
	[billsfrom_address] [VARCHAR](50) NULL,
	[billsfrom_city] [VARCHAR](30) NULL,
	[billsfrom_postal_code] [VARCHAR](8) NULL,
	[billsfrom_country] [VARCHAR](20) NULL
) ON [PRIMARY]
GO