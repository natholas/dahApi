var images = require('../helpers/images');
var ex = {};

ex.validation = {
  type: 'object',
  properties: {
    visitorToken: {
      type: 'string'
    },
    loginToken: {
      type: 'string'
    },
    entrepreneurId: {
      type: 'integer'
    },
    image: {
      type: 'string'
    }
  },
  required: ['visitorToken', 'loginToken', 'image']
};

ex.func = function(params, callback) {
  images.add('entrepreneurId', params.entrepreneurId, params.image, function(response) {
    callback({imagePath: response});
  });
};

module.exports = ex;
