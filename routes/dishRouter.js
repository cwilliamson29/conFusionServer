const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate')
const cors = require('./cors');
const Dishes = require('../models/dishes')

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

/***************DISHES***************/
dishRouter.route('/')
      .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
      .get(cors.cors, (req, res, next) => {
            Dishes.find({})
                  .populate('comments.author._id')
                  .then((dishes) => {
                        res.statusCode = 200;
                        res.setHeader('Content-type', 'application/json');
                        res.json(dishes);
                  }, (err) => next(err))
                  .catch((err) => next(err));
      })
      .post(cors.corsWithOptions, authenticate.verifyAdmin, (req, res, next) => {
            if (req.user.admin) {
                  Dishes.create(req.body)
                        .then((dish) => {
                              res.statusCode = 200;
                              res.setHeader('Content-type', 'application/json');
                              res.json(dish);
                        }, (err) => next(err))
                        .catch((err) => next(err));
            } else {
                  err = new Error('Not Authorized :: not admin')
                  err.status = 404;
                  return next(err)
            }
      })
      .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
            res.statusCode = 403;
            res.end('PUT operation not supported on/dishes');
      })
      .delete(cors.corsWithOptions, authenticate.verifyAdmin, (req, res, next) => {
            if (req.user.admin) {
                  Dishes.remove({})
                        .then((resp) => {
                              res.statusCode = 200;
                              res.setHeader('Content-type', 'application/json');
                              res.json(resp);
                        }, (err) => next(err))
                        .catch((err) => next(err));
            } else {
                  err = new Error('Not Authorized :: not admin')
                  err.status = 404;
                  return next(err)
            }
      });

/***************DISH ID***************/
dishRouter.route('/:dishId')
      .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
      .get(cors.cors, (req, res, next) => {
            Dishes.findById(req.params.dishId)
                  .populate('comments.author')
                  .then((resp) => {
                        res.StatusCode = 200;
                        res.setHeader('Content-type', 'application/json');
                        res.json(resp);
                  }, (err) => next(err))
                  .catch((err) => next(err));
      })
      .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
            res.statusCode = 403;
            res.end('POST operation not supported on /:dishId');
      })
      .put(cors.corsWithOptions, authenticate.verifyAdmin, (req, res, next) => {
            if (req.user.admin) {
                  Dishes.findByIdAndUpdate(req.params.dishId, {
                              $set: req.body
                        }, {
                              new: true
                        })
                        .then((resp) => {
                              res.StatusCode = 200;
                              res.setHeader('Content-type', 'application/json');
                              res.json(resp);
                        }, (err) => next(err))
                        .catch((err) => next(err));
            } else {
                  err = new Error('Not Authorized :: not admin')
                  err.status = 404;
                  return next(err)
            }
      })
      .delete(cors.corsWithOptions, authenticate.verifyAdmin, (req, res, next) => {
            if (req.user.admin) {
                  Dishes.findByIdAndRemove(req.params.dishId)
                        .then((resp) => {
                              res.StatusCode = 200;
                              res.setHeader('Content-type', 'application/json');
                              res.json(resp);
                        }, (err) => next(err))
                        .catch((err) => next(err));
            } else {
                  err = new Error('Not Authorized :: not admin')
                  err.status = 404;
                  return next(err)
            }
      });

/***************COMMENTS***************/
dishRouter.route('/:dishId/comments')
      .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
      .get(cors.cors, (req, res, next) => {
            Dishes.findById(req.params.dishId)
                  .populate('comments.author')
                  .then((dish) => {
                        if (dish != null) {
                              res.statusCode = 200;
                              res.setHeader('Content-type', 'application/json');
                              res.json(dish.comments);

                        } else {
                              err = new Error('Dish ' + req.params.dishId + ' not found')
                              err.status = 404;
                              return next(err)
                        }
                  }, (err) => next(err))
                  .catch((err) => next(err));
      })
      .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
            Dishes.findById(req.params.dishId)
                  .then((dish) => {

                        if (dish != null) {
                              req.body.author = req.user._id;
                              dish.comments.push(req.body);
                              dish.save()
                                    .then((dish) => {
                                          Dishes.findById(dish._id)
                                                .populate('comments.author')
                                                .then((dish) => {
                                                      res.statusCode = 200;
                                                      res.setHeader('Content-type', 'application/json');
                                                      res.json(dish);
                                                })
                                    }, (err) => next(err));
                        } else {
                              err = new Error('Dish ' + req.params.dishId + ' not found')
                              err.status = 404;
                              return next(err)
                        }
                  }, (err) => next(err))
                  .catch((err) => next(err));
      })
      .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
            res.statusCode = 403;
            res.end('PUT operation not supported on /comment');
      })
      .delete(cors.corsWithOptions, authenticate.verifyAdmin, (req, res, next) => {
            if (req.user.admin || req.user._id) {
                  Dishes.findById(req.params.dishId)
                        .then((dish) => {
                              if (dish != null) {

                                    for (var i = (dish.comments.length - 1); i >= 0; i--) {
                                          dish.comments.id(dish.comments[i].remove())
                                    }

                                    dish.save()
                                          .then((dish) => {
                                                res.statusCode = 200;
                                                res.setHeader('Content-type', 'application/json');
                                                res.json(dish);
                                          }, (err) => next(err));

                              } else {
                                    err = new Error('Dish ' + req.params.dishId + ' not found')
                                    err.status = 404;
                                    return next(err)
                              }
                        }, (err) => next(err))
                        .catch((err) => next(err));
            } else {
                  err = new Error('Not Authorized :: not admin')
                  err.status = 404;
                  return next(err)
            }
      });

/***************COMMENTS ID***************/
dishRouter.route('/:dishId/comments/:commentId')
      .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
      .get(cors.cors, (req, res, next) => {
            Dishes.findById(req.params.dishId)
                  .populate('comments.author')
                  .then((dish) => {
                        if (dish != null && dish.comments.id(req.params.commentId) != null) {
                              console.log('\ninside2 comments id GET \n************** ')
                              res.statusCode = 200;
                              res.setHeader('Content-type', 'application/json');
                              res.json(dish.comments.id(req.params.commentId));

                        } else if (dish == null) {
                              err = new Error('Dish ' + req.params.dishId + ' not found')
                              err.status = 404;
                              return next(err)
                        } else {
                              err = new Error('Dish ' + req.params.commentId + ' not found')
                              err.status = 404;
                              return next(err)
                        }
                  }, (err) => next(err))
                  .catch((err) => next(err));
      })
      .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
            res.statusCode = 403;
            res.end('POST operation not supported on /:dishId comments');
      })
      .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
            Dishes.findById(req.params.dishId)
                  .then((dish) => {

                        if (req.user._id.equals(dish.comments.id(req.params.commentId).author._id)) {
                              if (dish != null && dish.comments.id(req.params.commentId) != null) {
                                    if (req.body.rating) {
                                          dish.comments.id(req.params.commentId).rating = req.body.rating;

                                    }
                                    if (req.body.comment) {
                                          dish.comments.id(req.params.commentId).comment = req.body.comment;
                                    }
                                    dish.save()
                                          .then((dish) => {
                                                Dishes.findById(dish._id)
                                                      .populate('comments.author')
                                                      .then((dish) => {
                                                            res.statusCode = 200;
                                                            res.setHeader('Content-type', 'application/json');
                                                            res.json(dish);
                                                      })

                                          }, (err) => next(err));

                              } else if (dish == null) {
                                    err = new Error('Comment ' + req.params.dishId + ' not found')
                                    err.status = 404;
                                    return next(err)
                              } else {
                                    err = new Error('Comment ' + req.params.commentId + ' not found')
                                    err.status = 404;
                                    return next(err)
                              }
                        } else {
                              err = new Error('Not authorized to modify another user comment')
                              err.status = 404;
                              return next(err)
                        }
                  }, (err) => next(err))
                  .catch((err) => next(err));
      })
      .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
            Dishes.findById(req.params.dishId)
                  .then((dish) => {
                        if (req.user._id.equals(dish.comments.id(req.params.commentId).author._id)) {
                              if (dish != null && dish.comments.id(req.params.commentId) != null) {
                                    dish.comments.id(req.params.commentId).remove();
                                    dish.save()
                                          .then((dish) => {
                                                Dishes.findById(dish._id)
                                                      .populate('comments.author')
                                                      .then((dish) => {
                                                            res.statusCode = 200;
                                                            res.setHeader('Content-type', 'application/json');
                                                            res.json(dish);
                                                      })
                                          }, (err) => next(err));
                              } else if (dish == null) {
                                    err = new Error('Comment ' + req.params.dishId + ' not found')
                                    err.status = 404;
                                    return next(err)
                              } else {
                                    err = new Error('Comment ' + req.params.dishId + ' not found')
                                    err.status = 404;
                                    return next(err)
                              }
                        } else {
                              err = new Error('Not authorized to modify another user comment')
                              err.status = 404;
                              return next(err)
                        }
                  }, (err) => next(err))
                  .catch((err) => next(err));
      });

module.exports = dishRouter;