class FormateurController {
  constructor(formateurService) {
    this.formateurService = formateurService;
  }

  create(req, res) {
    try {
      const result = this.formateurService.create(req.body);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
  }

  getAll(req, res) {
    try {
      const result = this.formateurService.getAll();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
  }

  getById(req, res) {
    try {
      const result = this.formateurService.getById(req.params.id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
  }

  delete(req, res) {
    try {
      const result = this.formateurService.delete(req.params.id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
  }
}

module.exports = FormateurController;