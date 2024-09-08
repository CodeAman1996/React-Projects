
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## Title

Our Aim is to create a RestApi using NestJs (Typescript) in which we have to perform Read, Create and Delete operation using MongoDB on the Data which we are fetching from the API-URL provided to us by by the client using node-fetch.

## Dependencies 

NESTJS
MONGOBD
RABBITMQ
NODEMAILER


## Route

http://localhost:3000/users(POST)
Through this route,we are creating a user with the fields firstname, lastname, email and avatar and saving it in mongodb database.

http://localhost:3000/users/:id(GET)
Through this route,we are retrieving the record of the id from the list of all items we are getting from the fetch api response.

http://localhost:3000/users/:id/avatar(GET)
Through this route,we are retrieving the record of the avatar from the list of all items ,we are getting from the fetch api response using baseurl of avatar using the id of the record,and at the same time we are uploading the avatar in plainfile in public folder of our application and returning the base64 version of the image as the response.

http://localhost:3000/users/:id/avatar(DELETE)
Through this route,we are deleting the record of the avatar from the list of all items available in avatarDB available in mongoDB along with subsequent deletion of the plainfile associated with the gievn stored in our application.

## Email
We are sending a signin email at the time of creation of a user using the nodemailer facility available in Nestjs

## RabbitMQ
 Used RabbitMQ(messaging queue) to create queue name email_queue while sending email acknowledging the service that mail has been sent we have added console to verify that our queue is working fine for applied functionality because we dont have consumer service implemented.