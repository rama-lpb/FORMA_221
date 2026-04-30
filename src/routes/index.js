const express = require('express');
const router = express.Router();

const { controllers } = require('../config');

router.post('/formateurs', (req, res) => controllers.formateurController.create(req, res));
router.get('/formateurs', (req, res) => controllers.formateurController.getAll(req, res));
router.get('/formateurs/:id', (req, res) => controllers.formateurController.getById(req, res));
router.put('/formateurs/:id', (req, res) => controllers.formateurController.update(req, res));
router.patch('/formateurs/:id', (req, res) => controllers.formateurController.patch(req, res));
router.delete('/formateurs/:id', (req, res) => controllers.formateurController.delete(req, res));

router.post('/formations', (req, res) => controllers.formationController.create(req, res));
router.get('/formations', (req, res) => controllers.formationController.getAll(req, res));
router.get('/formations/:id', (req, res) => controllers.formationController.getById(req, res));
router.put('/formations/:id', (req, res) => controllers.formationController.update(req, res));
router.patch('/formations/:id', (req, res) => controllers.formationController.patch(req, res));
router.delete('/formations/:id', (req, res) => controllers.formationController.delete(req, res));

router.post('/sessions', (req, res) => controllers.sessionController.create(req, res));
router.get('/sessions', (req, res) => controllers.sessionController.getAll(req, res));
router.get('/sessions/:id', (req, res) => controllers.sessionController.getById(req, res));
router.put('/sessions/:id', (req, res) => controllers.sessionController.update(req, res));
router.patch('/sessions/:id', (req, res) => controllers.sessionController.patch(req, res));
router.delete('/sessions/:id', (req, res) => controllers.sessionController.delete(req, res));

router.post('/sessions/:sessionId/inscriptions', (req, res) => controllers.inscriptionController.createForSession(req, res));
router.get('/sessions/:sessionId/inscriptions', (req, res) => controllers.inscriptionController.getBySessionId(req, res));

router.get('/inscriptions', (req, res) => controllers.inscriptionController.getAll(req, res));
router.get('/inscriptions/:id', (req, res) => controllers.inscriptionController.getById(req, res));
router.put('/inscriptions/:id', (req, res) => controllers.inscriptionController.update(req, res));
router.patch('/inscriptions/:id', (req, res) => controllers.inscriptionController.patch(req, res));
router.delete('/inscriptions/:id', (req, res) => controllers.inscriptionController.delete(req, res));

module.exports = router;
