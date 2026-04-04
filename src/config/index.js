const FormateurRepository = require('../repositories/FormateurRepository');
const FormationRepository = require('../repositories/FormationRepository');
const SessionRepository = require('../repositories/SessionRepository');
const InscriptionRepository = require('../repositories/InscriptionRepository');

const FormateurService = require('../services/FormateurService');
const FormationService = require('../services/FormationService');
const SessionService = require('../services/SessionService');
const InscriptionService = require('../services/InscriptionService');

const FormateurController = require('../controllers/FormateurController');
const FormationController = require('../controllers/FormationController');
const SessionController = require('../controllers/SessionController');
const InscriptionController = require('../controllers/InscriptionController');

const repositories = {
  formateurRepository: new FormateurRepository(),
  formationRepository: new FormationRepository(),
  sessionRepository: new SessionRepository(),
  inscriptionRepository: new InscriptionRepository()
};

const services = {
  formateurService: new FormateurService(repositories.formateurRepository, repositories.sessionRepository),
  formationService: new FormationService(repositories.formationRepository, repositories.sessionRepository),
  sessionService: new SessionService(repositories.sessionRepository, repositories.formationRepository, repositories.formateurRepository),
  inscriptionService: new InscriptionService(repositories.inscriptionRepository, repositories.sessionRepository)
};

const controllers = {
  formateurController: new FormateurController(services.formateurService),
  formationController: new FormationController(services.formationService),
  sessionController: new SessionController(services.sessionService),
  inscriptionController: new InscriptionController(services.inscriptionService)
};

module.exports = { repositories, services, controllers };