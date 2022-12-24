/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";

// Route.get('/', async () => {
//   return { hello: 'world' }
// })

Route.group(() => {
  Route.post("/register", "AuthController.register").as("users.register");
  Route.post("/login", "AuthController.login").as("users.login");
  Route.post("/otp-confirmation", "AuthController.otpConfirmation").as(
    "users.otpVerify"
  );

  Route.resource("venues", "VenuesController")
    .apiOnly()
    .middleware({ "*": ["auth", "verify", "acl"] });

  Route.resource("venues.fields", "FieldsController")
    .apiOnly()
    .middleware({ "*": ["auth", "verify"] });

  Route.resource("fields.bookings", "BookingsController")
    .apiOnly()
    .middleware({ "*": ["auth", "verify"] });

  Route.put("/bookings/:id/join", "BookingsController.join")
    .middleware(["auth", "verify"])
    .as("bookings.join");

  Route.put("/bookings/:id/unjoin", "BookingsController.unjoin")
    .middleware(["auth", "verify"])
    .as("bookings.unjoin");
}).prefix("/api/v1");
