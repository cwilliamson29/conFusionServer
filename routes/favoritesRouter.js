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
      .get( /*cors.cors, */ (req, res, next) => {
            Favorites.find({ 'user': req.user._id })
                  .populate('user')
                  .populate('dishes')
                  .then((favorites) => {
                        res.json(favorites);
                  }, (err) => next(err))
                  .catch((err) => next(err));
      });


/*********FAVORITES DISHID**********/
favoritesRouter.route('/:dishId')
      .all(authenticate.verifyUser)
      .post((req, res, next) => {
            Favorites.findById(req.user._id)
                  .then((user) => {
                        if (user != null) {
                              Favorites.findByIdAndUpdate(req.user._id, { $addToSet: { dishes: req.params.dishId } })
                                    .then((resp) => {
                                          res.StatusCode = 200;
                                          res.setHeader('Content-type', 'application/json');
                                          res.json(resp);
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

      .delete((req, res, next) => {
            let idd = req.params.dishId
            console.log(req.params.dishId, " **************")
            Favorites.findById(req.user._id)
                  .then((user) => {
                        //var idd = req.params.dishId
                        //console.log("found a match****", dish);
                        //console.log("found 2 match****", user.dishes.idd);
                        for (let i = 0; i <= user.dishes.length; i++) {
                              console.log("*******inside for*********")
                              console.log(user.dishes[i])
                              if (req.params.dishId == user.dishes[i]) {
                                    console.log("found a match");
                                    let pos = req.params.dishId
                                    console.log("********   " + pos)
                                    user.dishes.splice(pos, 1);
                                    user.save()
                                          .then((dish) => {
                                                res.statusCode = 200;
                                                res.setHeader('Content-type', 'application/json');
                                                res.json(dish);
                                          }, (err) => next(err));

                              } else {
                                    console.log('no match found')
                              }
                        }
                        /*if (req.user._id.equals(user.dishes.id(req.params.dishId))) {
                              console.log("found a match")
                        }*/

                        /* res.StatusCode = 200;
                         res.setHeader('Content-type', 'application/json');
                         res.json(resp);*/
                  }, (err) => next(err))
                  .catch((err) => next(err));
      })


module.exports = favoritesRouter;