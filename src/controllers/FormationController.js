const { apiHref, toCollection, toFormationResource, toProblemDetails } = require('../utils/resources');

class FormationController {
  constructor(formationService) {
    this.formationService = formationService;
  }

  create(req, res) {
    try {
      const created = this.formationService.create(req.body);
      res.set('Location', apiHref(req, `/formations/${created.id}`));
      return res.status(201).json(toFormationResource(req, created));
    } catch (error) {
      return res.status(error.statusCode || 500).type('application/problem+json').json(toProblemDetails(req, error));
    }
  }

  getAll(req, res) {
    try {
      const formations = this.formationService.getAll();
      const items = formations.map(f => toFormationResource(req, f));
      return res.status(200).json(toCollection(req, items));
    } catch (error) {
      return res.status(error.statusCode || 500).type('application/problem+json').json(toProblemDetails(req, error));
    }
  }

  getById(req, res) {
    try {
      const formation = this.formationService.getById(req.params.id);
      return res.status(200).json(toFormationResource(req, formation));
    } catch (error) {
      return res.status(error.statusCode || 500).type('application/problem+json').json(toProblemDetails(req, error));
    }
  }

  delete(req, res) {
    try {
      this.formationService.delete(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return res.status(error.statusCode || 500).type('application/problem+json').json(toProblemDetails(req, error));
    }
  }

  update(req, res) {
    try {
      const updated = this.formationService.update(req.params.id, req.body);
      return res.status(200).json(toFormationResource(req, updated));
    } catch (error) {
      return res.status(error.statusCode || 500).type('application/problem+json').json(toProblemDetails(req, error));
    }
  }

  patch(req, res) {
    try {
      const updated = this.formationService.patch(req.params.id, req.body);
      return res.status(200).json(toFormationResource(req, updated));
    } catch (error) {
      return res.status(error.statusCode || 500).type('application/problem+json').json(toProblemDetails(req, error));
    }
  }
}

module.exports = FormationController;
