# Full Stack Developer - Test Solution

This project implements a comprehensive system with user and admin functionalities, including account management, shopping, and product management. The project uses MongoDB for the database, Node.js for the backend, and React.js for the frontend.

## Table of Contents

- [Features](#features)
  - [User Functionalities](#user-functionalities)
  - [Admin Functionalities](#admin-functionalities)
- [Project Requirements](#project-requirements)
- [Setup Instructions](#setup-instructions)
- [Deployment](#deployment)
- [License](#license)

## Features

### User Functionalities

1. **Account Management:**

   - [x] Create an account (Register).
   - [x] Sign in.
   - [ ] View personal information.
   - [ ] Modify personal information.
   - [ ] Change password.

2. **Shopping:**
   - [ ] Add a product to the cart.
   - [ ] Make a purchase using the Stripe payment gateway (developer test mode).

### Admin Functionalities

1. **User Management:**

   - [x] View information of all users.
   - [x] Modify user's information.
   - [x] Delete a user from the site.
   - [x] Promote a user to administrator (admin).

2. **Role Management:**

   - [x] Create new roles.
   - [x] Manage roles in a roles table.

3. **Product Management:**
   - [x] Create a product (product name, price, description).

## Project Requirements

- **Database:** MongoDB
- **Backend:** Node.js
- **Frontend:** React.js

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone https://github.com/abubkr-hago/full-stack-developer-test
   ```
2. **Install dependencies:**
   ```
   cd full-stack-developer-test
   npm install
   ```
3. **Set up environment variables:**

   Create a .env file in the directory with the following content:

   ```
   MONGODB_URI=your_mongodb_uri
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

4. **Run tests:**
   ```
   npm test
   ```

## Deployment

The project has been deployed to Vercel. You can access it using the following link:

- [ ] [Vercel link](/#)

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.
