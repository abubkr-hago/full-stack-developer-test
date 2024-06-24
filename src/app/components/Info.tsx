import * as React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

interface InfoProps {
  totalPrice: string;
}

export default function Info({ totalPrice, products }: InfoProps) {
  return (
    <React.Fragment>
      <Typography variant="subtitle2" color="text.secondary">
        Total
      </Typography>
      <Typography variant="h4" gutterBottom>
        {totalPrice}
      </Typography>
      <List disablePadding>
        {products.map(({ product }) => (
          <ListItem key={product.title} sx={{ py: 1, px: 0 }}>
            <ListItemText sx={{ mr: 2 }} primary={product.title} secondary={product.description} />
            <Typography variant="body1" fontWeight="medium">
              AED {product.price}
            </Typography>
          </ListItem>
        ))}
      </List>
    </React.Fragment>
  );
}
