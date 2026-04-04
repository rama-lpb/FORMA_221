const express = require('express');
const router = express.Router();

const { controllers } = require('../config');

router.post('/formateurs', (req, res) => controllers.formateurController.create(req, res));
router.get('/formateurs', (req, res) => controllers.formateurController.getAll(req, res));
router.get('/formateurs/:id', (req, res) => controllers.formateurController.getById(req, res));
router.delete('/formateurs/:id', (req, res) => controllers.formateurController.delete(req, res));

router.post('/formations', (req, res) => controllers.formationController.create(req, res));
router.get('/formations', (req, res) => controllers.formationController.getAll(req, res));
router.get('/formations/:id', (req, res) => controllers.formationController.getById(req, res));
router.delete('/formations/:id', (req, res) => controllers.formationController.delete(req, res));

router.post('/sessions', (req, res) => controllers.sessionController.create(req, res));
router.get('/sessions', (req, res) => controllers.sessionController.getAll(req, res));
router.get('/sessions/:id', (req, res) => controllers.sessionController.getById(req, res));
router.delete('/sessions/:id', (req, res) => controllers.sessionController.delete(req, res));

router.post('/inscriptions', (req, res) => controllers.inscriptionController.create(req, res));
router.get('/inscriptions', (req, res) => controllers.inscriptionController.getAll(req, res));
router.get('/inscriptions/:id', (req, res) => controllers.inscriptionController.getById(req, res));
router.get('/inscriptions/session/:sessionId', (req, res) => controllers.inscriptionController.getBySessionId(req, res));

module.exports = router;