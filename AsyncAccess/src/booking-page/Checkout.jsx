import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert'; // Import Alert for error messages
import CircularProgress from '@mui/material/CircularProgress'; // Import for loading state
import Divider from '@mui/material/Divider'; // Import Divider
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddressForm from './components/AddressForm';
import Info from './components/Info';
import InfoMobile from './components/InfoMobile';
import PaymentForm from './components/PaymentForm';
import Review from './components/Review';
import SitemarkIcon from './components/SitemarkIcon';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeIconDropdown from '../shared-theme/ColorModeIconDropdown';

const steps = ['Shipping address', 'Payment details', 'Review your order'];

// Define your API base URL (ensure this is correctly set in your .env file)
const BACKEND_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
    baseURL: BACKEND_API_BASE_URL,
    withCredentials: true, // Important for sending cookies if your auth relies on them
});


function getStepContent(
    step,
    productName,
    productPrice,
    shippingPrice,
    totalPriceForReviewDisplay,
    numberOfTickets,
    onIncreaseTickets,
    onDecreaseTickets,
    availableTickets
) {
    switch (step) {
        case 0:
            return <AddressForm />;
        case 1:
            return <PaymentForm />;
        case 2:
            return (
                <Review
                    productName={productName}
                    productPrice={productPrice}
                    shippingPrice={shippingPrice}
                    totalPriceForReviewDisplay={totalPriceForReviewDisplay}
                    numberOfTickets={numberOfTickets}
                    onIncreaseTickets={onIncreaseTickets}
                    onDecreaseTickets={onDecreaseTickets}
                    availableTickets={availableTickets}
                />
            );
        default:
            throw new Error('Unknown step');
    }
}

export default function Checkout(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const {
        eventTitle: passedEventTitle,
        ticketPrice: passedTicketPrice,
        eventId: passedEventId,
        availableTickets: passedAvailableTickets
    } = location.state || {
        eventTitle: 'Event Ticket',
        ticketPrice: 0,
        eventId: null,
        availableTickets: Infinity
    };

    const actualAvailableTickets = Number(passedAvailableTickets);

    const [numberOfTickets, setNumberOfTickets] = React.useState(1);
    const [activeStep, setActiveStep] = React.useState(0);
    const [bookingError, setBookingError] = React.useState(null); // For API errors
    const [isPlacingOrder, setIsPlacingOrder] = React.useState(false); // For loading state

    const baseTicketPrice = Number(passedTicketPrice) || 0;
    const eventName = passedEventTitle || "Event Ticket";
    const shippingCost = 9.99;


    const subtotalPrice = baseTicketPrice * numberOfTickets;
    const totalPriceForCheckout = subtotalPrice + shippingCost;


    const handleIncreaseTickets = () => {
        setNumberOfTickets(prev => {
            if (prev < actualAvailableTickets) {
                return prev + 1;
            }
            return prev;
        });
    };

    const handleDecreaseTickets = () => {
        setNumberOfTickets(prev => Math.max(1, prev - 1));
    };

    const handleNext = async () => { // Make handleNext async
        setBookingError(null); // Clear previous errors

        if (activeStep === steps.length - 1) { // "Place order" step
            if (!passedEventId || numberOfTickets <= 0) {
                setBookingError("Cannot place order. Event details are missing or ticket quantity is invalid.");
                return;
            }
            setIsPlacingOrder(true);
            try {
                // API call to create booking
                const response = await apiClient.post('/bookings', {
                    eventId: passedEventId,
                    tickets: numberOfTickets,
                });

                // Handle success
                console.log('Booking successful:', response.data);
                setActiveStep(activeStep + 1); // Move to thank you page

            } catch (err) {
                console.error('Booking failed:', err);
                const message = err.response?.data?.error || err.response?.data?.message || "An unexpected error occurred. Please try again.";
                setBookingError(message);
            } finally {
                setIsPlacingOrder(false);
            }
        } else {
            setActiveStep(activeStep + 1); // Move to next step in the form
        }
    };

    const handleBack = () => {
        setBookingError(null); // Clear errors when going back
        setActiveStep(activeStep - 1);
    };

    const handleBackToEvents = () => {
        navigate('/events');
    };

    React.useEffect(() => {
        if (numberOfTickets > actualAvailableTickets && actualAvailableTickets >= 1) {
            setNumberOfTickets(actualAvailableTickets);
        } else if (actualAvailableTickets === 0 && numberOfTickets > 0) {
            setNumberOfTickets(0); // User cannot book any tickets
        } else if (numberOfTickets === 0 && actualAvailableTickets > 0 && activeStep < steps.length) { // Ensure we are not on thank you page
            setNumberOfTickets(1); // Reset to 1 if tickets become available
        }
    }, [actualAvailableTickets, numberOfTickets, activeStep]);


    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <Box sx={{ position: 'fixed', top: '1rem', right: '1rem' }}>
                <ColorModeIconDropdown />
            </Box>

            <Grid
                container
                sx={{
                    height: {
                        xs: '100%',
                        sm: 'calc(100dvh - var(--template-frame-height, 0px))',
                    },
                    mt: {
                        xs: 4,
                        sm: 0,
                    },
                }}
            >
                <Grid
                    size={{ xs: 12, sm: 5, lg: 4 }}
                    sx={{
                        display: { xs: 'none', md: 'flex' },
                        flexDirection: 'column',
                        backgroundColor: 'background.paper',
                        borderRight: { sm: 'none', md: '1px solid' },
                        borderColor: { sm: 'none', md: 'divider' },
                        alignItems: 'start',
                        pt: { xs: 2, sm: 4, md: 6 }, // Adjusted padding top slightly
                        px: { xs: 2, sm: 4, md: 10 },
                        gap: 3, // Adjusted gap
                    }}
                >
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={handleBackToEvents}
                        sx={{ mb: 1, alignSelf: 'flex-start' }} // Adjusted margin bottom
                    >
                        Back to Events
                    </Button>
                    <SitemarkIcon />
                    <Divider sx={{ width: '100%', my: 1 }} /> {/* Added Divider */}

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1,
                            width: '100%',
                            maxWidth: 500,
                        }}
                    >
                        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium' }}>
                            Order Summary
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            You are booking {numberOfTickets} ticket(s) for the event: <strong>{eventName}</strong>.
                        </Typography>
                        <Info
                            totalPrice={
                                activeStep >= 2
                                    ? `$${totalPriceForCheckout.toFixed(2)}`
                                    : `$${subtotalPrice.toFixed(2)}`
                            }
                        />
                    </Box>
                </Grid>
                <Grid
                    size={{ sm: 12, md: 7, lg: 8 }}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        maxWidth: '100%',
                        width: '100%',
                        backgroundColor: { xs: 'transparent', sm: 'background.default' },
                        alignItems: 'start',
                        pt: { xs: 2, sm: 4 },
                        px: { xs: 2, sm: 10 },
                        gap: { xs: 4, md: 8 },
                    }}
                >
                    <Box sx={{ display: { xs: 'block', md: 'none' }, width: '100%', mb: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={handleBackToEvents}
                            sx={{ alignSelf: 'flex-start' }}
                        >
                            Back to Events
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: { sm: 'space-between', md: 'flex-end' },
                            alignItems: 'center',
                            width: '100%',
                            maxWidth: { sm: '100%', md: 600 },
                        }}
                    >
                        <Box
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                alignItems: 'flex-end',
                                flexGrow: 1,
                            }}
                        >
                            <Stepper
                                id="desktop-stepper"
                                activeStep={activeStep}
                                sx={{ width: '100%', height: 40 }}
                            >
                                {steps.map((label) => (
                                    <Step
                                        sx={{ ':first-of-type': { pl: 0 }, ':last-child': { pr: 0 } }}
                                        key={label}
                                    >
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>
                    </Box>
                    <Card sx={{ display: { xs: 'flex', md: 'none' }, width: '100%' }}>
                        <CardContent
                            sx={{
                                display: 'flex',
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div>
                                <Typography variant="subtitle2" gutterBottom>
                                    Selected products
                                </Typography>
                                <Typography variant="body1">
                                    {activeStep >= 2
                                        ? `$${totalPriceForCheckout.toFixed(2)}`
                                        : `$${subtotalPrice.toFixed(2)}`}
                                </Typography>
                            </div>
                            <InfoMobile
                                totalPrice={
                                    activeStep >= 2
                                        ? `$${totalPriceForCheckout.toFixed(2)}`
                                        : `$${subtotalPrice.toFixed(2)}`
                                }
                            />
                        </CardContent>
                    </Card>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1,
                            width: '100%',
                            maxWidth: { sm: '100%', md: 600 },
                            maxHeight: '720px',
                            gap: { xs: 5, md: 'none' },
                        }}
                    >
                        <Stepper
                            id="mobile-stepper"
                            activeStep={activeStep}
                            alternativeLabel
                            sx={{ display: { sm: 'flex', md: 'none' } }}
                        >
                            {steps.map((label) => (
                                <Step
                                    sx={{
                                        ':first-of-type': { pl: 0 },
                                        ':last-child': { pr: 0 },
                                        '& .MuiStepConnector-root': { top: { xs: 6, sm: 12 } },
                                    }}
                                    key={label}
                                >
                                    <StepLabel
                                        sx={{ '.MuiStepLabel-labelContainer': { maxWidth: '70px' } }}
                                    >
                                        {label}
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        {bookingError && activeStep < steps.length && ( // Display error only if not on thank you page
                            <Alert severity="error" sx={{ mt: 2, mb: 1 }}>
                                {bookingError}
                            </Alert>
                        )}
                        {activeStep === steps.length ? (
                            <Stack spacing={2} useFlexGap>
                                <Typography variant="h1">📦</Typography>
                                <Typography variant="h5">Thank you for your order!</Typography>
                                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                    Your order number is
                                    <strong>&nbsp;#140396</strong>. We have emailed your order
                                    confirmation and will update you once its shipped.
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate('/dashboard', { state: { initialView: 'user-profile' } })}
                                    sx={{ alignSelf: 'start', width: { xs: '100%', sm: 'auto' } }}
                                >
                                    Go to my dashboard
                                </Button>
                            </Stack>
                        ) : (
                            <React.Fragment>
                                {getStepContent(
                                    activeStep,
                                    eventName,
                                    baseTicketPrice,
                                    shippingCost,
                                    totalPriceForCheckout,
                                    numberOfTickets,
                                    handleIncreaseTickets,
                                    handleDecreaseTickets,
                                    actualAvailableTickets
                                )}
                                <Box
                                    sx={[
                                        {
                                            display: 'flex',
                                            flexDirection: { xs: 'column-reverse', sm: 'row' },
                                            alignItems: 'end',
                                            flexGrow: 1,
                                            gap: 1,
                                            pb: { xs: 12, sm: 0 },
                                            mt: { xs: 2, sm: 0 },
                                            mb: '60px',
                                        },
                                        activeStep !== 0
                                            ? { justifyContent: 'space-between' }
                                            : { justifyContent: 'flex-end' },
                                    ]}
                                >
                                    {activeStep !== 0 && (
                                        <Button
                                            startIcon={<ChevronLeftRoundedIcon />}
                                            onClick={handleBack}
                                            variant="text"
                                            sx={{ display: { xs: 'none', sm: 'flex' } }}
                                            disabled={isPlacingOrder}
                                        >
                                            Previous
                                        </Button>
                                    )}
                                    {activeStep !== 0 && (
                                        <Button
                                            startIcon={<ChevronLeftRoundedIcon />}
                                            onClick={handleBack}
                                            variant="outlined"
                                            fullWidth
                                            sx={{ display: { xs: 'flex', sm: 'none' } }}
                                            disabled={isPlacingOrder}
                                        >
                                            Previous
                                        </Button>
                                    )}
                                    <Button
                                        variant="contained"
                                        endIcon={activeStep === steps.length - 1 ? null : <ChevronRightRoundedIcon />}
                                        onClick={handleNext}
                                        sx={{ width: { xs: '100%', sm: 'fit-content' } }}
                                        disabled={isPlacingOrder || (numberOfTickets === 0 && actualAvailableTickets === 0)}
                                    >
                                        {isPlacingOrder && activeStep === steps.length - 1 ? (
                                            <CircularProgress size={24} color="inherit" />
                                        ) : (
                                            activeStep === steps.length - 1 ? 'Place order' : 'Next'
                                        )}
                                    </Button>
                                </Box>
                            </React.Fragment>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </AppTheme>
    );
}