const AppError = require('./AppError');

class NotFoundError extends AppError {
  constructor(resource, id) {
    super(`${resource} avec l'ID ${id} non trouvé`, 404);
  }
}

module.exports = NotFoundError;