'use client';
import * as React from 'react';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/system';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

const city = Intl.DateTimeFormat().resolvedOptions().timeZone.split('/')[1];

export default function AddressForm() {
  const data = useSession({ required: true, onUnauthenticated: () => redirect('/login') });
  const user = data.data;

  return (
    user && (
      <Grid container spacing={3}>
        <FormGrid item xs={12} md={6}>
          <FormLabel htmlFor="first_name" required>
            First Name
          </FormLabel>
          <OutlinedInput
            id="first_name"
            name="first_name"
            defaultValue={user.first_name}
            required
          />
        </FormGrid>
        <FormGrid item xs={12} md={6}>
          <FormLabel htmlFor="last-name" required>
            Last Name
          </FormLabel>
          <OutlinedInput id="last_name" name="last_name" defaultValue={user.last_name} required />
        </FormGrid>
        <FormGrid item xs={12}>
          <FormLabel htmlFor="address1" required>
            Address line 1
          </FormLabel>
          <OutlinedInput
            id="address1"
            name="address1"
            type="address1"
            placeholder="Street name and number"
            autoComplete="shipping address-line1"
            required
          />
        </FormGrid>
        <FormGrid item xs={12}>
          <FormLabel htmlFor="address2">Address line 2</FormLabel>
          <OutlinedInput
            id="address2"
            name="address2"
            type="address2"
            placeholder="Apartment, suite, unit, etc. (optional)"
            autoComplete="shipping address-line2"
            required
          />
        </FormGrid>
        <FormGrid item xs={6}>
          <FormLabel htmlFor="country" required>
            Country
          </FormLabel>
          <OutlinedInput
            id="country"
            name="country"
            type="country"
            value="United Arab Emirates"
            disabled
            required
          />
        </FormGrid>
        <FormGrid item xs={6}>
          <FormLabel htmlFor="city" required>
            City
          </FormLabel>
          <OutlinedInput
            id="city"
            name="city"
            type="city"
            defaultValue={user.city || city}
            autoComplete="City"
            required
          />
        </FormGrid>
      </Grid>
    )
  );
}
