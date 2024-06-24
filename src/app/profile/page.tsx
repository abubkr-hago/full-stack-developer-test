'use client';
import * as React from 'react';
import { useRef } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { AccountInfo } from '../components/account-info';
import { AccountDetailsForm } from '../components/account-details-form';
import LightThemeProvider from '../components/LightThemeProvider';
import Box from '@mui/material/Box';
import Footer from '../components/Footer';
import { ChangePasswordForm } from '../components/ChangePasswordForm';
import { useSession } from 'next-auth/react';
import { useFormState } from 'react-dom';
import { changePassword, updateUser } from '../lib/actions';
import { redirect } from 'next/navigation';

export default function Page() {
  const data = useSession({ required: true, onUnauthenticated: () => redirect('/login') });
  const user = data.data;
  const [updateState, updateUserAction] = useFormState(updateUser, user);
  const [passwordState, changePasswordAction] = useFormState(changePassword, user);
  const ref = useRef<HTMLFormElement>();

  React.useEffect(() => {
    if (ref.current && !passwordState?.error) {
      ref.current.reset();
    }
  }, [passwordState?.error]);

  return (
    user && (
      <LightThemeProvider>
        <Box
          sx={{
            bgcolor: 'background.default',
            mx: 'auto',
            width: {
              xs: '100%',
              sm: '75%',
            },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: { xs: 14, sm: 15 },
            // pb: { xs: 8, sm: 12 },
          }}
        >
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">Account</Typography>
            </div>
            <Grid container spacing={3}>
              <Grid lg={4} md={6} xs={12}>
                <AccountInfo user={user} />
              </Grid>
              <Grid lg={8} md={6} xs={12}>
                <form action={updateUserAction}>
                  <AccountDetailsForm state={updateState} user={user} />
                </form>
              </Grid>
            </Grid>
            <Grid lg={8} md={6}>
              <form ref={ref} action={changePasswordAction}>
                <ChangePasswordForm state={passwordState} user={user} />
              </form>
            </Grid>
          </Stack>
        </Box>
        <Footer />
      </LightThemeProvider>
    )
  );
}
