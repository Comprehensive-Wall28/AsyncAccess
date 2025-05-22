import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const addresses = ['1 MUI Drive', 'Reactville', 'Anytown', '99999', 'USA'];
const payments = [
  { name: 'Card type:', detail: 'Visa' },
  { name: 'Card holder:', detail: 'Mr. John Smith' },
  { name: 'Card number:', detail: 'xxxx-xxxx-xxxx-1234' },
  { name: 'Expiry date:', detail: '04/2024' },
];

export default function Review({
                                 productName = "Product", // This is the eventName
                                 productPrice = 0,
                                 shippingPrice = 0,
                                 totalPriceForReviewDisplay = 0,
                                 numberOfTickets = 1,
                                 onIncreaseTickets,
                                 onDecreaseTickets,
                                 availableTickets = Infinity,
                               }) {
  const productLineItemTotal = productPrice * numberOfTickets;

  // Construct the secondary text for the tickets line
  let ticketsSecondaryText;
  if (availableTickets === 0) {
    ticketsSecondaryText = `${productName} (Sold Out)`;
  } else {
    // Display event name and the number of tickets
    ticketsSecondaryText = `${productName} - ${numberOfTickets} ticket(s)`;
  }

  return (
      <Stack spacing={2}>
        <List disablePadding>
          <ListItem sx={{ py: 1, px: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ flexGrow: 1 }}>
              <ListItemText
                  primary="Total tickets" // Changed from productName
                  secondary={ticketsSecondaryText} // Updated to include event name and ticket count
              />
            </Box>
            { availableTickets > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  <IconButton
                      onClick={onDecreaseTickets}
                      size="small"
                      disabled={numberOfTickets <= 1 || availableTickets === 0}
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                  <Typography variant="body1" sx={{ mx: 1 }}>
                    {numberOfTickets}
                  </Typography>
                  <IconButton
                      onClick={onIncreaseTickets}
                      size="small"
                      disabled={numberOfTickets >= availableTickets || availableTickets === 0}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                </Box>
            )}
            <Typography variant="body2">
              {availableTickets === 0 ? "-" : `$${productLineItemTotal.toFixed(2)}`}
            </Typography>
          </ListItem>

          {/* Shipping ListItem re-added */}
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="Shipping" secondary="Plus taxes" />
            <Typography variant="body2">${shippingPrice.toFixed(2)}</Typography>
          </ListItem>


          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="Total" />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              ${totalPriceForReviewDisplay.toFixed(2)}
            </Typography>
          </ListItem>
        </List>
        <Divider />
        <Stack
            direction="column"
            divider={<Divider flexItem />}
            spacing={2}
            sx={{ my: 2 }}
        >
          <div>
            <Typography variant="subtitle2" gutterBottom>
              Shipment details
            </Typography>
            <Typography gutterBottom>John Smith</Typography>
            <Typography gutterBottom sx={{ color: 'text.secondary' }}>
              {addresses.join(', ')}
            </Typography>
          </div>
          <div>
            <Typography variant="subtitle2" gutterBottom>
              Payment details
            </Typography>
            <Grid container>
              {payments.map((payment) => (
                  <React.Fragment key={payment.name}>
                    <Stack
                        direction="row"
                        spacing={1}
                        useFlexGap
                        sx={{ width: '100%', mb: 1 }}
                    >
                      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        {payment.name}
                      </Typography>
                      <Typography variant="body2">{payment.detail}</Typography>
                    </Stack>
                  </React.Fragment>
              ))}
            </Grid>
          </div>
        </Stack>
      </Stack>
  );
}