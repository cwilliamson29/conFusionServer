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
favoritesRouter.route('/:dishId')
      .all(authenticate.verifyUser)
      .post((req, res, next) => {
            console.log(req.user._id)
            Favorites.find({ 'user': req.user._id })
                  .then((favs) => {
                        req.body.user = req.user._id;

                        if (favs.length) {
                              //check if dish is already in list
                              let compare = Favorites.find({ 'dishes': req.params.dishId })
                              //var compareString = JSON.stringify(compare)
                              //console.log(compareString + " ****** ")
                              //if (favs[0].dishes.indexOf(req.body._id) == -1) {
                              //if (Favorites.find(x => x.dishes === req.params.dishId)) {
                              if (!Favorites.find(favs.dishes.equals(req.params.dishId))) {
                                    //if (!Favorites.find().where() {
                                    favs[0].dishes.push(req.params.dishId)
                                    res.json(favs);
                                    favs[0].save(function(err, favs) {
                                          if (err) throw err;
                                          res.json(favs);
                                    });
                              } else {
                                    console.log('Already in DB!');
                                    res.json(favs);
                              }

                        }
                        //else if user dont exist
                        else {
                              Favorites.create({ 'user': req.user._id })
                                    .then((favs) => {
                                          favs.dishes.push(req.params.dishId);
                                          favs.save(function(err, favs) {
                                                if (err) throw err;
                                                res.json(favs);
                                          })
                                    })
                                    .catch((err) => { console.log(err) })
                        }
                  }, (err) => next(err))
                  .catch((err) => next(err));
      })


module.exports = favoritesRouter;