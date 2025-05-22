import * as React from 'react';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

function Info({ totalPrice }) {
  return (
      <React.Fragment>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
          Total
        </Typography>
        <Typography variant="h4" gutterBottom>
          {totalPrice}
        </Typography>
        {/* The List component and its mapping logic for 'products' have been removed. */}
      </React.Fragment>
  );
}

Info.propTypes = {
  totalPrice: PropTypes.string.isRequired,
};

export default Info;