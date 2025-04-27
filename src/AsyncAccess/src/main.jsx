import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Import WebTUI base styles, utilities, components, theme, and plugins
import '@webtui/css/base.css';
import '@webtui/css/utils/box.css'; // For box styling
import '@webtui/css/components/button.css'; // For buttons
import '@webtui/css/components/typography.css'; // For h1, p, code, etc.
import '@webtui/theme-catppuccin'; // Catppuccin theme
import "@webtui/plugin-nf"; // Nerd Font plugin (adds icons/styles)

/**
 * Main application component for the AsyncAccess Ticket Booking homepage.
 */
function App() {
  // Handler for the Sign In button (does nothing for now)
  const handleSignInClick = () => {
    console.log("Sign In button clicked");
    // Future implementation: Open modal, navigate to sign-in page, etc.
  };

  return (
    // Apply the catppuccin-mocha theme globally
    <div data-webtui-theme="catppuccin-mocha" className="flex flex-col min-h-screen">

      {/* Top Bar */}
      <nav box-="plain" className="w-full p-3 flex justify-between items-center bg-color-base border-b border-color-overlay">
        {/* Logo/Brand Name */}
        <div className="text-lg font-bold text-color-mauve">
          <i className="nf nf-fa-ticket mr-2"></i> {/* Nerd Font Icon */}
          AsyncAccess Tickets
        </div>
        {/* Sign In Button */}
        {/* Using 'overlay' variant for a lighter appearance, adjust as needed */}
        <button variant-="overlay" box-="round" onClick={handleSignInClick}>
          Sign In
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex flex-grow items-center justify-center p-4 md:p-8">
          {/* Main content container using WebTUI box styling */}
          <div box-="round" className="w-full max-w-3xl p-6 md:p-10 shadow-lg">

            {/* Header Section */}
            <header className="text-center mb-6 md:mb-8">
              {/* Main Title with Nerd Font icon */}
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                <i className="nf nf-fa-calendar_check_o mr-2 text-color-green"></i> {/* Nerd Font Icon */}
                Book Your Next Event
              </h1>
              {/* Subtitle */}
              <p className="text-color-subtle">
                Simple, Fast, and Secure Ticket Booking.
              </p>
            </header>

            {/* Divider */}
            <hr divider-="solid" className="my-6 md:my-8" />

            {/* Introduction Section */}
            <section className="mb-6 md:mb-8">
              <p className="mb-4">
                Welcome to AsyncAccess Tickets! Find and book tickets for concerts,
                sports, theater, and more. Our terminal-inspired interface makes booking
                quick and easy.
              </p>
              <p>
                Browse upcoming events, select your seats, and complete your purchase
                securely. Get started now or check out the{' '}
                {/* Inline code styling */}
                <code className="text-color-sky">event schedule</code>.
              </p>
            </section>

            {/* Features Section (Updated for Ticket Booking) */}
            <section className="mb-6 md:mb-8">
               <h2 className="text-xl font-semibold mb-3 text-color-blue">Why Choose Us?</h2>
               <ul className="list-disc list-inside space-y-1 text-color-overlay">
                 <li><i className="nf nf-fa-search mr-1 text-color-sapphire"></i> Wide Selection of Events</li>
                 <li><i className="nf nf-fa-bolt mr-1 text-color-sapphire"></i> Fast & Easy Booking Process</li>
                 <li><i className="nf nf-fa-lock mr-1 text-color-sapphire"></i> Secure Payment Gateway</li>
                 <li><i className="nf nf-fa-mobile mr-1 text-color-sapphire"></i> Mobile Tickets Available</li>
                 <li><i className="nf nf-fa-life_ring mr-1 text-color-sapphire"></i> Dedicated Customer Support</li>
               </ul>
            </section>

            {/* Divider */}
            <hr divider-="dashed" className="my-6 md:my-8" />

            {/* Call to Action Section */}
            <footer className="text-center">
              <p className="mb-4 text-color-subtle">Ready to find your next experience?</p>
              {/* Button Group */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
                {/* WebTUI buttons with theme variants and box styles */}
                <button variant-="success" box-="round">
                  <i className="nf nf-fa-search mr-1"></i> Browse Events
                </button>
                <button variant-="info" box-="round">
                  <i className="nf nf-fa-question_circle mr-1"></i> How It Works
                </button>
                 <button variant-="warning" box-="round">
                  <i className="nf nf-fa-envelope mr-1"></i> Contact Us
                </button>
              </div>
            </footer>

          </div> {/* End main content box */}
      </main> {/* End Main Content Area */}

    </div> // End theme container
  );
}

// Find the root element in your HTML (ensure you have <div id="root"></div>)
const container = document.getElementById('root');

// Create a root and render the App component
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  console.error("Root element #root not found in the HTML.");
}