const Session = require('../entities/Session');
const { SessionStatus } = require('../entities/types');
const Validator = require('../utils/Validator');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');

class SessionService {
  constructor(sessionRepository, formationRepository, formateurRepository) {
    this.sessionRepository = sessionRepository;
    this.formationRepository = formationRepository;
    this.formateurRepository = formateurRepository;
  }

  create(data) {
    const formationId = data.formationId;
    const formateurId = data.formateurId;
    const dateDebut = Validator.validateDate(data.dateDebut, 'La date de début');
    const dateFin = Validator.validateDate(data.dateFin, 'La date de fin');
    const placesMax = Validator.validatePositiveInteger(data.placesMax, 'Le nombre de places');

    const dateDebutObj = new Date(dateDebut);
    const dateFinObj = new Date(dateFin);
    if (dateFinObj <= dateDebutObj) {
      throw new ValidationError('La date de fin doit être postérieure à la date de début');
    }

    const formation = this.formationRepository.findById(formationId);
    if (!formation) {
      throw new NotFoundError('Formation', formationId);
    }

    const formateur = this.formateurRepository.findById(formateurId);
    if (!formateur) {
      throw new NotFoundError('Formateur', formateurId);
    }

    this.checkFormateurAvailability(formateurId, dateDebut, dateFin);

    const session = Session.create({
      formationId,
      formateurId,
      dateDebut,
      dateFin,
      placesMax,
      statut: SessionStatus.OUVERTE
    });

    return {
      success: true,
      message: 'Session créée avec succès',
      data: this.sessionRepository.save(session)
    };
  }

  checkFormateurAvailability(formateurId, dateDebut, dateFin) {
    const sessions = this.sessionRepository.findByFormateurId(formateurId);
    const newDateDebut = new Date(dateDebut);
    const newDateFin = new Date(dateFin);

    for (const session of sessions) {
      if (session.statut === SessionStatus.ANNULEE) continue;
      
      const existingDateDebut = new Date(session.dateDebut);
      const existingDateFin = new Date(session.dateFin);

      const overlaps = newDateDebut < existingDateFin && newDateFin > existingDateDebut;
      if (overlaps) {
        throw new ValidationError('Le formateur a déjà une session pendant cette période');
      }
    }
  }

  getAll() {
    const sessions = this.sessionRepository.findAll();
    return {
      success: true,
      message: `${sessions.length} session(s) trouvée(s)`,
      data: sessions
    };
  }

  getById(id) {
    const session = this.sessionRepository.findById(id);
    if (!session) {
      throw new NotFoundError('Session', id);
    }
    return {
      success: true,
      message: 'Session trouvée',
      data: session
    };
  }

  delete(id) {
    const session = this.sessionRepository.findById(id);
    if (!session) {
      throw new NotFoundError('Session', id);
    }

    const hasConfirmedInscriptions = this.sessionRepository.hasConfirmedInscriptions(id);
    if (hasConfirmedInscriptions) {
      throw new ValidationError('Impossible de supprimer une session avec des inscriptions confirmées');
    }

    this.sessionRepository.delete(id);
    return {
      success: true,
      message: 'Session supprimée avec succès'
    };
  }
}

module.exports = SessionService;