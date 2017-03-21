module.exports = function(status, data) {
  var response = {
    "status": status
  }
  if (status) response.data = data;
  else if (typeof response.errors == 'Array') response.errors = data;
  else response.errors = [data];


  return response;
}
