const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Dishes = require('../models/dishes')

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

/***************DISHES***************/
dishRouter.route('/')
    .get((req, res, next) => {
        console.log('\ninside dishes GET \n************** ')
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
        console.log('\ninside dishes POST\n************** ')
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

module.exports = dishRouter;
