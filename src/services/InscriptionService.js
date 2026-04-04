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
    if (!data.sessionId) {
      throw new ValidationError('L\'ID de la session est obligatoire');
    }

    const nomParticipant = Validator.validateRequiredString(data.nomParticipant, 'Le nom du participant');
    const email = Validator.validateEmail(data.email);
    const telephone = Validator.validatePhone(data.telephone);
    const sessionId = data.sessionId;

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

    return {
      success: true,
      message: 'Participant inscrit avec succès',
      data: this.inscriptionRepository.save(inscription, sessionId, this.sessionRepository.sessions)
    };
  }

  getAll() {
    const inscriptions = this.inscriptionRepository.findAll();
    return {
      success: true,
      message: `${inscriptions.length} inscription(s) trouvée(s)`,
      data: inscriptions
    };
  }

  getById(id) {
    const inscription = this.inscriptionRepository.findById(id);
    if (!inscription) {
      throw new NotFoundError('Inscription', id);
    }
    return {
      success: true,
      message: 'Inscription trouvée',
      data: inscription
    };
  }

  getBySessionId(sessionId) {
    const inscriptions = this.inscriptionRepository.findBySessionId(sessionId);
    return {
      success: true,
      message: `${inscriptions.length} inscription(s) trouvée(s) pour cette session`,
      data: inscriptions
    };
  }
}

module.exports = InscriptionService;