# AstrumU's Test Assessment repo

## Task:

There is a JSON file that has a list of universities. Imagine that this is a regular database. Please, implement an API using Nest JS (feel free to use Nest CLI - https://docs.nestjs.com) and GraphQL so it can expose the following queries:

- GET a list of universities
- GET university by id

Also, there should be the following mutations:

- CREATE university (only for authorized users)
- UPDATE university (only for authorized users)

Please note that each of the universities has a `city` and `city` has a `state.` So there might be some complexity.

## Instructions

### Prerequisites

Please make sure that Node.js (>= 10.13.0, except for v13) is installed on your operating system.

### Setup

Run `npm i` to install node modules

Now you can run `npm run start` at your OS command prompt to start the application listening for inbound HTTP requests

Server is configured to be run on port 3000:

http://localhost:3000/

### Authentication (uses JWT)

- Endpoint:

http://localhost:3000/auth/login

- Method:

POST

- Body:

    - For a manager user

        (Authorized to access create and update mutations)

        use:

        `{"username": "Jared", "password": "password2"}`

    - For a regular user

        (Can be authenticated, but is not authorized to access create and update mutations)

        use:

        `{"username": "Jack", "password": "password1"}`

- Response:

    `{ "access_token": "<token>" }`

### GraphQL Playground is accessible at

http://localhost:3000/graphql

- **You need to add**

    `Authorization: Bearer <token>`

    header while accessing mutations

### Running end-to-end tests

Run `npm run test:e2e` to execute the end-to-end tests
