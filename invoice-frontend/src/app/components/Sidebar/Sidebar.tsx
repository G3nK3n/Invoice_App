

import React from 'react';
import { Box, CssBaseline } from '@mui/material';

import Image from 'next/image'


import { useRouter, usePathname} from 'next/navigation';

import {Public_Sans} from 'next/font/google';

const drawerWidth = 300

const public_sans = Public_Sans({
  subsets: ['latin'],
  weight: ['100', '200'],
  display: 'swap',

})

export default function Sidebar() {
    return (
        <Box 
            sx={{
                display: 'inline-block', 
                backgroundColor: '#373B53', 
                width: '103px', 
                borderTopRightRadius: '25px',
                borderBottomRightRadius: '25px'
            }}
        >
          
          <CssBaseline />

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    backgroundColor: '#7C5DFA', 
                    height: '103px', 
                    width: '103px', 
                    borderBottomRightRadius: '25px', 
                    borderTopRightRadius: '25px',
                }}
            >
                <Image alt={'Logo'} src={'/images/logo.svg'} width={40} height={40}/>
            </Box>

            <Box 
                sx={{
                    position: 'absolute',
                    bottom: '90px',
                    paddingLeft: '42px',
                    paddingTop: '30px',
                    width: '103px',
                    height: '100px',
                    borderBottomRightRadius: '25px',
                }}
            >
                <Image alt={'Logo'} src={'/images/icon-moon.svg'} width={20} height={20}/>
            </Box>

            <Box 
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    paddingLeft: '32px',
                    paddingTop: '30px',
                    width: '103px',
                    height: '100px',
                    borderBottomRightRadius: '25px',
                    borderTop: '1px solid rgba(151, 151, 151, 0.5)',
                }}
            >
                <Image style={{borderRadius: '25px'}} alt={'avatar'} src={'/images/image-avatar.jpg'} width={40} height={40} /> 
            </Box>

        </Box>
        
      );
}