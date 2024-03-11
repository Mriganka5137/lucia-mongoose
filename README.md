# Next.js 14 Project with Lucia Auth, Mongoose, MongoDB, GitHub, Google OAuth, Email Verification, and Password Reset

This repository contains a Next.js 14 project that incorporates various features and technologies, including Lucia authentication, Mongoose for interacting with MongoDB, GitHub and Google OAuth integration, email verification, and password reset functionality.

## Technologies Used

- **Next.js 14**: The project is built using the latest version of Next.js, a popular React framework for building server-rendered and statically generated applications.
- **Lucia Auth**: Lucia is a modern authentication library used for handling user authentication and session management in this project.
- **Mongoose**: Mongoose is an Object Data Modeling (ODM) library used in this project to interact with MongoDB, a popular NoSQL database.
- **MongoDB**: MongoDB is the database used for storing user data and other application-specific data.
- **GitHub OAuth**: The project integrates with GitHub OAuth, allowing users to sign in or sign up using their GitHub accounts.
- **Google OAuth**: Similarly, the project also supports Google OAuth, enabling users to authenticate using their Google accounts.
- **Email Verification**: Users are required to verify their email addresses before accessing certain features or areas of the application.
- **Password Reset**: The project includes functionality for users to reset their passwords in case they forget them.

## Features

1. **User Authentication**:

   - Users can sign up using their email addresses and passwords.
   - Users can sign in using their registered email addresses and passwords.
   - Users can sign in or sign up using their GitHub or Google accounts (OAuth).

2. **Email Verification**:

   - After signing up, users receive a verification email to confirm their email addresses.
   - Users cannot access certain protected areas or features until they verify their email addresses.

3. **Password Reset**:

   - Users can request a password reset if they forget their passwords.
   - A password reset email is sent to the user's registered email address, containing a secure link for resetting their password.

4. **User Profile**:

   - Users can view and update their profile information, such as their names and profile pictures.

5. **Protected Routes**:

   - Certain routes or areas of the application are protected and only accessible to authenticated users.

6. **MongoDB Integration**:

   - User data, including authentication credentials and profile information, is stored in a MongoDB database using Mongoose.

7. **GitHub Integration**:

   - Users can sign in or sign up using their GitHub accounts through the GitHub OAuth flow.

8. **Google Integration**:
   - Users can sign in or sign up using their Google accounts through the Google OAuth flow.

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository to your local machine.
2. Install the required dependencies by running `npm install` or `yarn install`.
3. Set up a MongoDB database and update the connection string in the project's configuration files.
4. Configure the necessary environment variables for Lucia auth, GitHub OAuth, and Google OAuth.
5. Start the development server by running `npm run dev` or `yarn dev`.
6. Open your web browser and navigate to `http://localhost:3000` to access the application.

For detailed instructions on setting up and configuring the project, please refer to the project's documentation or the README file.

## Contributing

Contributions to this project are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
