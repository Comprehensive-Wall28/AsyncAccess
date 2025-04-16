# AsyncAccess API Documentation

This document provides a basic overview of the AsyncAccess backend API endpoints, models, and core functionalities.

## Table of Contents

1.  [Overview](#overview)
2.  [API Endpoints](#api-endpoints)
    *   [Authentication (`/api/v1`)](#authentication-apiv1)
    *   [Users (`/api/v1/users`)](#users-apiv1users)
    *   [Events (`/api/v1/events`)](#events-apiv1events)
    *   [Bookings (`/api/v1/bookings`)](#bookings-apiv1bookings)
3.  [Server Setup](#server-setup)
4.  [Error Handling](#error-handling)
---

## Overview

The AsyncAccess API provides endpoints for managing users (including authentication and roles), events (creation, approval, management), and bookings (creation, cancellation). It uses JWT for authentication and role-based authorization for access control.

**Base URL:** `/api/v1`

**Authentication:** Most endpoints require authentication via a JWT token sent as an HTTP-only cookie named `token`.

**Authorization Roles:**
*   `User`: Can register, log in, manage their profile, view approved events, create/cancel their own bookings, view their own bookings.
*   `Organizer`: All `User` permissions, plus can create events (pending approval), view/manage/delete their own events, view analytics for their events, view their created events.
*   `Admin`: All permissions, including managing all users (roles, deletion), approving/rejecting events, deleting any event, viewing pending events, and deleting cancelled bookings.

---

## API Endpoints

All endpoints are prefixed with `/api/v1`.

### Authentication (`/api/v1`)

Handles user registration, login, and password management. Corresponds to `routes/authRoutes.js` and `controllers/userControllers.js`.

*   **`POST /register`**
    *   **Description:** Registers a new user.
    *   **Auth:** None required.
    *   **Controller:** `userController.register`
    *   **Body:** `{ "name": "...", "email": "...", "password": "...", "role": "User|Organizer|Admin", "age": (optional) }`
    *   **Response:** `201 Created` - Success message. `400 Bad Request` - Missing fields/Invalid role. `409 Conflict` - User already exists. `500 Server Error`.

*   **`POST /login`**
    *   **Description:** Logs in a user and sets the auth cookie.
    *   **Auth:** None required.
    *   **Controller:** `userController.login`
    *   **Body:** `{ "email": "...", "password": "..." }`
    *   **Response:** `200 OK` - Success message, user details (excluding password), sets `token` cookie. `400 Bad Request` - Missing fields/Incorrect password. `404 Not Found` - User not found. `500 Server Error`.

*   **`PUT /update-password`**
    *   **Description:** Allows a logged-in user to change their password.
    *   **Auth:** Required (Any role: User, Organizer, Admin).
    *   **Controller:** `userController.updatePasswordLoggedIn`
    *   **Body:** `{ "oldPassword": "...", "newPassword": "..." }`
    *   **Response:** `200 OK` - Success message. `400 Bad Request` - Missing fields/Incorrect old password. `404 Not Found` - User not found. `500 Server Error`.

*   **`POST /forgetPassword`**
    *   **Description:** (Step 1) Sends a password reset code to the user's email if the account exists.
    *   **Auth:** None required.
    *   **Controller:** `userController.requestPasswordReset`
    *   **Body:** `{ "email": "..." }`
    *   **Response:** `200 OK` - Generic success message (to prevent email enumeration). `400 Bad Request` - Email missing. `500 Internal Server Error` - Email sending failed or other server error.

*   **`PUT /reset-password`**
    *   **Description:** (Step 2) Resets the user's password using the code sent via email.
    *   **Auth:** None required.
    *   **Controller:** `userController.resetPassword`
    *   **Body:** `{ "email": "...", "code": "...", "newPassword": "..." }`
    *   **Response:** `200 OK` - Success message. `400 Bad Request` - Missing fields/Invalid or expired code. `500 Server Error`.

### Users (`/api/v1/users`)

Endpoints for managing user profiles and administrative user actions. All require authentication via `authenticationMiddleware`. Corresponds to `routes/userRoutes.js` and uses controllers from `userControllers.js`, `bookingController.js`, `eventController.js`.

*   **`GET /profile`**
    *   **Description:** Gets the profile (`_id`, `name`, `email`, `role`, `age`) of the currently logged-in user.
    *   **Auth:** Required (Role: User, Organizer, Admin).
    *   **Controller:** `userController.getCurrentUser`
    *   **Response:** `200 OK` - User object (selected fields only). `404 Not Found` - User not found. `500 Server Error`.

*   **`PUT /profile`**
    *   **Description:** Updates the profile (name, age, profilePicture) of the currently logged-in user.
    *   **Auth:** Required (Role: User, Organizer, Admin).
    *   **Controller:** `userController.updateCurrentUserProfile`
    *   **Body:** `{ "name": (optional), "age": (optional), "profilePicture": (optional) }`
    *   **Response:** `200 OK` - Updated user object (excluding password). `400 Bad Request` - No valid fields/Validation error. `404 Not Found` - User not found. `500 Server Error`.

*   **`GET /bookings`**
    *   **Description:** Gets all bookings made by the currently logged-in user.
    *   **Auth:** Required (Role: User).
    *   **Controller:** `bookingController.getMyBookings`
    *   **Response:** `200 OK` - Array of booking objects. `404 Not Found` - No bookings found. `500 Server Error`.

*   **`GET /events`**
    *   **Description:** Gets all events created by the currently logged-in organizer (selected fields only).
    *   **Auth:** Required (Role: Organizer).
    *   **Controller:** `eventController.getMyEvents`
    *   **Response:** `200 OK` - Array of event objects. `500 Server Error`.

*   **`GET /events/analytics`**
    *   **Description:** Gets analytics (ticket sales, percentages) for events created by the currently logged-in organizer.
    *   **Auth:** Required (Role: Organizer).
    *   **Controller:** `eventController.getEventAnalytics`
    *   **Response:** `200 OK` - Array of event analytics objects. `404 Not Found` - No events found for analytics. `500 Server Error`.

*   **`GET /`**
    *   **Description:** Gets a list of all users (Admin only).
    *   **Auth:** Required (Role: Admin).
    *   **Controller:** `userController.getAllUsers`
    *   **Response:** `200 OK` - Array of user objects (excluding passwords). `404 Not Found` - No users exist. `500 Server Error`.

*   **`GET /:id`**
    *   **Description:** Gets a specific user by ID (Admin only).
    *   **Auth:** Required (Role: Admin).
    *   **Controller:** `userController.getUser`
    *   **Params:** `id` - User ID.
    *   **Response:** `200 OK` - User object (excluding password). `404 Not Found` - User not found. `500 Server Error`.

*   **`PUT /:id`**
    *   **Description:** Updates the role of a specific user by ID (Admin only).
    *   **Auth:** Required (Role: Admin).
    *   **Controller:** `userController.updateUserById`
    *   **Params:** `id` - User ID.
    *   **Body:** `{ "role": "User|Organizer|Admin" }`
    *   **Response:** `200 OK` - Updated user object (excluding password). `400 Bad Request` - Invalid/Missing role or validation error. `404 Not Found` - User not found. `500 Server Error`.

*   **`DELETE /:id`**
    *   **Description:** Deletes a specific user by ID (Admin only). Cascades deletions: If Organizer, deletes their events and associated bookings. If User, returns tickets from their *confirmed* bookings to the respective events, then deletes all their bookings.
    *   **Auth:** Required (Role: Admin).
    *   **Controller:** `userController.deleteUser` (calls `userController.deleteUserData` for cascade)
    *   **Params:** `id` - User ID.
    *   **Response:** `200 OK` - Success message including cascade details, deleted user object (`_id`, `email`, `role`). `404 Not Found` - User not found. `500 Server Error`.

### Events (`/api/v1/events`)

Endpoints for managing events. Corresponds to `routes/eventRoutes.js` and `controllers/eventController.js`.

*   **`GET /`**
    *   **Description:** Gets a list of all *approved* events, sorted by creation date.
    *   **Auth:** None required.
    *   **Controller:** `eventController.getAllEvents`
    *   **Response:** `200 OK` - Array of approved event objects.

*   **`POST /`**
    *   **Description:** Creates a new event (status defaults to 'pending', `bookedTickets` to 0).
    *   **Auth:** Required (Role: Organizer).
    *   **Controller:** `eventController.createEvent`
    *   **Body:** `{ "title": "...", "description": "...", "date": "...", "location": "...", "category": ["..."], "ticketPrice": ..., "totalTickets": ..., "image": (optional) }`
    *   **Response:** `201 Created` - New event object (pending approval). `400 Bad Request` - Missing/Invalid fields (e.g., negative tickets/price, zero total tickets). `500 Server Error` (passed via `next(err)`).

*   **`GET /review`**
    *   **Description:** Gets a list of all *pending* events for admin review, sorted by creation date.
    *   **Auth:** Required (Role: Admin).
    *   **Controller:** `eventController.getAllEventsAdmin`
    *   **Response:** `200 OK` - Array of pending event objects.

*   **`GET /:id`**
    *   **Description:** Gets details of a specific event by ID.
    *   **Auth:** None required.
    *   **Controller:** `eventController.getEvent`
    *   **Params:** `id` - Event ID.
    *   **Response:** `200 OK` - Event object. `404 Not Found` - Invalid ID or event not found.

*   **`PUT /:id`**
    *   **Description:** Updates an event's details. Only `totalTickets`, `date`, `location` can be updated. Only the owning Organizer can update their event (even if the requester is Admin).
    *   **Auth:** Required (Role: Organizer, Admin).
    *   **Controller:** `eventController.updateEvent`
    *   **Params:** `id` - Event ID.
    *   **Body:** `{ "totalTickets": (optional), "date": (optional), "location": (optional) }`
    *   **Response:** `200 OK` - Updated event object. `400 Bad Request` - Trying to update protected fields. `403 Forbidden` - Not the owner. `404 Not Found` - Invalid ID or event not found. `500 Server Error` (passed via `next(err)`).

*   **`DELETE /:id`**
    *   **Description:** Deletes an event by ID. Cascades to delete associated bookings via `deleteBookingData`. Only the owning Organizer or an Admin can delete. Admins bypass the ownership check.
    *   **Auth:** Required (Role: Organizer, Admin).
    *   **Controller:** `eventController.deleteEvent`
    *   **Params:** `id` - Event ID.
    *   **Response:** `200 OK` - Success message, details of deleted event (`id`, `title`). `400 Bad Request` - Invalid ID. `403 Forbidden` - Not the owner (if requesting user is Organizer). `404 Not Found` - Event not found. `500 Server Error`.

*   **`PUT /:id/status`**
    *   **Description:** Approves or rejects a pending event (Admin only).
    *   **Auth:** Required (Role: Admin).
    *   **Controller:** `eventController.approveEvent`
    *   **Params:** `id` - Event ID.
    *   **Body:** `{ "status": "approved|rejected" }`
    *   **Response:** `200 OK` - Updated event object with new status. `400 Bad Request` - Invalid status value or event already in that status. `404 Not Found` - Event not found. `500 Server Error` (passed via `next(err)`).

### Bookings (`/api/v1/bookings`)

Endpoints for managing event bookings. Corresponds to `routes/bookingRoutes.js` and `controllers/bookingController.js`.

*   **`POST /`**
    *   **Description:** Creates a new booking for an event. Checks for existing active bookings by the same user for the same event. Updates event's `bookedTickets`.
    *   **Auth:** Required (Role: User).
    *   **Controller:** `bookingController.createBooking`
    *   **Body:** `{ "eventId": "...", "tickets": ... }`
    *   **Response:** `201 Created` - New booking object (`bookingStatus: 'Confirmed'`). `400 Bad Request` - Missing fields, invalid ID/tickets, event not approved, not enough tickets. `404 Not Found` - Event not found. `409 Conflict` - User already has an active booking for this event. `500 Server Error`.

*   **`GET /:id`**
    *   **Description:** Gets details of a specific booking by ID. *Note: Does not check if the booking belongs to the requesting user.*
    *   **Auth:** Required (Role: User).
    *   **Controller:** `bookingController.getBookingById`
    *   **Params:** `id` - Booking ID.
    *   **Response:** `200 OK` - Booking object. `404 Not Found` - Invalid ID or booking not found. `500 Server Error`.

*   **`DELETE /:id`**
    *   **Description:** Cancels a booking by ID (sets `bookingStatus` to 'Cancelled'). Only the user who made the booking can cancel it. Decrements event's `bookedTickets`.
    *   **Auth:** Required (Role: User).
    *   **Controller:** `bookingController.cancelBooking`
    *   **Params:** `id` - Booking ID.
    *   **Response:** `200 OK` - Success message. `403 Forbidden` - Trying to cancel another user's booking. `404 Not Found` - Invalid ID or booking not found. `500 Server Error`.

*   **`DELETE /delete-cancelled`**
    *   **Description:** Permanently deletes all bookings with status 'Cancelled' (Admin only).
    *   **Auth:** Required (Role: Admin).
    *   **Controller:** `bookingController.deleteCancelledBookings`
    *   **Response:** `200 OK` - Message indicating the number of deleted bookings. `500 Server Error`.

---

## Server Setup (`server.js`)

*   **Environment Variables:** Requires `.env` file with `MONGODB_URI`, `SECRET_KEY`, and optionally `PORT`, `ORIGIN`, and email configuration (`EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_SECURE`, `EMAIL_FROM`) for password reset functionality. Checks for critical variables on startup. Logs warning if email variables are missing.
*   **Middleware:** Uses `cors` (configurable origin via `ORIGIN` env var, defaults to `http://localhost:3000`, allows credentials), `express.json`, `express.urlencoded`, `cookie-parser`.
*   **Database:** Connects to MongoDB using Mongoose via `config/database.js`.
*   **Routers:** Mounts authentication (`/api/v1`), user (`/api/v1/users`), event (`/api/v1/events`), and booking (`/api/v1/bookings`) routes.
*   **Port:** Runs on `process.env.PORT` or defaults to `5000`.
*   **Root Route:** Includes a basic `GET /` route for health check.

---

## Error Handling

*   A generic error handler middleware is included at the end of `server.js`.
*   It catches unhandled errors (including those passed via `next(err)` from controllers), logs the stack trace to the console, and sends a `500 Internal Server Error` response with a generic message and the error details (`err.message`).
*   Specific endpoints include validation and return appropriate `4xx` status codes for client errors (e.g., `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`) as detailed in the endpoint descriptions above.
*   Controllers often include `try...catch` blocks to handle specific errors and return relevant status codes and messages, or pass errors to the generic handler using `next(err)`.

