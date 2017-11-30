'use strict'

const shortid = require('shortid')

const controller = require('lib/wiring/controller')
const models = require('app/models')
const Restaurant = models.restaurant

const authenticate = require('./concerns/authenticate')
const setUser = require('./concerns/set-current-user')
const setModel = require('./concerns/set-mongoose-model')

const index = (req, res, next) => {
  if (req.query.featured) {
    Restaurant.find({ featured: true })
      .then(restaurants => res.json({
        restaurants: restaurants.map((e) =>
          e.toJSON({ virtuals: true, user: req.user }))
      }))
      .catch(next)
  } else {
    Restaurant.find()
      .then(restaurants => res.json({
        restaurants: restaurants.map((e) =>
          e.toJSON({ virtuals: true, user: req.user }))
      }))
      .catch(next)
  }
}

const show = (req, res) => {
  res.json({
    restaurant: req.restaurant.toJSON({ virtuals: true, user: req.user })
  })
}

const create = (req, res, next) => {
  if (req.user.admin) {
    const restaurant = Object.assign(req.body, {
      _owner: req.user._id
    })
    Restaurant.create(restaurant)
      .then(restaurant =>
        res.status(201)
          .json({
            restaurant: restaurant.toJSON({ virtuals: true, user: req.user })
          }))
      .catch(next)
  } else {
    res.sendStatus(403)
  }
}

const update = (req, res, next) => {
  if (req.user.admin) {
    delete req.body._owner  // disallow owner reassignment.

    req.restaurant.update(req.body)
      .then(() => res.sendStatus(204))
      .catch(next)
  } else {
    res.sendStatus(403)
  }
}

const destroy = (req, res, next) => {
  if (req.user.admin) {
    req.restaurant.remove()
      .then(() => res.sendStatus(204))
      .catch(next)
  } else {
    res.sendStatus(403)
  }
}

const editComment = (req, res, next) => {
  if (req.body.text && req.body.user && req.body._id) {
    const comment = req.restaurant.comments.findIndex(comment => comment._id === req.body._id)
    if (req.restaurant.comments[comment].user === req.user.email) {
      req.restaurant.comments.splice(comment, 1, req.body)
      req.restaurant.save()
      res.json({ comment: req.restaurant.comments[comment] })
    } else {
      res.sendStatus(401)
    }
  } else {
    res.sendStatus(400)
  }
}

const removeComment = (req, res, next) => {
  if (req.body.text && req.body.user && req.body._id) {
    const comment = req.restaurant.comments.findIndex(comment => comment._id === req.body._id)
    if (req.body.user === req.restaurant.comments[comment].user) {
      req.restaurant.comments.splice(comment, 1)
      req.restaurant.save()
      res.sendStatus(204)
    } else {
      res.sendStatus(401)
    }
  } else {
    res.sendStatus(400)
  }
}

const addComment = (req, res, next) => {
  if (req.body.text) {
    const comment = Object.assign(req.body, {
      user: req.user.email,
      _id: shortid.generate()
    })
    req.restaurant.comments.push(comment)
    req.restaurant.save()
    res.json({ comment })
  } else {
    res.sendStatus(400)
  }
}

module.exports = controller({
  index,
  show,
  create,
  update,
  destroy,
  addComment,
  removeComment,
  editComment
}, { before: [
  { method: setUser },
  { method: authenticate, except: ['index', 'show', 'create'] },
  { method: setModel(Restaurant), only: ['show', 'addComment', 'removeComment', 'editComment'] },
  { method: setModel(Restaurant, { forUser: true }), only: ['update', 'destroy'] }
] })
