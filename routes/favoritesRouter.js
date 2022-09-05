const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate')
const cors = require('./cors');
const Favorites = require('../models/favorites');
const Dishes = require('../models/dishes')

const favoritesRouter = express.Router();
favoritesRouter.use(bodyParser.json());

/*******Favorites Router********/
favoritesRouter.route('/')
      .options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => { res.sendStatus(200) })
      .all(authenticate.verifyUser)
      .get(cors.cors, (req, res, next) => {
            Favorites.find({ 'user': req.user._id })
                  .populate('user')
                  .populate('dishes')
                  .then((favorites) => {
                        res.json(favorites);
                  }, (err) => next(err))
                  .catch((err) => next(err));
      })
      .post(cors.cors, (req, res, next) => {
            Favorites.create({ "_id": req.user._id, "user": req.user._id })
                  .then((resp) => {
                        Favorites.find({ 'user': req.user._id })
                              .populate('user')
                              .then((resp2) => {
                                    res.StatusCode = 200;
                                    res.setHeader('Content-type', 'application/json');
                                    res.json(resp2);
                              })

                  }, (err) => next(err))

                  .catch((err) => next(err));
      })
      .delete(cors.cors, (req, res, next) => {
            Favorites.findByIdAndRemove(req.user._id)
                  .then((resp) => {
                        res.StatusCode = 200;
                        res.setHeader('Content-type', 'application/json');
                        res.json(resp);
                  }, (err) => next(err))

                  .catch((err) => next(err));
      })


/*********FAVORITES DISHID**********/
favoritesRouter.route('/:dishId')
      .all(authenticate.verifyUser)
      .get(cors.cors, (req, res, next) => {
            Favorites.findOne({ user: req.user._id })
                  .then((favs) => {
                        if (!favs) {
                              res.statusCode = 200;
                              res.setHeader('Content-type', 'application/json');
                              return res.json({ 'exists': false, "favorites": favs });
                        } else {
                              if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                                    res.statusCode = 200;
                                    res.setHeader('Content-type', 'application/json');
                                    return res.json({ 'exists': false, "favorites": favs });
                              } else {
                                    res.statusCode = 200;
                                    res.setHeader('Content-type', 'application/json');
                                    return res.json({ 'exists': true, "favorites": favs });
                              }
                        }
                  }, (err) => next(err))
                  .cath((err) => next(err))
      })
      .post(cors.cors, (req, res, next) => {
            Favorites.findById(req.user._id)
                  .then((user) => {
                        if (user != null) {
                              Favorites.findByIdAndUpdate(req.user._id, { $addToSet: { dishes: req.params.dishId } })
                                    .then((resp) => {
                                          //********added after assignment completion
                                          Favorites.findById(req.user._id)
                                                .populate('user')
                                                .populate('dishes')
                                                .then((favs) => {
                                                      res.StatusCode = 200;
                                                      res.setHeader('Content-type', 'application/json');
                                                      res.json(resp);
                                                })

                                    }, (err) => next(err))
                                    .catch((err) => next(err));

                        } else if (user == null) {
                              Favorites.create({ "_id": req.user._id, "user": req.user._id })
                                    .then((resp) => {
                                          Favorites.findByIdAndUpdate(req.user._id, { $addToSet: { dishes: req.params.dishId } })
                                                .populate('user')
                                                .then(() => {
                                                      Favorites.findById(req.user._id)
                                                            .populate('dishes')
                                                            .then((resp) => {
                                                                  res.StatusCode = 200;
                                                                  res.setHeader('Content-type', 'application/json');
                                                                  res.json(resp);
                                                            }, (err) => next(err))
                                                })
                                    }, (err) => next(err));
                        } else {
                              err = new Error('Dish ' + req.params.dishId + ' not found')
                              err.status = 404;
                              return next(err)
                        }
                  }, (err) => next(err))
                  .catch((err) => {
                        console.log("did not make it to findById")
                        next(err)
                  });
      })

      .delete(cors.cors, (req, res, next) => {
            Favorites.findByIdAndUpdate(req.user._id, { $pull: { 'dishes': req.params.dishId } }, (err) => console.log('Dish Removed'))
                  .then((user) => {
                        res.StatusCode = 200;
                        res.setHeader('Content-type', 'application/json');
                        res.json(user);
                  }, (err) => next(err))
                  .catch((err) => next(err));
      })


module.exports = favoritesRouter;