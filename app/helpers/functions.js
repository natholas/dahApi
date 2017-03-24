module.exports = {
  randomString: function(length) {
    if (!length) length = 10;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }
};

objSize = function(obj) {
  var size = 0, key;
  for (i in obj) size++;
  return size;
};
