const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

/***************LEADERS***************/
leaderRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next()
    })
    .get((req, res, next) => {
        res.end('will send all leaders ')
    })
    .post((req, res, next) => {
        res.end('will send all leaders: ' + req.body.name + ' with details: ' + req.body.description);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /leaders');
    })
    .delete((req, res, next) => {
        res.end('delete all leaders')
    });

/***************LEADERS ID***************/
leaderRouter.route('/:leaderId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next()
    })
    .get((req, res, next) => {
        res.end('will send LEADERS ID ' + req.params.leaderId + '\n')
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /promotions');
    })
    .put((req, res, next) => {
        res.write('will update LEADERS ID ' + req.params.leaderId + '\n');
        res.end('will update LEADERS ID ' + req.body.name + ' with details: ' + req.body.description);
    })
    .delete((req, res, next) => {
        res.end('delete LEADERS ID ' + req.params.leaderId + '\n')
    });

module.exports = leaderRouter;
