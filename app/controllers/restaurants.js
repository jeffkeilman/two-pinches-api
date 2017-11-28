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
  if (req.body.text && req.body.userId && req.body._id) {
    Restaurant.findOne({
      _id: req.params.id
    })
      .then(restaurant => {
        const editComment = restaurant.comments.findIndex(comment => {
          return comment._id === req.body._id
        })
        restaurant.comments[editComment].text = req.body.text
        return restaurant.save()
      })
      .then(() => {
        res.sendStatus(204)
      })
      .catch(next)
  } else {
    res.sendStatus(400)
  }
}

const removeComment = (req, res, next) => {
  if (req.body.text && req.body.userId && req.body._id) {
    Restaurant.findOne({
      _id: req.params.id
    })
      .then(restaurant => {
        const delComment = restaurant.comments.findIndex(comment => {
          return comment._id === req.body._id
        })
        restaurant.comments.splice(delComment, 1)
        return restaurant.save()
      })
      .then(() => {
        res.sendStatus(204)
      })
      .catch(next)
  } else {
    res.sendStatus(400)
  }
}

const addComment = (req, res, next) => {
  if (req.body.text && req.body.userId) {
    Restaurant.findOne({
      _id: req.params.id
    })
      .then(restaurant => {
        const comment = Object.assign(req.body, {
          _id: shortid.generate()
        })
        restaurant.comments.push(comment)
        return restaurant.save()
      })
      .then(restaurant => {
        res.json({ comments: restaurant.comments })
      })
      .catch(next)
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
  { method: setModel(Restaurant), only: ['show'] },
  { method: setModel(Restaurant, { forUser: true }), only: ['update', 'destroy'] }
] })
