const { apiHref, toCollection, toSessionResource, toProblemDetails } = require('../utils/resources');

class SessionController {
  constructor(sessionService) {
    this.sessionService = sessionService;
  }

  create(req, res) {
    try {
      const created = this.sessionService.create(req.body);
      res.set('Location', apiHref(req, `/sessions/${created.id}`));
      return res.status(201).json(toSessionResource(req, created));
    } catch (error) {
      return res.status(error.statusCode || 500).type('application/problem+json').json(toProblemDetails(req, error));
    }
  }

  getAll(req, res) {
    try {
      const sessions = this.sessionService.getAll();
      const items = sessions.map(s => toSessionResource(req, s));
      return res.status(200).json(toCollection(req, items));
    } catch (error) {
      return res.status(error.statusCode || 500).type('application/problem+json').json(toProblemDetails(req, error));
    }
  }

  getById(req, res) {
    try {
      const session = this.sessionService.getById(req.params.id);
      return res.status(200).json(toSessionResource(req, session));
    } catch (error) {
      return res.status(error.statusCode || 500).type('application/problem+json').json(toProblemDetails(req, error));
    }
  }

  delete(req, res) {
    try {
      this.sessionService.delete(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return res.status(error.statusCode || 500).type('application/problem+json').json(toProblemDetails(req, error));
    }
  }

  update(req, res) {
    try {
      const updated = this.sessionService.update(req.params.id, req.body);
      return res.status(200).json(toSessionResource(req, updated));
    } catch (error) {
      return res.status(error.statusCode || 500).type('application/problem+json').json(toProblemDetails(req, error));
    }
  }

  patch(req, res) {
    try {
      const updated = this.sessionService.patch(req.params.id, req.body);
      return res.status(200).json(toSessionResource(req, updated));
    } catch (error) {
      return res.status(error.statusCode || 500).type('application/problem+json').json(toProblemDetails(req, error));
    }
  }
}

module.exports = SessionController;
