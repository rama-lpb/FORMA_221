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
    const formationId = Validator.validateRequiredString(data.formationId, 'L\'ID de la formation', 1);
    const formateurId = Validator.validateRequiredString(data.formateurId, 'L\'ID du formateur', 1);
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

    return this.sessionRepository.save(session);
  }

  checkFormateurAvailability(formateurId, dateDebut, dateFin, excludeSessionId = null) {
    const sessions = this.sessionRepository.findByFormateurId(formateurId);
    const newDateDebut = new Date(dateDebut);
    const newDateFin = new Date(dateFin);

    for (const session of sessions) {
      if (excludeSessionId && session.id === excludeSessionId) continue;
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
    return this.sessionRepository.findAll();
  }

  getById(id) {
    const session = this.sessionRepository.findById(id);
    if (!session) {
      throw new NotFoundError('Session', id);
    }
    return session;
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
    return;
  }

  update(id, data) {
    const existing = this.sessionRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Session', id);
    }

    const formationId = Validator.validateRequiredString(data.formationId, 'L\'ID de la formation', 1);
    const formateurId = Validator.validateRequiredString(data.formateurId, 'L\'ID du formateur', 1);
    const dateDebut = Validator.validateDate(data.dateDebut, 'La date de début');
    const dateFin = Validator.validateDate(data.dateFin, 'La date de fin');
    const placesMax = Validator.validatePositiveInteger(data.placesMax, 'Le nombre de places');
    const statut = Object.prototype.hasOwnProperty.call(data, 'statut')
      ? Validator.validateEnum(data.statut, 'Le statut', Object.values(SessionStatus))
      : existing.statut;

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

    const confirmedCount = existing.inscriptions.filter(i => i.statut === 'CONFIRMEE').length;
    if (placesMax < confirmedCount) {
      throw new ValidationError('Le nombre de places ne peut pas être inférieur au nombre d\'inscriptions confirmées');
    }

    if (statut !== SessionStatus.ANNULEE) {
      this.checkFormateurAvailability(formateurId, dateDebut, dateFin, id);
    }

    const updated = this.sessionRepository.update(id, {
      formationId,
      formateurId,
      dateDebut,
      dateFin,
      placesMax,
      statut
    });

    return updated;
  }

  patch(id, data) {
    const existing = this.sessionRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Session', id);
    }

    const updates = {};

    if (Object.prototype.hasOwnProperty.call(data, 'formationId')) {
      updates.formationId = Validator.validateRequiredString(data.formationId, 'L\'ID de la formation', 1);
      const formation = this.formationRepository.findById(updates.formationId);
      if (!formation) {
        throw new NotFoundError('Formation', updates.formationId);
      }
    }

    if (Object.prototype.hasOwnProperty.call(data, 'formateurId')) {
      updates.formateurId = Validator.validateRequiredString(data.formateurId, 'L\'ID du formateur', 1);
      const formateur = this.formateurRepository.findById(updates.formateurId);
      if (!formateur) {
        throw new NotFoundError('Formateur', updates.formateurId);
      }
    }

    if (Object.prototype.hasOwnProperty.call(data, 'dateDebut')) {
      updates.dateDebut = Validator.validateDate(data.dateDebut, 'La date de début');
    }

    if (Object.prototype.hasOwnProperty.call(data, 'dateFin')) {
      updates.dateFin = Validator.validateDate(data.dateFin, 'La date de fin');
    }

    if (Object.prototype.hasOwnProperty.call(data, 'placesMax')) {
      updates.placesMax = Validator.validatePositiveInteger(data.placesMax, 'Le nombre de places');
    }

    if (Object.prototype.hasOwnProperty.call(data, 'statut')) {
      updates.statut = Validator.validateEnum(data.statut, 'Le statut', Object.values(SessionStatus));
    }

    if (Object.keys(updates).length === 0) {
      throw new ValidationError('Aucun champ à mettre à jour');
    }

    const newFormationId = Object.prototype.hasOwnProperty.call(updates, 'formationId') ? updates.formationId : existing.formationId;
    const newFormateurId = Object.prototype.hasOwnProperty.call(updates, 'formateurId') ? updates.formateurId : existing.formateurId;
    const newDateDebut = Object.prototype.hasOwnProperty.call(updates, 'dateDebut') ? updates.dateDebut : existing.dateDebut;
    const newDateFin = Object.prototype.hasOwnProperty.call(updates, 'dateFin') ? updates.dateFin : existing.dateFin;
    const newPlacesMax = Object.prototype.hasOwnProperty.call(updates, 'placesMax') ? updates.placesMax : existing.placesMax;
    const newStatut = Object.prototype.hasOwnProperty.call(updates, 'statut') ? updates.statut : existing.statut;

    const dateDebutObj = new Date(newDateDebut);
    const dateFinObj = new Date(newDateFin);
    if (dateFinObj <= dateDebutObj) {
      throw new ValidationError('La date de fin doit être postérieure à la date de début');
    }

    const confirmedCount = existing.inscriptions.filter(i => i.statut === 'CONFIRMEE').length;
    if (newPlacesMax < confirmedCount) {
      throw new ValidationError('Le nombre de places ne peut pas être inférieur au nombre d\'inscriptions confirmées');
    }

    if (newStatut !== SessionStatus.ANNULEE) {
      this.checkFormateurAvailability(newFormateurId, newDateDebut, newDateFin, id);
    }

    const updated = this.sessionRepository.update(id, updates);

    return updated;
  }
}

module.exports = SessionService;
