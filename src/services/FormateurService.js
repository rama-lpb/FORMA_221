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

    return this.formateurRepository.save(formateur);
  }

  getAll() {
    return this.formateurRepository.findAll();
  }

  getById(id) {
    const formateur = this.formateurRepository.findById(id);
    if (!formateur) {
      throw new NotFoundError('Formateur', id);
    }
    return formateur;
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
    return;
  }

  update(id, data) {
    const existing = this.formateurRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Formateur', id);
    }

    const prenom = Validator.validateRequiredString(data.prenom, 'Le prénom');
    const nom = Validator.validateRequiredString(data.nom, 'Le nom');
    const email = Validator.validateEmail(data.email);
    const telephone = Validator.validatePhone(data.telephone);
    const specialite = Validator.validateRequiredString(data.specialite, 'La spécialité');

    if (email !== existing.email) {
      const conflict = this.formateurRepository.findByEmail(email);
      if (conflict) {
        throw new ConflictError('Un formateur avec cet email existe déjà');
      }
    }

    const updated = this.formateurRepository.update(id, {
      prenom,
      nom,
      email,
      telephone,
      specialite
    });

    return updated;
  }

  patch(id, data) {
    const existing = this.formateurRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Formateur', id);
    }

    const updates = {};

    if (Object.prototype.hasOwnProperty.call(data, 'prenom')) {
      updates.prenom = Validator.validateRequiredString(data.prenom, 'Le prénom');
    }
    if (Object.prototype.hasOwnProperty.call(data, 'nom')) {
      updates.nom = Validator.validateRequiredString(data.nom, 'Le nom');
    }
    if (Object.prototype.hasOwnProperty.call(data, 'email')) {
      const email = Validator.validateEmail(data.email);
      if (email !== existing.email) {
        const conflict = this.formateurRepository.findByEmail(email);
        if (conflict) {
          throw new ConflictError('Un formateur avec cet email existe déjà');
        }
      }
      updates.email = email;
    }
    if (Object.prototype.hasOwnProperty.call(data, 'telephone')) {
      updates.telephone = Validator.validatePhone(data.telephone);
    }
    if (Object.prototype.hasOwnProperty.call(data, 'specialite')) {
      updates.specialite = Validator.validateRequiredString(data.specialite, 'La spécialité');
    }

    if (Object.keys(updates).length === 0) {
      throw new ValidationError('Aucun champ à mettre à jour');
    }

    const updated = this.formateurRepository.update(id, updates);

    return updated;
  }
}

module.exports = FormateurService;
