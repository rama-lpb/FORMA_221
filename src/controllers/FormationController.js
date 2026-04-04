class FormationController {
  constructor(formationService) {
    this.formationService = formationService;
  }

  create(req, res) {
    try {
      const result = this.formationService.create(req.body);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
  }

  getAll(req, res) {
    try {
      const result = this.formationService.getAll();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
  }

  getById(req, res) {
    try {
      const result = this.formationService.getById(req.params.id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
  }

  delete(req, res) {
    try {
      const result = this.formationService.delete(req.params.id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
  }
}

module.exports = FormationController;