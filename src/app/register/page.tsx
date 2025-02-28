'use client';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import PageContainer from '@/app/dashboard/(DashboardLayout)/components/container/PageContainer';
import Logo from '@/app/dashboard/(DashboardLayout)/layout/shared/logo/Logo';
import AuthRegister from '../auth/AuthRegister';
import { signup } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const initialState = {
  user: null,
  error: { code: 0, message: '' },
};

function Register2() {
  const session = useSession();
  const [state, formAction] = useFormState(signup, initialState);
  if (session?.data) return redirect('/profile');
  if (state.success) {
    return redirect(`/login?email=${state.email}`);
  }
  return (
    <PageContainer title="Register" description="this is Register page">
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
              <form action={formAction}>
                <AuthRegister
                  state={state}
                  subtext={
                    <Typography variant="subtitle1" textAlign="center" color="textSecondary" mb={1}>
                      Your Social Campaigns
                    </Typography>
                  }
                  subtitle={
                    <Stack direction="row" justifyContent="center" spacing={1} mt={3}>
                      <Typography color="textSecondary" variant="h6" fontWeight="400">
                        Already have an Account?
                      </Typography>
                      <Typography
                        component={Link}
                        href="/login"
                        fontWeight="500"
                        sx={{
                          textDecoration: 'none',
                          color: 'primary.main',
                        }}
                      >
                        Sign In
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

export default Register2;
