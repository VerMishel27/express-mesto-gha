class MONGO_DUPLCATE_ERROR extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = {
  MONGO_DUPLCATE_ERROR,
};
