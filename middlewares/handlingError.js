class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class NotAutanticate extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class MONGO_DUPLCATE_ERROR extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

// class CastError extends Error {
//   constructor(message) {
//     super(message);
//     this.statusCode = 400;
//   }
// }

module.exports = {
  NotFoundError,
  BadRequest,
  NotAutanticate,
  MONGO_DUPLCATE_ERROR,
};
