# Nest Backend Project

This project is a NestJS application that serves as a backend for managing customer information and interacting with Firebase services.

## Project Structure

```
nest-backend
├── src
│   ├── app.module.ts          # Root module of the application
│   ├── main.ts                # Entry point of the application
│   ├── customers               # Module for customer management
│   │   ├── customers.controller.ts  # Handles incoming requests related to customers
│   │   ├── customers.service.ts     # Contains business logic for managing customers
│   │   ├── customers.module.ts       # Feature module for customers
│   │   └── dto                    # Data Transfer Objects for customer data
│   │       ├── create-customer.dto.ts  # DTO for creating a new customer
│   │       ├── update-customer.dto.ts  # DTO for updating an existing customer
│   │       └── identity-document.dto.ts # DTO for identity document information
│   ├── firebase                  # Module for Firebase integration
│   │   ├── firebase.service.ts   # Service for interacting with Firebase
│   │   └── firebase.module.ts    # Module for Firebase services
│   └── common                    # Common utilities and exceptions
│       ├── exceptions
│       │   └── http-exception.filter.ts # Custom exception filter for HTTP exceptions
│       └── utils
│           └── validation.pipe.ts # Validation pipe for incoming request data
├── package.json                  # npm configuration file
├── tsconfig.json                 # TypeScript configuration file
├── firebase.json                 # Firebase configuration settings
├── .env                          # Environment variables
└── README.md                     # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd nest-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add your Firebase configuration and any other necessary environment variables.

4. **Run the application:**
   ```bash
   npm run start
   ```

## Usage

- The application exposes RESTful APIs for managing customer information.
- You can create, update, and retrieve customer records through the defined endpoints in the `CustomersController`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.