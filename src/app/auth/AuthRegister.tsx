'use client';
import React from 'react';
import { useFormStatus } from 'react-dom';
import { Box, Button, Typography } from '@mui/material';
import CustomTextField from '@/app/dashboard/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { Stack } from '@mui/system';

interface registerType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
  state?: any
}

function AuthRegister({ title, subtitle, subtext, state }: registerType) {
  const { pending } = useFormStatus();
  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <Box>
        <Stack mb={3}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="first_name"
            mb="5px"
          >
            First Name
          </Typography>
          <CustomTextField id="first_name" name="first_name" variant="outlined" fullWidth />

          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="last_name"
            mb="5px"
            mt="25px"
          >
            Last Name
          </Typography>
          <CustomTextField id="last_name" name="last_name" variant="outlined" fullWidth />

          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="email"
            mb="5px"
            mt="25px"
          >
            Email Address
          </Typography>
          <CustomTextField id="email" name="email" variant="outlined" fullWidth />

          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="password"
            mb="5px"
            mt="25px"
          >
            Password
          </Typography>
          <CustomTextField id="password" name="password" variant="outlined" fullWidth />
        </Stack>
        <Typography mb="5px" variant="body1" sx={{ color: theme => theme.palette.error.main }}>
          {state?.message}
        </Typography>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
          disabled={pending}
        >
          Sign Up
        </Button>
      </Box>
      {subtitle}
    </>
  );
}

export default AuthRegister;
