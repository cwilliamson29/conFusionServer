const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Dishes = require('../models/dishes')

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

/***************DISHES***************/
dishRouter.route('/')
    .get((req, res, next) => {
        Dishes.find({})
            .then((dishes) => {
                console.log('\ninside2 dishes GET \n************** ')
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(dishes);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Dishes.create(req.body)
            .then((dish) => {
                console.log('\ndish created \n************** ', dish)
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on/dishes');
    })
    .delete((req, res, next) => {
        Dishes.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

/***************DISH ID***************/
dishRouter.route('/:dishId')
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((resp) => {
                res.StatusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /:dishId');
    })
    .put((req, res, next) => {
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
    })
    .delete((req, res, next) => {
        Dishes.findByIdAndRemove(req.params.dishId)
            .then((resp) => {
                res.StatusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

/***************COMMENTS***************/
dishRouter.route('/:dishId/comments')
    .get((req, res, next) => {
        console.log('\ninside comments GET \n************** ')

        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    console.log('\ninside2 comments GET \n************** ')
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
    .post((req, res, next) => {
        console.log('\ninside comments POST\n************** ')

        Dishes.findById(req.params.dishId)
            .then((dish) => {
                console.log('\ncomment created \n************** ', dish);

                if (dish != null) {
                    dish.comments.push(req.body);
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-type', 'application/json');
                            res.json(dish.comments);
                        })
                } else {
                    err = new Error('Dish ' + req.params.dishId + ' not found')
                    err.status = 404;
                    return next(err)
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /comment');
    })
    .delete((req, res, next) => {
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
    });

/***************COMMENTS ID***************/
dishRouter.route('/:dishId/comments/:commentId')
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
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
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /:dishId comments');
    })
    .put((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    console.log('\ninside2 comments put id GET \n************** ')
                    if (req.body.rating) {
                        dish.comments.id(req.params.commentId).rating = req.body.rating;

                    }
                    if (req.body.comment) {
                        dish.comments.id(req.params.commentId).comment = req.body.comment;
                    }
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-type', 'application/json');
                            res.json(dish);
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
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    console.log('\ninside2 comments DELETE id GET \n******************** ')
                    dish.comments.id(req.params.commentId).remove();
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-type', 'application/json');
                            res.json(dish);
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
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = dishRouter;
