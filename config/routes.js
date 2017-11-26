'use strict'

module.exports = require('lib/wiring/routes')

// create routes

// what to run for `GET /`
.root('root#root')

// standards RESTful routes
.resources('examples')

// standard RESTful routes for restuarants
.resources('restaurants')

// special routes for CRUDing comments
.patch('/add-comment/:id', 'restuarants#addComment')
.patch('/remove-comment/:id', 'restuarants#removeComment')
.patch('/edit-comment/:id', 'restuarants#editComment')

// users of the app have special requirements
.post('/sign-up', 'users#signup')
.post('/sign-in', 'users#signin')
.delete('/sign-out/:id', 'users#signout')
.patch('/change-password/:id', 'users#changepw')
.resources('users', { only: ['index', 'show'] })

// all routes created
