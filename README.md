# AsyncAccess API Documentation

## Table of Contents

1.  [Introduction](#introduction)
    *   [Base URL](#base-url)
    *   [Authentication](#authentication)
    *   [User Roles](#user-roles)
2.  [Server Setup (`server.js`)](#server-setup-serverjs)
3.  Middleware
    *   `authenticationMiddleware`
    *   `authorizationMiddleware`
4.  API Endpoints
    *   Authentication (`/api/v1`)
        *   POST /register
        *   POST /login
        *   PUT /update-password
        *   POST /forgetPassword
        *   PUT /reset-password
    *   Users (`/api/v1/users`)
        *   GET /profile
        *   PUT /profile
        *   GET /
        *   GET /:id
        *   PUT /:id
        *   DELETE /:id
    *   Events (`/api/v1/events`)
        *   POST /
        *   GET /
        *   GET /:id
        *   DELETE /:id
        *   PUT /:id
        *   PUT /:id/status
    *   Bookings (`/api/v1/bookings`)
        *   POST /
        *   GET /:id
        *   DELETE /:id
5.  Error Handling

---

## 1. Introduction

This document describes the REST API for the AsyncAccess Event Booking platform. It allows users to register, log in, manage events (Organizers, Admins), book tickets for events (Users), and manage users (Admins).

### Base URL

All API endpoints described in this document are relative to the following base URL:

`/api/v1`

### Authentication

Most endpoints require authentication. Authentication is handled via JSON Web Tokens (JWT).

1.  Upon successful login (`POST /api/v1/login`), the server sends back an HTTP-only cookie named `token` containing the JWT.
2.  Subsequent requests to protected endpoints must include this cookie. The `authenticationMiddleware` automatically verifies this token.
3.  The JWT payload contains the user's ID and role (`{ user: { userId: '...', role: '...' } }`).

### User Roles

The API defines three user roles with different permissions:

*   `User`: Can view events, book tickets, manage their own profile and bookings.
*   `Organizer`: Can do everything a `User` can, plus create, manage, and delete their own events. Event creation requires Admin approval.
*   `Admin`: Has full access, including managing all users, approving/rejecting events created by Organizers, and deleting any event.

---

## 2. Server Setup (`server.js`)

*   **Framework:** Express.js
*   **Database:** MongoDB (via Mongoose)
*   **Environment Variables:** Uses `dotenv` to load variables (e.g., `PORT`, `DATABASE_URI`, `SECRET_KEY`, `ORIGIN`).
*   **Core Middleware:**
    *   `cors`: Enables Cross-Origin Resource Sharing. Configured to allow requests from `process.env.ORIGIN` (defaults to `http://localhost:3000`) and handle credentials (cookies).
    *   `express.json()`: Parses incoming JSON request bodies.
    *   `express.urlencoded()`: Parses incoming URL-encoded request bodies.
    *   `cookie-parser`: Parses cookies attached to the client request object.
*   **Routing:** Mounts different routers under the `/api/v1` base path:
    *   `/`: Authentication routes (`authRouter`)
    *   `/users`: User management routes (`userRouter`)
    *   `/events`: Event management routes (`eventRouter`)
    *   `/bookings`: Booking management routes (`bookingRouter`)
*   **Root Route (`/`):** A simple health check route returning 'Backend started successfully!'.
*   **Database Connection:** Uses `connectDB` function (defined in `./config/database`) to establish a connection to MongoDB before starting the server.
*   **Port:** Listens on the port specified by `process.env.PORT`.
*   **Global Error Handler:** Includes a final middleware to catch unhandled errors, log them, and send a 500 response.

---

## 3. Middleware

### `authenticationMiddleware`

*   **File:** `middleware/authenticationMiddleware.js`
*   **Purpose:** Protects routes by ensuring the user is logged in.
*   **Logic:**
    1.  Checks if `req.cookies` exists. If not, returns `401 Unauthorized`.
    2.  Extracts the `token` from `req.cookies`. If no token, returns `405 Method Not Allowed` (Note: 401 or 403 might be more conventional here).
    3.  Verifies the JWT using `process.env.SECRET_KEY`.
    4.  If verification fails (invalid or expired token), returns `403 Forbidden`.
    5.  If verification succeeds, attaches the decoded payload (`{ userId, role }`) to `req.user`.
    6.  Calls `next()` to pass control to the next middleware or route handler.

### `authorizationMiddleware`

*   **File:** `middleware/authorizationMiddleware.js`
*   **Purpose:** Restricts access to routes based on user roles.
*   **Usage:** Applied *after* `authenticationMiddleware`. It's a factory function that takes an array of allowed roles.
    ```javascript
    // Example: Allow only Admins
    router.get('/', authorizationMiddleware(['Admin']), userController.getAllUsers);

    // Example: Allow Admins and Organizers
    router.put('/:id', authorizationMiddleware(['Admin', 'Organizer']), eventController.updateEvent);
    ```
*   **Logic:**
    1.  Retrieves the user's role from `req.user.role` (set by `authenticationMiddleware`).
    2.  Checks if the `userRole` is included in the `roles` array passed to the middleware.
    3.  If the role is *not* included, returns `403 Forbidden`.
    4.  If the role *is* included, calls `next()`.

---

## 4. API Endpoints

### Authentication (`/api/v1`)

Routes for user registration, login, and password management.

---

#### **POST** /register

*   **Description:** Registers a new user.
*   **Controller:** `userController.register`
*   **Request Body:**
    ```json
    {
      "name": "Name",
      "email": "test@example.com",
      "password": "yourpassword",
      "role": "User", // Or "Organizer", "Admin"
      "age": 30 // Optional
    }
    ```
*   **Required Fields:** `name`, `email`, `password`, `role`.
*   **Success Response:**
    *   **Code:** `201 Created`
    *   **Body:**
        ```json
        {
          "message": "User registered successfully"
        }
        ```
*   **Error Responses:**
    *   `400 Bad Request`: Missing required fields or invalid role.
    *   `409 Conflict`: User with the provided email already exists.
    *   `500 Internal Server Error`: Server error during registration.

---

#### **POST** /login

*   **Description:** Logs in an existing user and sets an authentication cookie.
*   **Controller:** `userController.login`
*   **Request Body:**
    ```json
    {
      "email": "john.doe@example.com",
      "password": "yourpassword"
    }
    ```
*   **Required Fields:** `email`, `password`.
*   **Success Response:**
    *   **Code:** `200 OK`
    *   **Cookie:** Sets `token` (HttpOnly).
    *   **Body:**
        ```json
        {
          "message": "Logged in successfully",
          "user": {
            "_id": "...",
            "name": "John Doe",
            "email": "john.doe@example.com",
            "role": "User",
            "age": 30
            // Password is NOT included
          }
        }
        ```
*   **Error Responses:**
    *   `400 Bad Request`: Incorrect password.
    *   `404 Not Found`: User with the provided email does not exist or missing email/password in request.
    *   `500 Internal Server Error`: Server error during login.

---

#### **PUT** /update-password

*   **Description:** Allows a logged-in user to change their password.
*   **Controller:** `userController.updatePasswordLoggedIn`
*   **Middleware:** `authenticationMiddleware`
*   **Request Body:**
    ```json
    {
      "oldPassword": "currentpassword",
      "newPassword": "newsecurepassword"
    }
    ```
*   **Required Fields:** `oldPassword`, `newPassword`.
*   **Success Response:**
    *   **Code:** `200 OK`
    *   **Body:**
        ```json
        {
          "message": "Password updated successfully"
        }
        ```
*   **Error Responses:**
    *   `400 Bad Request`: Missing fields or incorrect `oldPassword`.
    *   `401 Unauthorized`: User not logged in (missing/invalid token).
    *   `403 Forbidden`: Invalid token.
    *   `404 Not Found`: User associated with the token not found (should be rare).
    *   `500 Internal Server Error`: Server error during password update.

---

#### **POST** /forgetPassword

*   **Description:** (Forgot Password Step 1) Sends a password reset code to the user's email if the email exists in the database.
*   **Controller:** `userController.requestPasswordReset`
*   **Request Body:**
    ```json
    {
      "email": "user@example.com"
    }
    ```
*   **Required Fields:** `email`.
*   **Success Response:**
    *   **Code:** `200 OK`
    *   **Body:** (Generic message for security)
        ```json
        {
          "message": "If an account with that email exists, a password reset code has been sent."
        }
        ```
*   **Error Responses:**
    *   `400 Bad Request`: Email field is missing.
    *   `500 Internal Server Error`: Server error or error sending email.

---

#### **PUT** /reset-password

*   **Description:** (Forgot Password Step 2) Resets the user's password using the code sent via email.
*   **Controller:** `userController.resetPassword`
*   **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "code": "123456", // The 6-digit code from the email
      "newPassword": "newsecurepassword"
    }
    ```
*   **Required Fields:** `email`, `code`, `newPassword`.
*   **Success Response:**
    *   **Code:** `200 OK`
    *   **Body:**
        ```json
        {
          "message": "Password has been reset successfully."
        }
        ```
*   **Error Responses:**
    *   `400 Bad Request`: Missing fields, or the code is invalid/expired.
    *   `500 Internal Server Error`: Server error during password reset.

---

### Users (`/api/v1/users`)

Routes for managing user profiles and (for Admins) managing other users. **All routes in this section require authentication.**

---

#### **GET** /profile

*   **Description:** Gets the profile information of the currently logged-in user.
*   **Controller:** `userController.getCurrentUser`
*   **Middleware:** `authenticationMiddleware`, `authorizationMiddleware(['Admin', 'Organizer', 'User'])`
*   **Success Response:**
    *   **Code:** `200 OK`
    *   **Body:** (Example for a User)
        ```json
        {
          "_id": "user_id_123",
          "name": "Current User Name",
          "email": "current.user@example.com",
          "role": "User",
          "age": 28
        }
        ```
*   **Error Responses:**
    *   `401 Unauthorized`: User not logged in.
    *   `403 Forbidden`: Invalid token.
    *   `404 Not Found`: User associated with token not found.
    *   `500 Internal Server Error`: Server error.

---

#### **PUT** /profile

*   **Description:** Updates the profile information (name, age) of the currently logged-in user.
*   **Controller:** `userController.updateCurrentUserProfile`
*   **Middleware:** `authenticationMiddleware`, `authorizationMiddleware(['Admin', 'Organizer', 'User'])`
*   **Request Body:** (Provide only fields to update)
    ```json
    {
      "name": "Updated User Name", // Optional
      "age": 29 // Optional
    }
    ```
*   **Allowed Fields:** `name`, `age`.
*   **Success Response:**
    *   **Code:** `200 OK`
    *   **Body:**
        ```json
        {
          "user": {
            "_id": "user_id_123",
            "name": "Updated User Name",
            "email": "current.user@example.com",
            "role": "User",
            "age": 29
          },
          "msg": "Profile updated successfully"
        }
        ```
*   **Error Responses:**
    *   `400 Bad Request`: No valid fields provided or validation error (e.g., invalid age).
    *   `401 Unauthorized`: User not logged in.
    *   `403 Forbidden`: Invalid token.
    *   `404 Not Found`: User associated with token not found.
    *   `500 Internal Server Error`: Server error.

---

#### **GET** /

*   **Description:** Gets a list of all users (Admin only). Passwords are excluded.
*   **Controller:** `userController.getAllUsers`
*   **Middleware:** `authenticationMiddleware`, `authorizationMiddleware(['Admin'])`
*   **Success Response:**
    *   **Code:** `200 OK`
    *   **Body:**
        ```json
        [
          {
            "_id": "user_id_1",
            "name": "User One",
            "email": "one@example.com",
            "role": "User",
            "age": 30
          },
          {
            "_id": "user_id_2",
            "name": "Admin User",
            "email": "admin@example.com",
            "role": "Admin",
            "age": 40
          }
          // ... other users
        ]
        ```
*   **Error Responses:**
    *   `401 Unauthorized`: User not logged in.
    *   `403 Forbidden`: User is not an Admin or token is invalid.
    *   `404 Not Found`: No users exist (unlikely if admin exists).
    *   `500 Internal Server Error`: Server error.

---

#### **GET** /:id

*   **Description:** Gets a specific user by their ID (Admin only). Password is excluded.
*   **Controller:** `userController.getUser`
*   **Middleware:** `authenticationMiddleware`, `authorizationMiddleware(['Admin'])`
*   **URL Parameters:**
    *   `id`: The MongoDB ObjectId of the user to retrieve.
*   **Success Response:**
    *   **Code:** `200 OK`
    *   **Body:**
        ```json
        {
          "_id": "user_id_to_get",
          "name": "Specific User",
          "email": "specific@example.com",
          "role": "Organizer",
          "age": 35
        }
        ```
*   **Error Responses:**
    *   `401 Unauthorized`: User not logged in.
    *   `403 Forbidden`: User is not an Admin or token is invalid.
    *   `404 Not Found`: User with the specified ID not found.
    *   `500 Internal Server Error`: Server error.

---

#### **PUT** /:id

*   **Description:** Updates the role of a specific user by their ID (Admin only).
*   **Controller:** `userController.updateUserById`
*   **Middleware:** `authenticationMiddleware`, `authorizationMiddleware(['Admin'])`
*   **URL Parameters:**
    *   `id`: The MongoDB ObjectId of the user to update.
*   **Request Body:**
    ```json
    {
      "role": "Organizer" // Must be "Admin", "Organizer", or "User"
    }
    ```
*   **Required Fields:** `role`.
*   **Success Response:**
    *   **Code:** `200 OK`
    *   **Body:**
        ```json
        {
          "user": {
            "_id": "user_id_updated",
            "name": "Specific User",
            "email": "specific@example.com",
            "role": "Organizer", // Updated role
            "age": 35
          },
          "msg": "User role updated successfully by admin"
        }
        ```
*   **Error Responses:**
    *   `400 Bad Request`: `role` field missing or invalid role value provided.
    *   `401 Unauthorized`: User not logged in.
    *   `403 Forbidden`: User is not an Admin or token is invalid.
    *   `404 Not Found`: User with the specified ID not found.
    *   `500 Internal Server Error`: Server error.

---

#### **DELETE** /:id

*   **Description:** Deletes a specific user by their ID (Admin only).
*   **Controller:** `userController.deleteUser`
*   **Middleware:** `authenticationMiddleware`, `authorizationMiddleware(['Admin'])`
*   **URL Parameters:**
    *   `id`: The MongoDB ObjectId of the user to delete.
*   **Success Response:**
    *   **Code:** `200 OK`
    *   **Body:**
        ```json
        {
          "user": {
            // Details of the deleted user
            "_id": "user_id_deleted",
            "name": "Deleted User",
            "email": "deleted@example.com",
            "role": "User",
            "age": 25
          },
          "msg": "User deleted successfully"
        }
        ```
*   **Error Responses:**
    *   `401 Unauthorized`: User not logged in.
    *   `403 Forbidden`: User is not an Admin or token is invalid.
    *   `404 Not Found`: User with the specified ID not found.
    *   `500 Internal Server Error`: Server error.

---

### Events (`/api/v1/events`)

Routes for managing events. **All routes in this section require authentication.**

---

#### **POST** /

*   **Description:** Creates a new event (Organizer only). Events are created with `status: 'pending'` and require Admin approval.
*   **Controller:** `eventController.createEvent`
*   **Middleware:** `authenticationMiddleware`, `authorizationMiddleware(['Organizer'])`
*   **Request Body:**
    ```json
    {
      "title": "Tech Conference 2024",
      "description": "Annual technology conference.",
      "date": "2024-12-15T10:00:00.000Z", // ISO 8601 format
      "location": "Convention Center",
      "category": "Technology",
      "image": "https://example.com/image.jpg", // Optional URL
      "ticketPrice": 50,
      "totalTickets": 500
    }
    ```
*   **Required Fields:** `title`, `description`, `date`, `location`, `category`, `ticketPrice`, `totalTickets`.
*   **Validation:** `ticketPrice` and `totalTickets` must be non-negative. `totalTickets` cannot be 0.
*   **Success Response:**
    *   **Code:** `201 Created`
    *   **Body:**
        ```json
        {
          "status": "success",
          "message": "Event created successfully and pending approval from an Administrator",
          "data": {
            "_id": "event_id_123",
            "title": "Tech Conference 2024",
            "description": "Annual technology conference.",
            "date": "2024-12-15T10:00:00.000Z",
            "location": "Convention Center",
            "category": "Technology",
            "image": "https://example.com/image.jpg",
            "ticketPrice": 50,
            "totalTickets": 500,
            "bookedTickets": 0,
            "organizer": "organizer_user_id",
            "status": "pending",
            "createdAt": "...",
            "updatedAt": "..."
          }
        }
        ```
*   **Error Responses:**
    *   `400 Bad Request`: Missing required fields, invalid ticket numbers/price.
    *   `401 Unauthorized`: User not logged in.
    *   `403 Forbidden`: User is not an Organizer or token is invalid.
    *   `500 Internal Server Error`: Server error.

---

#### **GET** /

*   **Description:** Gets a list of all events. Accessible by all authenticated users.
*   **Controller:** `eventController.getAllEvents`
*   **Middleware:** `authenticationMiddleware`, `authorizationMiddleware(['Admin', 'Organizer', 'User'])`
*   **Success Response:**
    *   **Code:** `200 OK`
    *   **Body:**
        ```json
        [
          {
            "_id": "event_id_1",
            "title": "Event One",
            // ... other event fields
            "status": "approved"
          },
          {
            "_id": "event_id_2",
            "title": "Event Two (Pending)",
            // ... other event fields
            "status": "pending"
          }
          // ... other events
        ]
        ```
*   **Error Responses:**
    *   `401 Unauthorized`: User not logged in.
    *   `403 Forbidden`: Invalid token.
    *   `500 Internal Server Error`: Server error.

---

#### **GET** /:id

*   **Description:** Gets details of a single event by its ID. Accessible by all authenticated users.
*   **Controller:** `eventController.getEvent`
*   **Middleware:** `authenticationMiddleware`, `authorizationMiddleware(['Admin', 'Organizer', 'User'])`
*   **URL Parameters:**
    *   `id`: The MongoDB ObjectId of the event.
*   **Success Response:**
    *   **Code:** `200 OK`
    *   **Body:**
        ```json
        {
          "_id": "event_id_123",
          "title": "Specific Event",
          "description": "Details about the specific event.",
          "date": "2024-11-20T09:00:00.000Z",
          "location": "Specific Venue",
          "category": "Music",
          "ticketPrice": 25,
          "totalTickets": 100,
          "bookedTickets": 15,
          "organizer": "organizer_user_id",
          "status": "approved",
          "createdAt": "...",
          "updatedAt": "..."
        }
        ```
*   **Error Responses:**
    *   `401 Unauthorized`: User not logged in.
    *   `403 Forbidden`: Invalid token.
    *   `404 Not Found`: No event found with the given ID, or invalid ID format.
    *   `500 Internal Server Error`: Server error.

---

#### **DELETE** /:id

*   **Description:** Deletes an event by its ID (Organizer or Admin only). Organizers can likely only delete their own events (though not explicitly checked in controller, authorization implies this).
*   **Controller:** `eventController.deleteEvent`
*   **Middleware:** `authenticationMiddleware`, `authorizationMiddleware(['Organizer', 'Admin'])`
*   **URL Parameters:**
    *   `id`: The MongoDB ObjectId of the event to delete.
*   **Success Response:**
    *   **Code:** `200 OK`
    *   **Body:**
        ```json
        {
          "message": "Event deleted successfully",
          "deletedEvent": {
            "id": "event_id_deleted",
            "title": "Deleted Event Title"
          }
        }
        ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid event ID format.
    *   `401 Unauthorized`: User not logged in.
    *   `403 Forbidden`: User is not an Organizer/Admin or token is invalid.
    *   `404 Not Found`: No event found with the given ID.
    *   `500 Internal Server Error`: Server error.

---

#### **PUT** /:id

*   **Description:** Updates certain fields of an event (Organizer or Admin only). Organizers likely only for their own events.
*   **Controller:** `eventController.updateEvent`
*   **Middleware:** `authenticationMiddleware`, `authorizationMiddleware(['Organizer', 'Admin'])`
*   **URL Parameters:**
    *   `id`: The MongoDB ObjectId of the event to update.
*   **Request Body:** (Provide only fields to update)
    ```json
    {
      "date": "2024-12-16T11:00:00.000Z", // Optional
      "location": "New Location", // Optional
      "totalTickets": 600 // Optional
    }
    ```
*   **Allowed Fields for Update:** `date`, `location`, `totalTickets`. Other fields are protected.
*   **Success Response:**
    *   **Code:** `200 OK`
    *   **Body:**
        ```json
        {
          "status": "success",
          "data": {
            "event": {
              // Full updated event object
              "_id": "event_id_updated",
              "title": "Original Title",
              // ... other fields ...
              "date": "2024-12-16T11:00:00.000Z",
              "location": "New Location",
              "totalTickets": 600,
              "updatedAt": "..."
            }
          }
        }
        ```
*   **Error Responses:**
    *   `400 Bad Request`: Attempting to modify protected fields, or invalid ID format.
    *   `401 Unauthorized`: User not logged in.
    *   `403 Forbidden`: User is not an Organizer/Admin or token is invalid.
    *   `404 Not Found`: No event found with the given ID.
    *   `500 Internal Server Error`: Server error.

---

#### **PUT** /:id/status

*   **Description:** Approves or rejects a pending event (Admin only).
*   **Controller:** `eventController.approveEvent`
*   **Middleware:** `authenticationMiddleware`, `authorizationMiddleware(['Admin'])`
*   **URL Parameters:**
    *   `id`: The MongoDB ObjectId of the event to approve/reject.
*   **Request Body:**
    ```json
    {
      "status": "approved" // Or "rejected"
    }
    ```
*   **Required Fields:** `status`.
*   **Validation:** `status` must be either `approved` or `rejected`.
*   **Success Response:**
    *   **Code:** `200 OK`
    *   **Body:**
        ```json
        {
          "status": "success",
          "data": {
            "event": {
              // Full event object with updated status
              "_id": "event_id_status_updated",
              "title": "Event Title",
              // ... other fields ...
              "status": "approved", // Or "rejected"
              "updatedAt": "..."
            }
          }
        }
        ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid `status` value, or event is already in the target status.
    *   `401 Unauthorized`: User not logged in.
    *   `403 Forbidden`: User is not an Admin or token is invalid.
    *   `404 Not Found`: No event found with the given ID, or invalid ID format.
    *   `500 Internal Server Error`: Server error.

---

### Bookings (`/api/v1/bookings`)

Routes for creating and managing event bookings.

---

#### **POST** /

*   **Description:** Creates a new booking for an event (Authenticated users).
*   **Controller:** `bookingController.createBooking`
*   **Middleware:** `authenticationMiddleware`
*   **Request Body:**
    ```json
    {
      "eventId": "event_id_to_book",
      "tickets": 2 // Number of tickets to book
    }
    ```
*   **Required Fields:** `eventId`, `tickets`.
*   **Validation:**
    *   `eventId` must be a valid ObjectId.
    *   `tickets` must be a positive integer.
    *   Event must exist, be `approved`, and have enough available tickets.
    *   User cannot have another active ('Confirmed') booking for the same event.
*   **Success Response:**
    *   **Code:** `201 Created`
    *   **Body:**
        ```json
        {
          "_id": "booking_id_123",
          "user": "user_id_who_booked",
          "event": "event_id_booked",
          "numberOfTickets": 2,
          "totalPrice": 100, // Calculated as event.ticketPrice * tickets
          "bookingDate": "2024-08-01T12:30:00.000Z",
          "bookingStatus": "Confirmed",
          "createdAt": "...",
          "updatedAt": "..."
        }
        ```
*   **Error Responses:**
    *   `400 Bad Request`: Missing fields, invalid `eventId` format, invalid `tickets` number, event not approved, not enough tickets available.
    *   `401 Unauthorized`: User not logged in.
    *   `403 Forbidden`: Invalid token.
    *   `404 Not Found`: Event with `eventId` not found.
    *   `409 Conflict`: User already has an active booking for this event. Returns `existingBookingId`.
    *   `500 Internal Server Error`: Server error.

---

#### **GET** /:id

*   **Description:** Gets details of a specific booking by its ID (User role only, must be the owner of the booking).
*   **Controller:** `bookingController.getBookingById`
*   **Middleware:** `authenticationMiddleware`, `authorizationMiddleware(['User'])`
*   **URL Parameters:**
    *   `id`: The MongoDB ObjectId of the booking.
*   **Success Response:**
    *   **Code:** `200 OK`
    *   **Body:**
        ```json
        {
          "_id": "booking_id_123",
          "user": "user_id_who_booked", // Should match req.user.userId
          "event": "event_id_booked",
          "numberOfTickets": 2,
          "totalPrice": 100,
          "bookingDate": "2024-08-01T12:30:00.000Z",
          "bookingStatus": "Confirmed",
          "createdAt": "...",
          "updatedAt": "..."
        }
        ```
*   **Error Responses:**
    *   `401 Unauthorized`: User not logged in.
    *   `403 Forbidden`: User is not a 'User' role, token is invalid, or user does not own this booking.
    *   `404 Not Found`: Booking with the specified ID not found, or invalid ID format.
    *   `500 Internal Server Error`: Server error.

---

#### **DELETE** /:id

*   **Description:** Cancels a booking by its ID (User role only, must be the owner of the booking). Updates the event's `bookedTickets` count.
*   **Controller:** `bookingController.cancelBooking`
*   **Middleware:** `authenticationMiddleware`, `authorizationMiddleware(['User'])`
*   **URL Parameters:**
    *   `id`: The MongoDB ObjectId of the booking to cancel.
*   **Success Response:**
    *   **Code:** `200 OK`
    *   **Body:**
        ```json
        {
          "message": "Booking cancelled successfully"
        }
        ```
*   **Error Responses:**
    *   `401 Unauthorized`: User not logged in.
    *   `403 Forbidden`: User is not a 'User' role, token is invalid, or user does not own this booking.
    *   `404 Not Found`: Booking with the specified ID not found, or invalid ID format.
    *   `500 Internal Server Error`: Server error (e.g., error saving booking or event).

---

## 5. Error Handling

*   **Specific Errors:** Controllers return specific status codes (400, 401, 403, 404, 409) with JSON bodies containing an `error` or `message` field explaining the issue.
*   **General Errors:** A global error handler in `server.js` catches any unhandled exceptions that occur during request processing.
    *   It logs the error stack trace to the console.
    *   It returns a `500 Internal Server Error` response to the client.
    *   The response body includes a generic message and the specific error message (`err.message`).

