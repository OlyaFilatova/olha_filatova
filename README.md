# AstrumU's Test Assessment repo

## Task:

There is a JSON file that has a list of universities. Imagine that this is a regular database. Please, implement an API using Nest JS (feel free to use Nest CLI - https://docs.nestjs.com) and GraphQL so it can expose the following queries:

- GET a list of universities
- GET university by id

Also, there should be the following mutations:

- CREATE university (only for authorized users)
- UPDATE university (only for authorized users)

Please note that each of the universities has a `city` and `city` has a `state.` So there might be some complexity.
