const { apiHref, toCollection, toFormateurResource, toProblemDetails } = require('../utils/resources');

class FormateurController {
  constructor(formateurService) {
    this.formateurService = formateurService;
  }

  create(req, res) {
    try {
      const created = this.formateurService.create(req.body);
      res.set('Location', apiHref(req, `/formateurs/${created.id}`));
      return res.status(201).json(toFormateurResource(req, created));
    } catch (error) {
      return res.status(error.statusCode || 500).type('application/problem+json').json(toProblemDetails(req, error));
    }
  }

  getAll(req, res) {
    try {
      const formateurs = this.formateurService.getAll();
      const items = formateurs.map(f => toFormateurResource(req, f));
      return res.status(200).json(toCollection(req, items));
    } catch (error) {
      return res.status(error.statusCode || 500).type('application/problem+json').json(toProblemDetails(req, error));
    }
  }

  getById(req, res) {
    try {
      const formateur = this.formateurService.getById(req.params.id);
      return res.status(200).json(toFormateurResource(req, formateur));
    } catch (error) {
      return res.status(error.statusCode || 500).type('application/problem+json').json(toProblemDetails(req, error));
    }
  }

  delete(req, res) {
    try {
      this.formateurService.delete(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return res.status(error.statusCode || 500).type('application/problem+json').json(toProblemDetails(req, error));
    }
  }

  update(req, res) {
    try {
      const updated = this.formateurService.update(req.params.id, req.body);
      return res.status(200).json(toFormateurResource(req, updated));
    } catch (error) {
      return res.status(error.statusCode || 500).type('application/problem+json').json(toProblemDetails(req, error));
    }
  }

  patch(req, res) {
    try {
      const updated = this.formateurService.patch(req.params.id, req.body);
      return res.status(200).json(toFormateurResource(req, updated));
    } catch (error) {
      return res.status(error.statusCode || 500).type('application/problem+json').json(toProblemDetails(req, error));
    }
  }
}

module.exports = FormateurController;
