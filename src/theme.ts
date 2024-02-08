'use client';
import { pink, purple } from '@mui/material/colors';
import { ThemeOptions, createTheme } from '@mui/material/styles';

import { Roboto } from 'next/font/google';

const options: ThemeOptions = {
  palette: {
    mode: 'dark'
  }
}

const theme = createTheme(options);


export default theme;