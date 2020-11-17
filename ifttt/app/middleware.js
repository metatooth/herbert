const IFTTT_KEY = process.env.IFTTT_KEY;

module.exports = {

  serviceKeyCheck: function(req, res, next) {
    const key = req.get('IFTTT-Service-Key');
    console.log(key);
    console.log(IFTTT_KEY);
    if (key !== IFTTT_KEY) {
      console.log('send status 401');
      res.status(401).send({
        'errors': [{
          'message': 'Channel/Service key is not correct',
        }],
      });
    } else {
      console.log('next--->');
      next();
    }
  },
};
