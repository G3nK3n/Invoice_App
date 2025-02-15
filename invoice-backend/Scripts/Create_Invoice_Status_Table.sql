USE [Invoice_App_Database]
GO

/****** Object:  Table [dbo].[Budget]    Script Date: 2/5/2025 7:09:48 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Invoice_Status](
	[status_id] [int] IDENTITY(1,1) NOT NULL,
	[status_name] [VARCHAR](30) NULL
) ON [PRIMARY]
GO