/**
 * @description
 * This service makes it easy to save and load data from localStorage and sessionStorage
 * The reason for all of the try blocks is that Safari (and maybe other browsers)
 * don't can give nasty errors when trying to use localStorage
 * This service does not have any dependencies so it can by used by any service or controller
**/

app.service("Storage", function() {

  /**
  * @description
  * Load data from localStorage or sessionStorage.
  * Both will be checked but localStorage has priority
  * @param {string} key The key of the localStorage or sessionStorage item
  * @param {integer} validity The amount of hours old the data can be
  * @returns {object|boolean} The JSON parsed data that was saved in localStorage or false if it was not found or not valid
  **/
  this.get = function (key, validity) {
    try {
      if (!validity) validity = 99999;
      var data = localStorage.getItem(key);
      if (!data) data = sessionStorage.getItem(key);
      if (data) {
        data = JSON.parse(data);
        if (data.savedTime + (validity * 3600000) > new Date().getTime()) return data.data;
      }
      return false;
    } catch (e) {return false;}
  };


  /**
  * @description
  * Save data to localStorage or sessionStorage.
  * The current time is saved along with the data
  * @param {string} key The key of the localStorage or sessionStorage item
  * @param {object} data The data to be saved
  * @param {boolean} session True if the data should be saved in sessionStorage. Default is localStorage
  **/
  this.set = function (key, data, session) {
    try {
      data = {"savedTime": new Date().getTime(),"data": data};
      if (session) sessionStorage.setItem(key, JSON.stringify(data));
      else localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {}
  };


  /**
  * @description
  * Update data saved in localStorage or sessionStorage.
  * Update should be used instead of set when you don't want the time to be updated
  * @param {string} key The key of the localStorage or sessionStorage item to update
  * @param {object} data The new data
  **/
  this.update = function (key, data) {
    try {
      var session, oldData;
      if (oldData = sessionStorage.getItem(key)) session = true;
      else data = localStorage.getItem(key);
      if (!data) return false;
      oldData = JSON.parse(oldData);
      oldData.data = data;
      if (session) sessionStorage.setItem(key, JSON.stringify(oldData));
      else localStorage.setItem(key, JSON.stringify(oldData));
    } catch (e) {return false;}
  };


  /**
  * @description
  * Removes an item from localStorage or sessionStorage.
  * @param {string} key The key of the localStorage or sessionStorage item to remove
  **/
  this.remove = function (key) {
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    } catch(e) {}
  };


  /**
  * @description
  * Clears localStorage and sessionStorage
  **/
  this.clear = function () {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch(e) {}
  };

});
