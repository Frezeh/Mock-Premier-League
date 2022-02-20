# Mock Premier League
> A REST API that serves the latest scores of fixtures of matches in a “Mock Premier League”

## Production URL

https://mockpremierleague.herokuapp.com/

## API Documentation

https://documenter.getpostman.com/view/11782681/UVkjwxcW

## Getting Started

### Tools/Stacks

1. Node js
2. Express
3. MongoDB
4. Docker
5. Redis
6. Postman
7. Mocha
8. Chai

### Run on Docker

- Clone project and cd into it
- Install [docker](http://docker.io)
- Add .env variables eg. env.example
- Run `docker-compose up --build` (if have any error, please check the port used or run `docker-compose down` before)
- Access the API on [http:localhost:3000](http:localhost:3000)

### Run locally

- Clone project and cd into it
- Install all dependencies `npm install`
- Run `npm start` to start the application
- Add .env variables eg. env.example
- Access the API on [http:localhost:3000](http:localhost:3000)

### Run test

- Run `npm test -- --delay` to test the application
- Run `npm run coverage` to test the application

### Features

 ### Admin
 * Signup/login
 * Manage teams (add, remove, edit, view)
 * Create fixtures (add, remove, edit, view)
 * Generate unique links for fixture

 ### Users
 * Signup/login
 * View teams
 * View completed fixtures
 * View pending fixtures
 * Robustly search fixtures/teams

 ### Public
 * Robustly search fixtures/teams



## Author
*  [Frank Ezeh](https://www.linkedin.com/in/frank-ezeh-7a79a0182)

## License
This project is licensed under the MIT license - see the LICENSE.md file for details.
```
