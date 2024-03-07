# Next.js App with PostgreSQL Database and Rutter API Integration

This repository contains a Next.js application integrated with a PostgreSQL database and Rutter API. Follow the instructions below to set up the environment, configure the required variables, set up the database with Prisma, and run/build the application for development and production.

## Live Demo

[https://api-integration.makarandmadhavi.me/](https://api-integration.makarandmadhavi.me/)
username: accountingtest@test.com
password: 123456

## Installation

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/your-username/your-repository.git
    ```

2. Navigate to the project directory:

    ```bash
    cd your-repository
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

## Environment Variables for Rutter

To integrate with Rutter API, you need to set the following environment variables:

- `RUTTER_CLIENT_ID`: Your Rutter API key.
- `RUTTER_CLIENT_SECRET`: Your Rutter secret key.
- `NEXT_PUBLIC_RUTTER_PUBLIC_KEY`: Public key from Rutter
- `RUTTER_URL`: base Rutter api url

Ensure you have these variables set either in a `.env` file or as system environment variables.

## Setting Up Database with Prisma

1. Make sure you have PostgreSQL installed and running on your system.

2. Create a new PostgreSQL database for the application.

3. Copy the `.env.example` file to `.env`:

    ```bash
    cp .env.example .env
    ```

4. Edit the `.env` file and provide your PostgreSQL connection URL:

    ```dotenv
    DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
    ```

5. Run the Prisma migration to set up the database schema:

    ```bash
    npx prisma migrate dev
    ```

## Running and Building for Development

To run the application in development mode:

```bash
npm run dev
```

The application will start on `http://localhost:3000`.

## Running and Building for Production

To build the application for production:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

The application will be available on the configured port for production usage.

## Additional Notes

- Make sure all necessary dependencies are installed before running or building the application.
- Ensure you have proper access and permissions set up for the database.
- Keep your Rutter API credentials secure and do not expose them publicly.
- For more detailed information on Next.js, PostgreSQL, Prisma, and Rutter API, refer to their respective documentation.

Feel free to reach out if you encounter any issues or need further assistance!
