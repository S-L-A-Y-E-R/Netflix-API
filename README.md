# Project Title

Natours API

## Introduction

This is a featured api or a tours application that allow you to mange your tours,bookings and reviews.
It also contain a complete authentication system using JWT and advanced authorization techniques and restriction.

### Technologies

[![My Skills](https://skillicons.dev/icons?i=js,nodejs,express,mongodb,postman)](https://skillicons.dev)

## Features:

-This API contain this features :

* Full Authentication system using JWT (Signup, login, forgot password, reset password, refresh token, logout).
* User actions like (create user, update user, delete user, get users).
* For the tours u can (create tour, update tour, delete tour, get tours, top 5 cheapest tours, stastics, get distances, get tours within coordinates).
* For the reviews u can (create review, update review, delete review, get reviews, get reviews for a specific tour).
* For the bookings u can (create booking, update booking, delete booking, get bookings).
  
-The API is using the following supporting packages :

* Json web token for the access and refresh tokens.
* Bcrypt for hashing passwords.
* Compression to optimize the size of the response body during the production.
* Helmet,hpp and express-mongo-sanatize for security purposes.
* Nodemailer for sending emails in both development and production stages.
* Stripe to handel the checkout and payments.
* Validator to help in validating schema fields.
* Mongoose as abstract layer above mongodb for modeling the data.
* Multer for uploading photos and sharp for optimizing them.
  
### Installing

Clone the repo and run this command in the terminal to install the dependecies:

```
npm install
```

To run the project:

```
npm run dev
```

To setup environment variables (fill the values with yours):

```
PORT=4000
DATABASE=

//jwt keys
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRES_IN=
REFRESH_TOKEN_EXPIRES_IN=
ACCESS_TOKEN_COOKIE_EXPIRES_IN=
REFRESH_TOKEN_COOKIE_EXPIRES_IN=

//email keys
EMAIL_USERNAME=
EMAIL_PASSWORD=
EMAIL_HOST=
EMAIL_PORT=     
EMAIL_FROM=
GMAIL_PASSWORD=

//stripe keys
STRIPE_SECRET_KEY=
WEBHOOK_SECRET=
```

### Live demo

You can use the API form [this link](https://natours-8o6d.onrender.com/)
