'use client';
import React from 'react';
import { Box, Button, FormGroup, Stack, Typography } from '@mui/material';
import Link from 'next/link';

import CustomTextField from '@/app/dashboard/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { useFormStatus } from 'react-dom';
import { useSearchParams } from 'next/navigation';

interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
  state?: any;
}

function AuthLogin({ title, subtitle, subtext, state }: loginType) {
  const { pending } = useFormStatus();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <Stack>
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="email"
            mb="5px"
          >
            Email
          </Typography>
          <CustomTextField
            id="email"
            defaultValue={email}
            name="email"
            variant="outlined"
            fullWidth
          />
        </Box>
        <Box mt="25px">
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="password"
            mb="5px"
          >
            Password
          </Typography>
          <CustomTextField type="password" name="password" variant="outlined" fullWidth />
        </Box>
        <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
          <FormGroup>
            {/*  <FormControlLabel*/}
            {/*    control={<Checkbox defaultChecked />}*/}
            {/*    label="Remeber this Device"*/}
            {/*  />*/}
          </FormGroup>
          <Typography
            component={Link}
            href="/forgot-password"
            fontWeight="500"
            sx={{
              textDecoration: 'none',
              color: 'primary.main',
            }}
          >
            Forgot Password ?
          </Typography>
        </Stack>
      </Stack>
      <Typography mb="5px" variant="body1" sx={{ color: theme => theme.palette.error.main }}>
        {state?.message}
      </Typography>
      <Box>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          disabled={pending}
          type="submit"
        >
          Sign In
        </Button>
      </Box>
      {subtitle}
    </>
  );
}

export default AuthLogin;
