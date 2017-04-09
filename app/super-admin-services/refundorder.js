// var connection = require('../helpers/connection');
// var orders = require('../helpers/orders');
//
// var ex = {};
//
// ex.validation = {
//   type: 'object',
//   properties: {
//     visitorToken: {
//       type: 'string'
//     },
//     loginToken: {
//       type: 'string'
//     },
//     orderId: {
//       type: 'integer'
//     }
//   },
//   required: ['visitorToken', 'loginToken', 'orderId']
// };
//
// ex.func = function(params, callback) {
//   console.log(1);
//   orders.refund(params.orderId, function(response) {
//     console.log(response);
//     if (response) callback({status: 1});
//     else callback({error: 'FAILED_TO_CANCEL_ORDER'});
//   });
// };
//
// module.exports = ex;
