'use client';
import { Avatar, CardContent, Fab, Rating, Stack, Tooltip, Typography } from '@mui/material';
import BlankCard from '../dashboard/(DashboardLayout)/components/shared/BlankCard';
import { IconBasket } from '@tabler/icons-react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import UnstyledSnackbarIntroduction from './UnstyledSnackbarIntroduction';

function Product({ objectId, title, price, photo, rating, state }) {
  const { pending } = useFormStatus();
  return (
    <BlankCard>
      <UnstyledSnackbarIntroduction title={`Adding ${title} to cart...`} open={pending} />
      {!pending && (
        <UnstyledSnackbarIntroduction
          description={state?.error?.message}
          autoHideDuration={5000}
          open={!!state?.error?.message}
        />
      )}
      <input hidden name="objectId" value={objectId} />
      <Typography component={Link} href="/">
        <Avatar
          src={photo}
          variant="square"
          sx={{
            height: 250,
            width: '100%',
          }}
        />
      </Typography>
      <Tooltip title="Add To Cart">
        <Fab
          type="submit"
          disabled={pending}
          size="small"
          color="primary"
          sx={{ bottom: '75px', right: '15px', position: 'absolute' }}
        >
          <IconBasket size="16" />
        </Fab>
      </Tooltip>
      <CardContent sx={{ p: 3, pt: 2 }}>
        <Typography variant="h6">{title}</Typography>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mt={1}>
          <Stack direction="row" alignItems="center">
            <Typography variant="h6">${price}</Typography>
            {/*<Typography color='textSecondary' ml={1} sx={{ textDecoration: 'line-through' }}>*/}
            {/*  ${description}*/}
            {/*</Typography>*/}
          </Stack>
          <Rating name="read-only" size="small" value={rating} readOnly />
        </Stack>
      </CardContent>
    </BlankCard>
  );
}

export default Product;
