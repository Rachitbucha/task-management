# Task Management System

This API provides functionality for managing tasks in a simple task management system. Users can register, log in, and perform CRUD (Create, Read, Update, Delete) operations on tasks.

## Technologies Used

- Node.js: Server-side JavaScript runtime environment.
- Express.js: Web framework for Node.js, providing routing and middleware capabilities.
- MongoDB: NoSQL database for storing task and user data.
- JSON Web Tokens (JWT): Stateless authentication mechanism for securing API endpoints.
- Express Validator: Middleware for validating and sanitizing input data in Express.js applications.
- Bcrypt.js: Library for hashing passwords securely.

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:rachitbucha/task-management.git
   cd task-management

   ```

2. Install dependencies

   ```npm install

   ```

3. Install and set up MongoDBMongoDb Installation

   - Follow the MongoDB installation instructions:
     https://www.mongodb.com/docs/manual/installation/

4. Setting Environment Variables:
   - copy .env.example and create .env from example

5. Start the project
   - npm run start


## DEBUG

    {
        "version": "0.2.0",
        "configurations": [
            {
                "type": "node",
                "request": "launch",
                "name": "Launch Program",
                "skipFiles": [
                    "<node_internals>/**"
                ],
                "program": "${workspaceFolder}/src/index.js"
            }
        ]
    }
