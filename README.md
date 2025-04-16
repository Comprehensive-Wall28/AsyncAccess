# AsyncAccess API Documentation

This document provides a basic overview of the AsyncAccess backend API endpoints, models, and core functionalities.

## Table of Contents

1.  [Overview](#overview)
2.  [API Endpoints](#api-endpoints)
    *   [Authentication (`/api/v1`)](#authentication-apiv1)
    *   [Users (`/api/v1/users`)](#users-apiv1users)
    *   [Events (`/api/v1/events`)](#events-apiv1events)
    *   [Bookings (`/api/v1/bookings`)](#bookings-apiv1bookings)
3.  [Server Setup (`server.js`)](#server-setup-serverjs)
4.  [Error Handling](#error-handling)

---

## Overview

The AsyncAccess API provides endpoints for managing users (including authentication and roles), events (creation, approval, management), and bookings (creation, cancellation). It uses JWT for authentication and role-based authorization for access control.

**Base URL:** `/api/v1`

**Authentication:** Most endpoints require authentication via a JWT token sent as an HTTP-only cookie named `token`.

**Authorization Roles:**
*   `User`: Can register, log in, manage their profile, view approved events, create/cancel their own bookings.
*   `Organizer`: All `User` permissions, plus can create events (pending approval), view/manage/delete their own events, and view analytics for their events.
*   `Admin`: All permissions, including managing all users (roles, deletion), approving/rejecting events, deleting any event, and deleting cancelled bookings.

---

## API Endpoints

All endpoints are prefixed with `/api/v1`.

### Authentication (`/api/v1`)

Handles user registration, login, and password management.

*   **`POST /register`**
    *   **Description:** Registers a new user.
    *   **Auth:** None required.
    *   **Body:** `{ "name": "...", "email": "...", "password": "...", "role": "User|Organizer|Admin", "age": (optional) }`
    *   **Response:** `201 Created` - Success message. `400 Bad Request` - Missing fields/Invalid role. `409 Conflict` - User already exists.

*   **`POST /login`**
    *   **Description:** Logs in a user and sets the auth cookie.
    *   **Auth:** None required.
    *   **Body:** `{ "email": "...", "password": "..." }`
    *   **Response:** `200 OK` - Success message, user details (excluding password), sets `token` cookie. `400 Bad Request` - Missing fields/Incorrect password. `404 Not Found` - User not found.

*   **`PUT /update-password`**
    *   **Description:** Allows a logged-in user to change their password.
    *   **Auth:** Required (Any role).
    *   **Body:** `{ "oldPassword": "...", "newPassword": "..." }`
    *   **Response:** `200 OK` - Success message. `400 Bad Request` - Missing fields/Incorrect old password. `404 Not Found` - User not found.

*   **`POST /forgetPassword`**
    *   **Description:** (Step 1) Sends a password reset code to the user's email if the account exists.
    *   **Auth:** None required.
    *   **Body:** `{ "email": "..." }`
    *   **Response:** `200 OK` - Generic success message (to prevent email enumeration). `400 Bad Request` - Email missing. `500 Internal Server Error` - Email sending failed.

*   **`PUT /reset-password`**
    *   **Description:** (Step 2) Resets the user's password using the code sent via email.
    *   **Auth:** None required.
    *   **Body:** `{ "email": "...", "code": "...", "newPassword": "..." }`
    *   **Response:** `200 OK` - Success message. `400 Bad Request` - Missing fields/Invalid or expired code.

### Users (`/api/v1/users`)

Endpoints for managing user profiles and administrative user actions. All require authentication.

*   **`GET /profile`**
    *   **Description:** Gets the profile of the currently logged-in user.
    *   **Auth:** Required (Any role: User, Organizer, Admin).
    *   **Response:** `200 OK` - User object (excluding password). `404 Not Found` - User not found.

*   **`PUT /profile`**
    *   **Description:** Updates the profile (name, age, profilePicture) of the currently logged-in user.
    *   **Auth:** Required (Any role: User, Organizer, Admin).
    *   **Body:** `{ "name": (optional), "age": (optional), "profilePicture": (optional) }`
    *   **Response:** `200 OK` - Updated user object. `400 Bad Request` - No valid fields/Validation error. `404 Not Found` - User not found.

*   **`GET /bookings`**
    *   **Description:** Gets all bookings made by the currently logged-in user.
    *   **Auth:** Required (Role: User).
    *   **Response:** `200 OK` - Array of booking objects. `404 Not Found` - No bookings found.

*   **`GET /events`**
    *   **Description:** Gets all events created by the currently logged-in organizer.
    *   **Auth:** Required (Role: Organizer).
    *   **Response:** `200 OK` - Array of event objects.

*   **`GET /events/analytics`**
    *   **Description:** Gets analytics (ticket sales, percentages) for events created by the currently logged-in organizer.
    *   **Auth:** Required (Role: Organizer).
    *   **Response:** `200 OK` - Array of event analytics objects. `404 Not Found` - No events found for analytics.

*   **`GET /`**
    *   **Description:** Gets a list of all users (Admin only).
    *   **Auth:** Required (Role: Admin).
    *   **Response:** `200 OK` - Array of user objects (excluding passwords).

*   **`GET /:id`**
    *   **Description:** Gets a specific user by ID (Admin only).
    *   **Auth:** Required (Role: Admin).
    *   **Params:** `id` - User ID.
    *   **Response:** `200 OK` - User object (excluding password). `404 Not Found` - User not found.

*   **`PUT /:id`**
    *   **Description:** Updates the role of a specific user by ID (Admin only).
    *   **Auth:** Required (Role: Admin).
    *   **Params:** `id` - User ID.
    *   **Body:** `{ "role": "User|Organizer|Admin" }`
    *   **Response:** `200 OK` - Updated user object. `400 Bad Request` - Invalid/Missing role. `404 Not Found` - User not found.

*   **`DELETE /:id`**
    *   **Description:** Deletes a specific user by ID and cascades deletions (their events if Organizer, their bookings if User) (Admin only).
    *   **Auth:** Required (Role: Admin).
    *   **Params:** `id` - User ID.
    *   **Response:** `200 OK` - Success message, deleted user object. `404 Not Found` - User not found.

### Events (`/api/v1/events`)

Endpoints for managing events.

*   **`GET /`**
    *   **Description:** Gets a list of all *approved* events.
    *   **Auth:** None required.
    *   **Response:** `200 OK` - Array of approved event objects.

*   **`POST /`**
    *   **Description:** Creates a new event (status defaults to 'pending').
    *   **Auth:** Required (Role: Organizer).
    *   **Body:** `{ "title": "...", "description": "...", "date": "...", "location": "...", "category": ["..."], "ticketPrice": ..., "totalTickets": ..., "image": (optional) }`
    *   **Response:** `201 Created` - New event object (pending approval). `400 Bad Request` - Missing/Invalid fields.

*   **`GET /:id`**
    *   **Description:** Gets details of a specific event by ID.
    *   **Auth:** None required.
    *   **Params:** `id` - Event ID.
    *   **Response:** `200 OK` - Event object. `404 Not Found` - Invalid ID or event not found.

*   **`PUT /:id`**
    *   **Description:** Updates an event's details (only `totalTickets`, `date`, `location` allowed). Only the owning Organizer can update their event. Admins technically can hit the route but controller logic prevents non-owners from updating.
    *   **Auth:** Required (Role: Organizer, Admin).
    *   **Params:** `id` - Event ID.
    *   **Body:** `{ "totalTickets": (optional), "date": (optional), "location": (optional) }`
    *   **Response:** `200 OK` - Updated event object. `400 Bad Request` - Trying to update protected fields. `403 Forbidden` - Not the owner. `404 Not Found` - Invalid ID or event not found.

*   **`DELETE /:id`**
    *   **Description:** Deletes an event by ID. Cascades to delete associated bookings. Only the owning Organizer or an Admin can delete.
    *   **Auth:** Required (Role: Organizer, Admin).
    *   **Params:** `id` - Event ID.
    *   **Response:** `200 OK` - Success message, details of deleted event. `400 Bad Request` - Invalid ID. `403 Forbidden` - Not the owner (if Organizer). `404 Not Found` - Event not found.

*   **`PUT /:id/status`**
    *   **Description:** Approves or rejects a pending event (Admin only).
    *   **Auth:** Required (Role: Admin).
    *   **Params:** `id` - Event ID.
    *   **Body:** `{ "status": "approved|rejected" }`
    *   **Response:** `200 OK` - Updated event object with new status. `400 Bad Request` - Invalid status value or event already in that status. `404 Not Found` - Event not found.

### Bookings (`/api/v1/bookings`)

Endpoints for managing event bookings.

*   **`POST /`**
    *   **Description:** Creates a new booking for an event.
    *   **Auth:** Required (Role: User).
    *   **Body:** `{ "eventId": "...", "tickets": ... }`
    *   **Response:** `201 Created` - New booking object. `400 Bad Request` - Missing fields, invalid ID/tickets, event not approved, not enough tickets, already booked. `404 Not Found` - Event not found. `409 Conflict` - User already has an active booking for this event.

*   **`GET /:id`**
    *   **Description:** Gets details of a specific booking by ID. *Note: Currently does not check if the booking belongs to the requesting user.*
    *   **Auth:** Required (Role: User).
    *   **Params:** `id` - Booking ID.
    *   **Response:** `200 OK` - Booking object. `404 Not Found` - Invalid ID or booking not found.

*   **`DELETE /:id`**
    *   **Description:** Cancels a booking by ID. Only the user who made the booking can cancel it. Updates event's `bookedTickets`.
    *   **Auth:** Required (Role: User).
    *   **Params:** `id` - Booking ID.
    *   **Response:** `200 OK` - Success message. `403 Forbidden` - Trying to cancel another user's booking. `404 Not Found` - Invalid ID or booking not found.

*   **`DELETE /delete-cancelled`**
    *   **Description:** Permanently deletes all bookings with status 'Cancelled' (Admin only).
    *   **Auth:** Required (Role: Admin).
    *   **Response:** `200 OK` - Message indicating the number of deleted bookings.

---

## Server Setup (`server.js`)

*   **Environment Variables:** Requires `.env` file with `MONGODB_URI`, `SECRET_KEY`, and optionally `PORT`, `ORIGIN`, and email configuration (`EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_SECURE`, `EMAIL_FROM`) for password reset functionality.
*   **Middleware:** Uses `cors`, `express.json`, `express.urlencoded`, `cookie-parser`.
*   **Database:** Connects to MongoDB using Mongoose via `config/database.js`.
*   **Routers:** Mounts authentication, user, event, and booking routes under `/api/v1`.
*   **Port:** Runs on `process.env.PORT` or defaults to `5000`.

---

## Error Handling

*   A generic error handler middleware is included in `server.js`.
*   It catches unhandled errors, logs the stack trace to the console, and sends a `500 Internal Server Error` response with a generic message and the error details.
*   Specific endpoints include validation and return appropriate `4xx` status codes for client errors (e.g., `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`).

