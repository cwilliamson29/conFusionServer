const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate')
const cors = require('./cors');

const Comments = require('../models/comments')

const commentRouter = express.Router();
commentRouter.use(bodyParser.json());

commentRouter.route('/')
      .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
      .get(cors.cors, (req, res, next) => {
            Comments.find(req.query)
                  .populate('author')
                  .then((coms) => {
                        res.statusCode = 200;
                        res.setHeader('Content-type', 'application/json');
                        res.json(coms);
                  }, (err) => next(err))
                  .catch((err) => next(err));
      })
      .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
            if (req.body != null) {
                  req.body.author = req.user._id;
                  Comments.create(req.body)
                        .then((coms) => {
                              Comments.findById(coms._id)
                                    .populate('author')
                                    .then((coms) => {
                                          res.statusCode = 200;
                                          res.setHeader('Content-type', 'application/json');
                                          res.json(coms);
                                    })
                        }, (err) => next(err))
                        .catch((err) => next(err));
            } else {
                  err = new Error('comment not found');
                  err.status = 404;
                  return next(err);
            }
      })
      .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
            res.statusCode = 403;
            res.end('PUT operation not supported on /comment');
      })
      .delete(cors.corsWithOptions, authenticate.verifyAdmin, (req, res, next) => {
            if (req.user.admin) {
                  Comments.remove()
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

/***************COMMENTS ID***************/
commentRouter.route('/:commentId')
      .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
      .get(cors.cors, (req, res, next) => {
            Comments.findById(req.params.commentId)
                  .populate('author')
                  .then((coms) => {
                        res.statusCode = 200;
                        res.setHeader('Content-type', 'application/json');
                        res.json(coms);
                  }, (err) => next(err))
                  .catch((err) => next(err));
      })
      .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
            res.statusCode = 403;
            res.end('POST operation not supported on /:commentId');
      })
      .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
            Comments.findById(req.params.commentId)
                  .then((coms) => {

                        if (coms != null) {
                              if (!coms.author.equals(req.user._id)) {
                                    var err = new Error('Not Authorized');
                                    err.status = 403;
                                    return next(err)
                              }
                              req.body.author = req.user._id;
                              Comments.findByIdAndUpdate(req.params.commentId, { $set: req.body }, { new: true })
                                    .then((coms) => {
                                          Comments.findById(coms._id)
                                                .populate('author')
                                                .then((coms) => {
                                                      res.statusCode = 200;
                                                      res.setHeader('Content-type', 'application/json');
                                                      res.json(coms);
                                                })
                                    }, (err) => next(err))
                        } else {
                              err = new Error('Comment Not Found - ', req.params.commentId)
                              err.status = 404;
                              return next(err)
                        }

                  }, (err) => next(err))
                  .catch((err) => next(err));
      })
      .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
            Comments.findById(req.params.commentId)
                  .then((coms) => {
                        if (coms != null) {
                              if (!coms.author.equals(req.user._id)) {
                                    var err = new Error('Not Authorized');
                                    err.status = 403;
                                    return next(err)
                              }
                              Comments.findByIdAndRemove(req.params.commentId)
                                    .then((coms) => {
                                          res.statusCode = 200;
                                          res.setHeader('Content-type', 'application/json');
                                          res.json(coms);
                                    }, (err) => next(err));
                              .catch((err) => next(err));
                        } else {
                              err = new Error('Not authorized to modify another user comment')
                              err.status = 404;
                              return next(err)
                        }
                  }, (err) => next(err))
                  .catch((err) => next(err));
      });

module.exports = commentRouter