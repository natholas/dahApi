var services = {
  bootloader: require('./services/bootloader')
};

module.exports = services;


// module.exports = {
//   bootloader: {
//     func: function(params, callback) {
//       callback({a:1});
//     },
//     validation: {
//       type: 'object',
//       parameters: {}
//     }
//   },
//   login: {
//     func: function(params, callback) {
//       callback({a:1});
//     },
//     validation: {
//       type: 'object',
//       parameters: {
//         visitorToken: {
//           type: 'string'
//         },
//         emailAddress: {
//           type: 'string'
//         },
//         password: {
//           type: 'string'
//         }
//       },
//       required: ['visitorToken', 'emailAddress', 'password']
//     }
//   },
//   getentrepreneurbyid: {
//     func: function(params, callback) {
//       callback({a:1});
//     },
//     validation: {
//       type: 'object',
//       parameters: {
//         visitorToken: {
//           type: 'string'
//         },
//         customerToken: {
//           type: 'string'
//         },
//         id: {
//           type: 'integer'
//         }
//       },
//       required: ['visitorToken', 'customerToken', 'id']
//     }
//   }
// };
