'use client';
import { pink, purple } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
    palette: {
      primary: purple,
      secondary: pink,
    }
  })

export default theme;