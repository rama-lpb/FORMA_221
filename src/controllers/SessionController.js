class SessionController {
  constructor(sessionService) {
    this.sessionService = sessionService;
  }

  create(req, res) {
    try {
      const result = this.sessionService.create(req.body);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
  }

  getAll(req, res) {
    try {
      const result = this.sessionService.getAll();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
  }

  getById(req, res) {
    try {
      const result = this.sessionService.getById(req.params.id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
  }

  delete(req, res) {
    try {
      const result = this.sessionService.delete(req.params.id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
  }
}

module.exports = SessionController;