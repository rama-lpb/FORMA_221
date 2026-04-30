const Inscription = require('../entities/Inscription');
const { InscriptionStatus } = require('../entities/types');
const Validator = require('../utils/Validator');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

class InscriptionService {
  constructor(inscriptionRepository, sessionRepository) {
    this.inscriptionRepository = inscriptionRepository;
    this.sessionRepository = sessionRepository;
  }

  create(data) {
    const sessionId = Validator.validateRequiredString(data.sessionId, 'L\'ID de la session', 1);

    const nomParticipant = Validator.validateRequiredString(data.nomParticipant, 'Le nom du participant');
    const email = Validator.validateEmail(data.email);
    const telephone = Validator.validatePhone(data.telephone);

    const dateInscription = data.dateInscription 
      ? Validator.validateDate(data.dateInscription, 'La date d\'inscription', false)
      : new Date().toISOString().split('T')[0];

    const session = this.sessionRepository.findById(sessionId);
    if (!session) {
      throw new NotFoundError('Session', sessionId);
    }

    if (session.statut !== 'OUVERTE') {
      throw new ValidationError('La session doit être OUVERTE pour les inscriptions');
    }

    const existingInscription = this.inscriptionRepository.findByEmailAndSession(email, sessionId);
    if (existingInscription) {
      throw new ConflictError('Cet email est déjà inscrit à cette session');
    }

    const confirmedCount = this.inscriptionRepository.countBySessionId(sessionId);
    if (confirmedCount >= session.placesMax) {
      throw new ValidationError('Plus de places disponibles pour cette session');
    }

    const inscription = Inscription.create({
      nomParticipant,
      email,
      telephone,
      sessionId,
      dateInscription,
      statut: InscriptionStatus.CONFIRMEE
    });

    return this.inscriptionRepository.save(inscription, sessionId, this.sessionRepository.sessions);
  }

  createForSession(sessionId, data) {
    return this.create({ ...data, sessionId });
  }

  getAll() {
    return this.inscriptionRepository.findAll();
  }

  getById(id) {
    const inscription = this.inscriptionRepository.findById(id);
    if (!inscription) {
      throw new NotFoundError('Inscription', id);
    }
    return inscription;
  }

  getBySessionId(sessionId) {
    return this.inscriptionRepository.findBySessionId(sessionId);
  }

  delete(id) {
    const existing = this.inscriptionRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Inscription', id);
    }
    this.inscriptionRepository.delete(id, this.sessionRepository.sessions);
    return;
  }

  update(id, data) {
    const existing = this.inscriptionRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Inscription', id);
    }

    if (Object.prototype.hasOwnProperty.call(data, 'sessionId') && data.sessionId !== existing.sessionId) {
      throw new ValidationError('Le changement de session n\'est pas autorisé (supprimez puis recréez)');
    }

    const nomParticipant = Validator.validateRequiredString(data.nomParticipant, 'Le nom du participant');
    const email = Validator.validateEmail(data.email);
    const telephone = Validator.validatePhone(data.telephone);

    if (email !== existing.email) {
      const conflict = this.inscriptionRepository.findByEmailAndSession(email, existing.sessionId);
      if (conflict) {
        throw new ConflictError('Cet email est déjà inscrit à cette session');
      }
    }

    const updates = { nomParticipant, email, telephone };

    if (Object.prototype.hasOwnProperty.call(data, 'statut')) {
      updates.statut = Validator.validateEnum(data.statut, 'Le statut', Object.values(InscriptionStatus));
    }

    const updated = this.inscriptionRepository.update(id, updates);

    return updated;
  }

  patch(id, data) {
    const existing = this.inscriptionRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Inscription', id);
    }

    if (Object.prototype.hasOwnProperty.call(data, 'sessionId') && data.sessionId !== existing.sessionId) {
      throw new ValidationError('Le changement de session n\'est pas autorisé (supprimez puis recréez)');
    }

    const updates = {};

    if (Object.prototype.hasOwnProperty.call(data, 'nomParticipant')) {
      updates.nomParticipant = Validator.validateRequiredString(data.nomParticipant, 'Le nom du participant');
    }
    if (Object.prototype.hasOwnProperty.call(data, 'email')) {
      const email = Validator.validateEmail(data.email);
      if (email !== existing.email) {
        const conflict = this.inscriptionRepository.findByEmailAndSession(email, existing.sessionId);
        if (conflict) {
          throw new ConflictError('Cet email est déjà inscrit à cette session');
        }
      }
      updates.email = email;
    }
    if (Object.prototype.hasOwnProperty.call(data, 'telephone')) {
      updates.telephone = Validator.validatePhone(data.telephone);
    }
    if (Object.prototype.hasOwnProperty.call(data, 'statut')) {
      updates.statut = Validator.validateEnum(data.statut, 'Le statut', Object.values(InscriptionStatus));
    }

    if (Object.keys(updates).length === 0) {
      throw new ValidationError('Aucun champ à mettre à jour');
    }

    const updated = this.inscriptionRepository.update(id, updates);

    return updated;
  }
}

module.exports = InscriptionService;
