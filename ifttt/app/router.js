const middleware = require('./middleware');
const helpers = require('./helpers');

const router = require('express').Router();

// The status
router.get('/ifttt/v1/status', middleware.serviceKeyCheck, (req, res) => {
  res.status(200).send();
});

// The test/setup endpoint
router.post('/ifttt/v1/test/setup', middleware.serviceKeyCheck, (req, res) => {
  res.status(200).send({
    'data': {
      samples: {
        actionRecordSkipping: {
          create_new_thing: {invalid: 'true'},
        },
        actions: {
          temperature_overlimit: {
            created_at: (new Date()).toISOString(),
            content: 'Temperature is greater than 21.2C',
          },
        },
      },
    },
  });
});

// Query endpoints

router.post('/ifttt/v1/queries/environment',
    middleware.serviceKeyCheck,
    (req, res) => {
      if (req.body.queryFields === undefined || req.body.user === undefined) {
        res.status(401).send({
          'errors': [{
            'message': 'Query Fields or User is undefined.',
          }],
        });
      } else {
        const data = [
          {
            temperature: 'over',
            humidity: 'under',
            created_at: (new Date()).toISOString(),
          },
        ];

        const num = req.body.limit || 2;

        if (num > 1) {
          data.push({
            temperature: 'under',
            humidity: 'under',
            created_at: (new Date()).toISOString(),
          });
        };

        const cursor = helpers.generateUniqueId();

        res.status(200).send({
          'data': data,
          'cursor': cursor,
        });
      }
    });

// Action endpoints

router.post('/ifttt/v1/actions/humidity_overlimit',
    middleware.serviceKeyCheck, (req, res) => {
      console.log('humidity overlimit');

      res.status(200).send({
        'data': [{
          'id': helpers.generateUniqueId(),
        }],
      });
    });

router.post('/ifttt/v1/actions/humidity_underlimit',
    middleware.serviceKeyCheck, (req, res) => {
      console.log('humidity underlimit');

      res.status(200).send({
        'data': [{
          'id': helpers.generateUniqueId(),
        }],
      });
    });

router.post('/ifttt/v1/actions/temperature_overlimit',
    middleware.serviceKeyCheck,
    (req, res) => {
      console.log('temperature overlimit');

      if (req.body.actionFields !== undefined) {
        const content = req.body.actionFields.content;

        if (content === undefined) {
          res.status(400).send({
            'errors': [{
              'status': 'SKIP',
              'message': 'Content cannot be null.',
            }],
          });
        } else {
          res.status(200).send({
            'data': [{
              'id': helpers.generateUniqueId(),
            }],
          });
        }
      } else {
        res.status(400).send({
          'errors': [{
            'status': 'SKIP',
            'message': 'Action fields cannot be null.',
          }],
        });
      }
    });

router.post('/ifttt/v1/actions/temperature_underlimit',
    middleware.serviceKeyCheck, (req, res) => {
      console.log('temperature underlimit');

      res.status(200).send({
        'data': [{
          'id': helpers.generateUniqueId(),
        }],
      });
    });


// listen for requests :)

router.get('/', (req, res) => {
  res.render('index.ejs');
});

module.exports = router;
