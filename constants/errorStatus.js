const  http2  = require('node:http2');
const { constants } = require('node:http2');

const BAD_REQUEST_STATUS = constants.HTTP_STATUS_BAD_REQUEST; //400
const SERVER_ERROR_STATUS = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR; //500
const NOT_FOUND_STATUS = constants.HTTP_STATUS_NOT_FOUND; //404
const SUCCESS_STATUS = http2.constants.HTTP_STATUS_OK; //200
const CREATED_STATUS = constants.HTTP_STATUS_CREATED; //201
const STATUS_CONFLICT = constants.HTTP_STATUS_CONFLICT; //409

module.exports = {
  BAD_REQUEST_STATUS,
  SERVER_ERROR_STATUS,
  NOT_FOUND_STATUS,
  CREATED_STATUS,
  SUCCESS_STATUS,
  STATUS_CONFLICT,
};

const MONGO_DUPLCATE_ERROR_CODE = 11000;

module.exports = {
  MONGO_DUPLCATE_ERROR_CODE
}
