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
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';
import { useFormStatus } from 'react-dom';
import { Typography } from '@mui/material';
import UnstyledSnackbarIntroduction from './UnstyledSnackbarIntroduction';

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const city = timezone.split('/')[1];

const states = [{ value: city, label: city }];

export function AccountDetailsForm({ user, state }) {
  const { pending } = useFormStatus();
  return (
    <>
      <UnstyledSnackbarIntroduction
        open={pending}
        // title="Loading..."
        description="Saving account information..."
      />
      {!pending && (
        <UnstyledSnackbarIntroduction
          description={state?.error?.message}
          autoHideDuration={5000}
          open={!!state?.error?.message}
        />
      )}
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>First name</InputLabel>
                <OutlinedInput
                  defaultValue={user?.first_name}
                  label="First name"
                  name="first_name"
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Last name</InputLabel>
                <OutlinedInput defaultValue={user?.last_name} label="Last name" name="last_name" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput defaultValue={user?.email} label="Email address" name="email" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Phone number</InputLabel>
                <OutlinedInput
                  defaultValue={user?.phone}
                  label="Phone number"
                  name="phone"
                  type="tel"
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>City</InputLabel>
                <Select
                  defaultValue={user?.city || city || 'N/A'}
                  disabled={!!city}
                  label="City"
                  name="city"
                  variant="outlined"
                >
                  {states.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Country</InputLabel>
                <OutlinedInput
                  defaultValue={user?.country}
                  name="country"
                  type="text"
                  label="Country"
                />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Typography mb="5px" variant="body1" sx={{ color: theme => theme.palette.error.main }}>
          {state?.error?.message}
        </Typography>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type="submit" disabled={pending}>
            Save details
          </Button>
        </CardActions>
      </Card>
    </>
  );
}
