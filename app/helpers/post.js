var request = require('request');

module.exports = function(url, data, callback) {
  request.post({
    url: url,
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(data),
  }, function (error, response, body) {
    try {
      body = JSON.parse(body);
      if (response.statusCode == 200) callback(body);
      else callback(false);
    } catch(error) {
      callback(false);
    }

  })
}
