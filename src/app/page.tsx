'use server';
import * as React from 'react';
import Box from '@mui/material/Box';
import Hero from './components/Hero';
import Footer from './components/Footer';
import LightThemeProvider from './components/LightThemeProvider';
import { Grid } from '@mui/material';
import { auth } from '../config/auth';
import ProductForm from './components/ProductForm';

export default async function Home() {
  const session = await auth();
  const products = await new Parse.Query('Product')
    .find({ sessionToken: session?.sessionToken })
    .then(p => p.map(o => o.toJSON()))
    .catch(e => console.error(e));

  return (
    <LightThemeProvider>
      <Hero />
      <Box sx={{ bgcolor: 'background.default' }}>
        <Grid
          item
          xs={12}
          sx={{
            mx: 'auto',
            width: {
              xs: '100%',
              sm: '75%',
            },
          }}
        >
          <Grid container spacing={3}>
            {products.map((p, index) => (
              <Grid item xs={12} md={4} lg={3} key={index}>
                <ProductForm key={index} {...p} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ bgcolor: 'background.default' }}>
        <Footer />
      </Box>
    </LightThemeProvider>
  );
}
