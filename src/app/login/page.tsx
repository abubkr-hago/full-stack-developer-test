'use server';
import Link from 'next/link';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import PageContainer from '@/app/dashboard/(DashboardLayout)/components/container/PageContainer';
import Logo from '@/app/dashboard/(DashboardLayout)/layout/shared/logo/Logo';
import AuthLogin from '../auth/AuthLogin';
import { getCsrfToken } from 'next-auth/react';
import React from 'react';
import { cookies } from 'next/headers';
import { auth } from '../../config/auth';
import { redirect } from 'next/navigation';

export default async function Page({ searchParams }) {
  const session = await auth();
  if (session) return redirect('/profile');
  const { error } = searchParams || {};
  const csrfToken = await getCsrfToken({
    req: {
      headers: {
        cookie: cookies().toString(),
      },
    },
  });
  return (
    <PageContainer title="Login" description="this is Login page">
      <Box
        sx={{
          position: 'relative',
          '&:before': {
            content: '""',
            background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            position: 'absolute',
            height: '100%',
            width: '100%',
            opacity: '0.3',
          },
        }}
      >
        <Grid container spacing={0} justifyContent="center" sx={{ height: '100vh' }}>
          <Grid
            item
            xs={12}
            sm={12}
            lg={4}
            xl={3}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card elevation={9} sx={{ p: 4, zIndex: 1, width: '100%', maxWidth: '500px' }}>
              <Box display="flex" alignItems="center" justifyContent="center">
                <Logo />
              </Box>
              <form
                // action={formAction}
                method="post"
                action="/api/auth/callback/credentials"
              >
                <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                <AuthLogin
                  state={{ message: error }}
                  subtext={
                    <Typography variant="subtitle1" textAlign="center" color="textSecondary" mb={1}>
                      Your Preferred Store
                    </Typography>
                  }
                  subtitle={
                    <Stack direction="row" spacing={1} justifyContent="center" mt={3}>
                      <Typography color="textSecondary" variant="h6" fontWeight="500">
                        New to MyStore?
                      </Typography>
                      <Typography
                        component={Link}
                        href="/register"
                        fontWeight="500"
                        sx={{
                          textDecoration: 'none',
                          color: 'primary.main',
                        }}
                      >
                        Create an account
                      </Typography>
                    </Stack>
                  }
                />
              </form>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}
