import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import Link from 'next/link';

import CustomTextField from '@/app/dashboard/(DashboardLayout)/components/forms/theme-elements/CustomTextField';

interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthLogin = ({ title, subtitle, subtext }: loginType) => (
  <>
    {title ? (
      <Typography fontWeight="700" variant="h2" mb={1}>
        {title}
      </Typography>
    ) : null}

    {subtext}

    <Stack>
      <Box>
        <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="email" mb="5px">
          Email
        </Typography>
        <CustomTextField variant="outlined" fullWidth />
      </Box>
      <Box mt="25px" />
    </Stack>
    <Box>
      <Button
        color="primary"
        variant="contained"
        size="large"
        fullWidth
        component={Link}
        href="/"
        type="submit"
      >
        Send Password Reset Email
      </Button>
    </Box>
    {subtitle}
  </>
);

export default AuthLogin;
