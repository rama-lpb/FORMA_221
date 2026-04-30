const { apiHref, toCollection, toInscriptionResource, toProblemDetails } = require('../utils/resources');

class InscriptionController {
  constructor(inscriptionService) {
    this.inscriptionService = inscriptionService;
  }

  create(req, res) {
    try {
      const created = this.inscriptionService.create(req.body);
      res.set('Location', apiHref(req, `/inscriptions/${created.id}`));
      return res.status(201).json(toInscriptionResource(req, created));
    } catch (error) {
      return res.status(error.statusCode || 500).type('application/problem+json').json(toProblemDetails(req, error));
    }
  }

  createForSession(req, res) {
    try {
      const created = this.inscriptionService.createForSession(req.params.sessionId, req.body);
      res.set('Location', apiHref(req, `/inscriptions/${created.id}`));
      return res.status(201).json(toInscriptionResource(req, created));
    } catch (error) {
      return res.status(error.statusCode || 500).type('application/problem+json').json(toProblemDetails(req, error));
    }
  }

  getAll(req, res) {
    try {
      const inscriptions = this.inscriptionService.getAll();
      const items = inscriptions.map(i => toInscriptionResource(req, i));
      return res.status(200).json(toCollection(req, items));
    } catch (error) {
      return res.status(error.statusCode || 500).type('application/problem+json').json(toProblemDetails(req, error));
    }
  }

  getById(req, res) {
    try {
      const inscription = this.inscriptionService.getById(req.params.id);
      return res.status(200).json(toInscriptionResource(req, inscription));
    } catch (error) {
      return res.status(error.statusCode || 500).type('application/problem+json').json(toProblemDetails(req, error));
    }
  }

  getBySessionId(req, res) {
    try {
      const inscriptions = this.inscriptionService.getBySessionId(req.params.sessionId);
      const items = inscriptions.map(i => toInscriptionResource(req, i));
      return res.status(200).json(toCollection(req, items));
    } catch (error) {
      return res.status(error.statusCode || 500).type('application/problem+json').json(toProblemDetails(req, error));
    }
  }

  delete(req, res) {
    try {
      this.inscriptionService.delete(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return res.status(error.statusCode || 500).type('application/problem+json').json(toProblemDetails(req, error));
    }
  }

  update(req, res) {
    try {
      const updated = this.inscriptionService.update(req.params.id, req.body);
      return res.status(200).json(toInscriptionResource(req, updated));
    } catch (error) {
      return res.status(error.statusCode || 500).type('application/problem+json').json(toProblemDetails(req, error));
    }
  }

  patch(req, res) {
    try {
      const updated = this.inscriptionService.patch(req.params.id, req.body);
      return res.status(200).json(toInscriptionResource(req, updated));
    } catch (error) {
      return res.status(error.statusCode || 500).type('application/problem+json').json(toProblemDetails(req, error));
    }
  }
}

module.exports = InscriptionController;
