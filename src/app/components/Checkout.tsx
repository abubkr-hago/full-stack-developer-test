'use client';
import * as React from 'react';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

import AddressForm from './AddressForm';
import getCheckoutTheme from './getCheckoutTheme';
import Info from './Info';
import InfoMobile from './InfoMobile';
import ToggleColorMode from './ToggleColorMode';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Elements, ElementsConsumer, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useFormStatus } from 'react-dom';

const stripe = loadStripe(
  'pk_test_51PDrRn06N7vpTor2c1hHQwYHOYp5NCimUuJJ5ZKPnCj30EzJerb5d5Y7Twl55xJk6CxkiyZi4Uh89CshBy9P76MQ00k4GLjCbV'
);

const steps = ['Shipping address', 'Payment details', 'Congratulations!'];

const logoStyle = {
  width: '140px',
  height: '56px',
  marginLeft: '-4px',
  marginRight: '-8px',
};

export default function Checkout({ transaction, products, clientSecret }) {
  const searchParams = useSearchParams();
  const id = searchParams?.get('id');
  const payment_intent = searchParams.get('payment_intent');
  const redirect_status = searchParams.get('redirect_status');
  const [mode, setMode] = React.useState<PaletteMode>('light');
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const checkoutTheme = createTheme(getCheckoutTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });
  const [activeStep, setActiveStep] = React.useState(redirect_status ? 2 : 0);
  const [errorMessage, setErrorMessage] = useState(null);
  const { pending } = useFormStatus();

  const toggleColorMode = () => {
    setMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const toggleCustomTheme = () => {
    setShowCustomTheme(prev => !prev);
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <ThemeProvider theme={showCustomTheme ? checkoutTheme : defaultTheme}>
      <CssBaseline />
      <Grid container sx={{ height: { xs: '100%', sm: '100dvh' } }}>
        <Grid
          item
          xs={12}
          sm={5}
          lg={4}
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            backgroundColor: 'background.paper',
            borderRight: { sm: 'none', md: '1px solid' },
            borderColor: { sm: 'none', md: 'divider' },
            alignItems: 'start',
            pt: 4,
            px: 10,
            gap: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'end',
              height: 150,
            }}
          >
            <Button startIcon={<ArrowBackRoundedIcon />} component="a" href="/" sx={{ ml: '-8px' }}>
              Back to
              <img
                src={
                  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e6faf73568658154dae_SitemarkDefault.svg'
                }
                style={logoStyle}
                alt="Sitemark's logo"
              />
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              width: '100%',
              maxWidth: 500,
            }}
          >
            <Info products={products} totalPrice={`AED ${transaction.amount}`} />
          </Box>
        </Grid>
        <Grid
          item
          sm={12}
          md={7}
          lg={8}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '100%',
            width: '100%',
            backgroundColor: { xs: 'transparent', sm: 'background.default' },
            alignItems: 'start',
            pt: { xs: 2, sm: 4 },
            px: { xs: 2, sm: 10 },
            gap: { xs: 4, md: 8 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: { sm: 'space-between', md: 'flex-end' },
              alignItems: 'center',
              width: '100%',
              maxWidth: { sm: '100%', md: 600 },
            }}
          >
            <Box
              sx={{
                display: { xs: 'flex', md: 'none' },
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <Button
                startIcon={<ArrowBackRoundedIcon />}
                component="a"
                href="/"
                sx={{ alignSelf: 'start' }}
              >
                Back to
                <img
                  src={
                    'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e6faf73568658154dae_SitemarkDefault.svg'
                  }
                  style={logoStyle}
                  alt="Sitemark's logo"
                />
              </Button>
              <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
            </Box>
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flexGrow: 1,
                height: 150,
              }}
            >
              <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
              <Stepper
                id="desktop-stepper"
                activeStep={activeStep}
                sx={{
                  width: '100%',
                  height: 40,
                }}
              >
                {steps.map(label => (
                  <Step
                    sx={{
                      ':first-child': { pl: 0 },
                      ':last-child': { pr: 0 },
                    }}
                    key={label}
                  >
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </Box>
          <Card
            sx={{
              display: { xs: 'flex', md: 'none' },
              width: '100%',
            }}
          >
            <CardContent
              sx={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                ':last-child': { pb: 2 },
              }}
            >
              <div>
                <Typography variant="subtitle2" gutterBottom>
                  Selected products
                </Typography>
                <Typography variant="body1">{`AED ${transaction.amount}`}</Typography>
              </div>
              <InfoMobile products={products} totalPrice={`AED ${transaction.amount}`} />
            </CardContent>
          </Card>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              width: '100%',
              maxWidth: { sm: '100%', md: 600 },
              maxHeight: '720px',
              gap: { xs: 5, md: 'none' },
            }}
          >
            <Stepper
              id="mobile-stepper"
              activeStep={activeStep}
              alternativeLabel
              sx={{ display: { sm: 'flex', md: 'none' } }}
            >
              {steps.map(label => (
                <Step
                  sx={{
                    ':first-child': { pl: 0 },
                    ':last-child': { pr: 0 },
                    '& .MuiStepConnector-root': { top: { xs: 6, sm: 12 } },
                  }}
                  key={label}
                >
                  <StepLabel sx={{ '.MuiStepLabel-labelContainer': { maxWidth: '70px' } }}>
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            <React.Fragment>
              {activeStep === 0 ? (
                <>
                  <AddressForm />
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column-reverse', sm: 'row' },
                      justifyContent: activeStep !== 0 ? 'space-between' : 'flex-end',
                      alignItems: 'end',
                      flexGrow: 1,
                      gap: 1,
                      pb: { xs: 12, sm: 0 },
                      mt: { xs: 2, sm: 0 },
                      mb: '60px',
                    }}
                  >
                    <Button
                      variant="contained"
                      endIcon={<ChevronRightRoundedIcon />}
                      onClick={handleNext}
                      sx={{
                        width: { xs: '100%', sm: 'fit-content' },
                      }}
                    >
                      Next
                    </Button>
                  </Box>
                </>
              ) : activeStep === 1 ? (
                <Elements
                  stripe={stripe}
                  options={{
                    appearance: {
                      theme: 'stripe',
                    },
                    clientSecret,
                  }}
                >
                  <ElementsConsumer>
                    {({ stripe, elements }) => (
                      <form
                        onSubmit={async event => {
                          event.preventDefault();
                          const { error } = await stripe.confirmPayment({
                            elements,
                            confirmParams: {
                              // Make sure to change this to your payment completion page
                              return_url: window.location.toString(),
                            },
                          });
                          setErrorMessage(error?.message);
                        }}
                      >
                        <Grid
                          sx={{
                            mb: '60px',
                          }}
                        >
                          <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />
                        </Grid>
                        <Typography
                          mb="5px"
                          variant="body1"
                          sx={{ color: theme => theme.palette.error.main }}
                        >
                          {errorMessage}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column-reverse', sm: 'row' },
                            justifyContent: activeStep !== 0 ? 'space-between' : 'flex-end',
                            alignItems: 'end',
                            flexGrow: 1,
                            gap: 1,
                            pb: { xs: 12, sm: 0 },
                            mt: { xs: 2, sm: 0 },
                            mb: '60px',
                          }}
                        >
                          <Button
                            startIcon={<ChevronLeftRoundedIcon />}
                            onClick={handleBack}
                            variant="text"
                            sx={{
                              display: { xs: 'none', sm: 'flex' },
                            }}
                          >
                            Previous
                          </Button>
                          <Button
                            variant="contained"
                            endIcon={<ChevronRightRoundedIcon />}
                            type="submit"
                            disabled={!stripe || pending}
                            sx={{
                              width: { xs: '100%', sm: 'fit-content' },
                            }}
                          >
                            Pay
                          </Button>
                        </Box>
                      </form>
                    )}
                  </ElementsConsumer>
                </Elements>
              ) : (
                <Stack spacing={2} useFlexGap>
                  <Typography variant="h1">📦</Typography>
                  <Typography variant="h5">
                    {redirect_status === 'succeeded'
                      ? 'Thank you for your order!'
                      : 'Payment failure!'}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {redirect_status === 'succeeded' ? (
                      <>
                        Your order number is
                        <strong>&nbsp;{id}</strong>. We have emailed your order confirmation and
                        will update you once its shipped.
                      </>
                    ) : (
                      <>
                        Your payment
                        <strong>&nbsp;{payment_intent}</strong> Failed, please try again
                      </>
                    )}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      alignSelf: 'start',
                      width: { xs: '100%', sm: 'auto' },
                    }}
                    component={Link}
                    href="/"
                  >
                    Go to my orders
                  </Button>
                </Stack>
              )}
            </React.Fragment>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
