# Two Pinches
A food blog for the Boston area... and beyond! This Express API stores information
about restaurants on a MongoDB instance and serves it up to an Angular client.

## Client Repository
https://github.com/jeffkeilman/two-pinches-client

## Technologies Used
-   Express
-   MongoDB
-   Mongoose ORM
-   [shortid library](https://www.npmjs.com/package/shortid)

## Future Iterations
-   I would like to implement more advanced authentication.
-   I would like to extend my comments (or potentially make it a seperate resource) to allow for comment replies

## Planning/Development Process
I started by drawing out my entire project and writing a few user stories. I had wireframes
for the initial views I intended to have. I drew up an ERD for the back-end resources. During
the development phase, I tried to stick to the general plan I laid out on paper, but ended
up changing some components of the app as I saw fit.

## ERD
https://drive.google.com/file/d/1x0vZZFbvzqDZ2eNe7xFf0yIOitOQvhne/view?usp=sharing

## App
![Image of Two Pinches Site](https://i.imgur.com/dZ1ZXD8.jpg?1)

## Installation
Be sure to run `npm install` before attempting to deploy this API locally.

## Routes
Verb | URI Pattern | Controller#Action
---  |  ---------  |  ----------------
POST | `users/sign-in` | `users#signin`
POST | `users/sign-up` | `users#signup`
DELETE | `users/sign-out/:id` | `users#signout`
PATCH | `users/change-password/:id` | `users#changepw`
GET  | `/users/:id` |  `users#show`
GET  | `/users` |  `users#index`
POST  | `/restaurants` |  `restaurants#create`
DELETE | `/restaurants/:id` | `restaurants#destroy`
PATCH | `/restaurants/:id` | `restaurants#update`
GET | `/restaurants/:id` | `restaurants#show`
GET | `/restaurants` | `restaurants#index`
PATCH | `/restaurants/add-comment` | `restaurants#addComment`
PATCH | `/restaurants/edit-comment/:id` | `restaurants#editComment`
PATCH | `/restaurants/remove-comment/:id` | `restaurants#removeComment`
