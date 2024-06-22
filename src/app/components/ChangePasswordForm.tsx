'use client';
import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Unstable_Grid2';
import { useFormStatus } from 'react-dom';
import { Typography } from '@mui/material';
import UnstyledSnackbarIntroduction from './UnstyledSnackbarIntroduction';

export function ChangePasswordForm({ state }) {
  const { pending } = useFormStatus();
  return (
    <>
      <UnstyledSnackbarIntroduction
        open={pending}
        // title="Loading..."
        description="Saving account information..."
      />
      <Card>
        <CardHeader subheader="Input old password and new password" title="Change Password" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid spacing={3} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Old Password</InputLabel>
                <OutlinedInput type="password" label="Old Password" name="old_password" />
              </FormControl>
            </Grid>
            <Grid spacing={3} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>New Password</InputLabel>
                <OutlinedInput type="password" label="New Password" name="new_password" />
              </FormControl>
            </Grid>
          </Grid>
          <Typography mb="5px" variant="body1" sx={{ color: theme => theme.palette.error.main }}>
            {state?.error?.message}
          </Typography>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type="submit" disabled={pending}>
            Submit
          </Button>
        </CardActions>
      </Card>
    </>
  );
}
