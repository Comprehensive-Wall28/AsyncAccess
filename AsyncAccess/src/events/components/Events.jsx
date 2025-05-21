
import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import MuiChip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import EdgesensorHighRoundedIcon from '@mui/icons-material/EdgesensorHighRounded';
import ViewQuiltRoundedIcon from '@mui/icons-material/ViewQuiltRounded';

const items = [
  {
    icon: <ViewQuiltRoundedIcon />,
    title: 'Dashboard',
    description:
      'This item could provide a snapshot of the most important metrics or data points related to the product.',
    // Use import.meta.env and VITE_ prefix
    imageLight: `url("${import.meta.env.VITE_TEMPLATE_IMAGE_URL || 'https://mui.com'}/static/images/templates/templates-images/dash-light.png")`,
    imageDark: `url("${import.meta.env.VITE_TEMPLATE_IMAGE_URL || 'https://mui.com'}/static/images/templates/templates-images/dash-dark.png")`,
  },
  {
    icon: <EdgesensorHighRoundedIcon />,
    title: 'Mobile integration',
    description:
      'This item could provide information about the mobile app version of the product.',
    // Use import.meta.env and VITE_ prefix
    imageLight: `url("${import.meta.env.VITE_TEMPLATE_IMAGE_URL || 'https://mui.com'}/static/images/templates/templates-images/mobile-light.png")`,
    imageDark: `url("${import.meta.env.VITE_TEMPLATE_IMAGE_URL || 'https://mui.com'}/static/images/templates/templates-images/mobile-dark.png")`,
  },
  {
    icon: <DevicesRoundedIcon />,
    title: 'Available on all platforms',
    description:
      'This item could let users know the product is available on all platforms, such as web, mobile, and desktop.',
    // Use import.meta.env and VITE_ prefix
    imageLight: `url("${import.meta.env.VITE_TEMPLATE_IMAGE_URL || 'https://mui.com'}/static/images/templates/templates-images/devices-light.png")`,
    imageDark: `url("${import.meta.env.VITE_TEMPLATE_IMAGE_URL || 'https://mui.com'}/static/images/templates/templates-images/devices-dark.png")`,
  },
];

const Chip = styled(MuiChip)(({ theme }) => ({
  variants: [
    {
      props: ({ selected }) => !!selected,
      style: {
        background:
          'linear-gradient(to bottom right, hsl(210, 98%, 48%), hsl(210, 98%, 35%))',
        color: 'hsl(0, 0%, 100%)',
        borderColor: (theme.vars || theme).palette.primary.light,
        '& .MuiChip-label': {
          color: 'hsl(0, 0%, 100%)',
        },
        ...theme.applyStyles('dark', {
          borderColor: (theme.vars || theme).palette.primary.dark,
        }),
      },
    },
  ],
}));

function MobileLayout({ selectedItemIndex, handleItemClick, selectedFeature }) {
  if (!items[selectedItemIndex]) {
    return null;
  }

  return (
    <Box
      sx={{
        display: { xs: 'flex', sm: 'none' },
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, overflow: 'auto' }}>
        {items.map(({ title }, index) => (
          <Chip
            size="medium"
            key={index}
            label={title}
            onClick={() => handleItemClick(index)}
            selected={selectedItemIndex === index}
          />
        ))}
      </Box>
      <Card variant="outlined">
        <Box
          sx={(theme) => ({
            mb: 2,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: 280,
            backgroundImage: 'var(--items-imageLight)',
            ...theme.applyStyles('dark', {
              backgroundImage: 'var(--items-imageDark)',
            }),
          })}
          style={
            items[selectedItemIndex]
              ? {
                  '--items-imageLight': items[selectedItemIndex].imageLight,
                  '--items-imageDark': items[selectedItemIndex].imageDark,
                }
              : {}
          }
        />
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography
            gutterBottom
            sx={{ color: 'text.primary', fontWeight: 'medium' }}
          >
            {selectedFeature.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
            {selectedFeature.description}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

MobileLayout.propTypes = {
  handleItemClick: PropTypes.func.isRequired,
  selectedFeature: PropTypes.shape({
    description: PropTypes.string.isRequired,
    icon: PropTypes.element,
    imageDark: PropTypes.string.isRequired,
    imageLight: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  selectedItemIndex: PropTypes.number.isRequired,
};

export { MobileLayout };

export default function Features() {
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);

  const handleItemClick = (index) => {
    setSelectedItemIndex(index);
  };

  const selectedFeature = items[selectedItemIndex];

  return (
    <Container id="features" sx={{ py: { xs: 8, sm: 16 } }}>
      <Box sx={{ width: { sm: '100%', md: '60%' } }}>
        <Typography
          component="h2"
          variant="h4"
          gutterBottom
          sx={{ color: 'text.primary' }}
        >
          Product features
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: 'text.secondary', mb: { xs: 2, sm: 4 } }}
        >
          Provide a brief overview of the key features of the product. For example,
          you could list the number of features, their types or benefits, and
          add-ons.
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row-reverse' },
          gap: 2,
        }}
      >
        <div>
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              flexDirection: 'column',
              gap: 2,
              height: '100%',
            }}
          >
            {items.map(({ icon, title, description }, index) => (
              <Box
                key={index}
                component={Button}
                onClick={() => handleItemClick(index)}
                sx={[
                  (theme) => ({
                    p: 2,
                    height: '100%',
                    width: '100%',
                    '&:hover': {
                      backgroundColor: (theme.vars || theme).palette.action.hover,
                    },
                  }),
                  selectedItemIndex === index && {
                    backgroundColor: 'action.selected',
                  },
                ]}
              >
                <Box
                  sx={[
                    {
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'left',
                      gap: 1,
                      textAlign: 'left',
                      textTransform: 'none',
                      color: 'text.secondary',
                    },
                    selectedItemIndex === index && {
                      color: 'text.primary',
                    },
                  ]}
                >
                  {icon}

                  <Typography variant="h6">{title}</Typography>
                  <Typography variant="body2">{description}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
          <MobileLayout
            selectedItemIndex={selectedItemIndex}
            handleItemClick={handleItemClick}
            selectedFeature={selectedFeature}
          />
        </div>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            width: { xs: '100%', md: '70%' },
            height: 'var(--items-image-height)',
          }}
        >
          <Card
            variant="outlined"
            sx={{
              height: '100%',
              width: '100%',
              display: { xs: 'none', sm: 'flex' },
              pointerEvents: 'none',
            }}
          >
            <Box
              sx={(theme) => ({
                m: 'auto',
                width: 420,
                height: 500,
                backgroundSize: 'contain',
                backgroundImage: 'var(--items-imageLight)',
                ...theme.applyStyles('dark', {
                  backgroundImage: 'var(--items-imageDark)',
                }),
              })}
              style={
                items[selectedItemIndex]
                  ? {
                      '--items-imageLight': items[selectedItemIndex].imageLight,
                      '--items-imageDark': items[selectedItemIndex].imageDark,
                    }
                  : {}
              }
            />
          </Card>
        </Box>
      </Box>
    </Container>
  );
}
=======
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel'; // Keep InputLabel
import Stack from '@mui/material/Stack';

const API_URL = '/api/v1/events';

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await axios.get(API_URL);
                setEvents(response.data);

                const allCategories = response.data.reduce((acc, event) => {
                    if (event.category && Array.isArray(event.category)) {
                        event.category.forEach(cat => {
                            if (cat && !acc.includes(cat)) {
                                acc.push(cat);
                            }
                        });
                    }
                    return acc;
                }, []);
                setCategories(['All Categories', ...allCategories.sort()]);

                setError(null);
            } catch (err) {
                console.error("Error fetching events:", err);
                setError(err.response?.data?.error || err.message || "Failed to fetch events. Please try again later.");
                setEvents([]);
                setCategories(['All Categories']);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            const titleMatch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
            const categoryMatch = selectedCategory === '' || selectedCategory === 'All Categories'
                ? true
                : event.category && event.category.includes(selectedCategory);
            return titleMatch && categoryMatch;
        });
    }, [events, searchTerm, selectedCategory]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 5, minHeight: '300px' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container sx={{ py: 5 }}>
                <Alert severity="error" sx={{ justifyContent: 'center' }}>{error}</Alert>
            </Container>
        );
    }

    return (
        <Container sx={{ py: { xs: 1, sm: 4 } }} id="approved-events">
            {/* Search and Filter Controls */}
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ mb: 4, justifyContent: 'center', alignItems: 'center' }}
            >
                <TextField
                    variant="outlined"
                    placeholder="Search by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: '300px' }, flexGrow: { sm: 1 }, maxWidth: {sm: '500px'} }}
                />
                <FormControl variant="outlined" sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: '200px' } }}>
                    {/* MODIFIED InputLabel below */}
                    <InputLabel
                        id="category-filter-label"
                        // Add sx prop to the InputLabel
                        sx={{
                            // Style for the default (not shrunken) state
                            // Adjust the second value (vertical translation) to move it up/down inside the box
                            // Default is often around 16px for standard size. Decrease to move up.
                            transform: 'translate(69px, 10px) scale(1)', // Example: moved up from default 16px to 14px

                            // Style for the shrunken (floated above) state (from previous request)
                            '&.MuiInputLabel-shrink': {
                                transform: 'translate(5px, -18px) scale(0.75)',
                            },
                        }}
                    >
                        Category
                    </InputLabel>
                    <Select
                        labelId="category-filter-label"
                        id="category-filter"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        label="Category" // This is important for the InputLabel to work correctly
                    >
                        {categories.map((category) => (
                            <MenuItem key={category} value={category === 'All Categories' ? '' : category}>
                                {category}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>

            {filteredEvents.length === 0 && !loading && (
                <Container sx={{ py: 5 }}>
                    <Typography variant="h6" align="center">
                        {searchTerm || (selectedCategory && selectedCategory !== 'All Categories')
                            ? `No events found matching your criteria.`
                            : "No approved events found at the moment. Please check back later!"}
                    </Typography>
                </Container>
            )}

            {filteredEvents.length > 0 && (
                <Grid container spacing={0} rowSpacing={7}>
                    {filteredEvents.map((event) => (
                        <Grid item key={event._id} xs={12} sm={6} md={4}>
                            <RouterLink to={`/events/${event._id}`} style={{ textDecoration: 'none', display: 'block' }}>
                                <Card sx={{
                                    ml: 7.5,
                                    width: '300px',
                                    height: '250px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    boxShadow: 3,
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                    '&:hover': {
                                        boxShadow: 8,
                                        transform: 'scale(1.03)',
                                    },
                                }}>
                                    <CardContent sx={{
                                        flexGrow: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        p: 0.5,
                                        pt: 0.25,
                                        overflow: 'hidden'
                                    }}>
                                        <Typography
                                            gutterBottom
                                            variant="h5"
                                            component="div"
                                            sx={{
                                                mt: 3,
                                                textAlign: 'center',
                                                fontWeight: 'medium',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: '3',
                                                WebkitBoxOrient: 'vertical',
                                            }}
                                        >
                                            {event.title}
                                        </Typography>

                                        <Box sx={{ pt: 1 }}>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '1rem' }}>
                                                <strong>Date:</strong> {new Date(event.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '1rem' }}>
                                                <strong>Location:</strong> {event.location}
                                            </Typography>
                                            {typeof event.ticketPrice === 'number' && event.ticketPrice >= 0 && (
                                                <Typography variant="h6" color="primary" sx={{ mt: 1, fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                    ${event.ticketPrice.toFixed(2)}
                                                </Typography>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </RouterLink>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}
