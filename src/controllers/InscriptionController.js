class InscriptionController {
  constructor(inscriptionService) {
    this.inscriptionService = inscriptionService;
  }

  create(req, res) {
    try {
      const result = this.inscriptionService.create(req.body);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
  }

  getAll(req, res) {
    try {
      const result = this.inscriptionService.getAll();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
  }

  getById(req, res) {
    try {
      const result = this.inscriptionService.getById(req.params.id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
  }

  getBySessionId(req, res) {
    try {
      const result = this.inscriptionService.getBySessionId(req.params.sessionId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
  }
}

module.exports = InscriptionController;