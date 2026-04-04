const Formateur = require('../entities/Formateur');
const Validator = require('../utils/Validator');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');

class FormateurService {
  constructor(formateurRepository, sessionRepository) {
    this.formateurRepository = formateurRepository;
    this.sessionRepository = sessionRepository;
  }

  create(data) {
    const prenom = Validator.validateRequiredString(data.prenom, 'Le prénom');
    const nom = Validator.validateRequiredString(data.nom, 'Le nom');
    const email = Validator.validateEmail(data.email);
    const telephone = Validator.validatePhone(data.telephone);
    const specialite = Validator.validateRequiredString(data.specialite, 'La spécialité');

    const existingFormateur = this.formateurRepository.findByEmail(email);
    if (existingFormateur) {
      throw new ConflictError('Un formateur avec cet email existe déjà');
    }

    const formateur = Formateur.create({
      prenom,
      nom,
      email,
      telephone,
      specialite
    });

    return {
      success: true,
      message: 'Formateur créé avec succès',
      data: this.formateurRepository.save(formateur)
    };
  }

  getAll() {
    const formateurs = this.formateurRepository.findAll();
    return {
      success: true,
      message: `${formateurs.length} formateur(s) trouvé(s)`,
      data: formateurs
    };
  }

  getById(id) {
    const formateur = this.formateurRepository.findById(id);
    if (!formateur) {
      throw new NotFoundError('Formateur', id);
    }
    return {
      success: true,
      message: 'Formateur trouvé',
      data: formateur
    };
  }

  delete(id) {
    const formateur = this.formateurRepository.findById(id);
    if (!formateur) {
      throw new NotFoundError('Formateur', id);
    }

    const sessions = this.sessionRepository.findByFormateurId(id);
    if (sessions.length > 0) {
      throw new ValidationError('Impossible de supprimer un formateur qui a des sessions');
    }

    this.formateurRepository.delete(id);
    return {
      success: true,
      message: 'Formateur supprimé avec succès'
    };
  }
}

module.exports = FormateurService;