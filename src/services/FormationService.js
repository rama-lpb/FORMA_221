const Formation = require('../entities/Formation');
const { FormationLevel } = require('../entities/types');
const Validator = require('../utils/Validator');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');

class FormationService {
  constructor(formationRepository, sessionRepository) {
    this.formationRepository = formationRepository;
    this.sessionRepository = sessionRepository;
  }

  create(data) {
    const code = Validator.validateRequiredString(data.code, 'Le code', 1);
    const titre = Validator.validateRequiredString(data.titre, 'Le titre');
    const duree = Validator.validatePositiveInteger(data.duree, 'La durée');
    const prix = Validator.validatePositiveNumber(data.prix, 'Le prix');
    Validator.validateEnum(data.niveau, 'Le niveau', Object.values(FormationLevel));

    const existingFormation = this.formationRepository.findByCode(code);
    if (existingFormation) {
      throw new ConflictError('Une formation avec ce code existe déjà');
    }

    const formation = Formation.create({
      code,
      titre,
      duree,
      prix,
      niveau: data.niveau
    });

    return this.formationRepository.save(formation);
  }

  getAll() {
    return this.formationRepository.findAll();
  }

  getById(id) {
    const formation = this.formationRepository.findById(id);
    if (!formation) {
      throw new NotFoundError('Formation', id);
    }
    return formation;
  }

  delete(id) {
    const formation = this.formationRepository.findById(id);
    if (!formation) {
      throw new NotFoundError('Formation', id);
    }

    const sessions = this.sessionRepository.findByFormationId(id);
    if (sessions.length > 0) {
      throw new ValidationError('Impossible de supprimer une formation qui a des sessions');
    }

    this.formationRepository.delete(id);
    return;
  }

  update(id, data) {
    const existing = this.formationRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Formation', id);
    }

    const code = Validator.validateRequiredString(data.code, 'Le code', 1);
    const titre = Validator.validateRequiredString(data.titre, 'Le titre');
    const duree = Validator.validatePositiveInteger(data.duree, 'La durée');
    const prix = Validator.validatePositiveNumber(data.prix, 'Le prix');
    const niveau = Validator.validateEnum(data.niveau, 'Le niveau', Object.values(FormationLevel));

    if (code !== existing.code) {
      const conflict = this.formationRepository.findByCode(code);
      if (conflict) {
        throw new ConflictError('Une formation avec ce code existe déjà');
      }
    }

    const updated = this.formationRepository.update(id, {
      code,
      titre,
      duree,
      prix,
      niveau
    });

    return updated;
  }

  patch(id, data) {
    const existing = this.formationRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Formation', id);
    }

    const updates = {};

    if (Object.prototype.hasOwnProperty.call(data, 'code')) {
      const code = Validator.validateRequiredString(data.code, 'Le code', 1);
      if (code !== existing.code) {
        const conflict = this.formationRepository.findByCode(code);
        if (conflict) {
          throw new ConflictError('Une formation avec ce code existe déjà');
        }
      }
      updates.code = code;
    }
    if (Object.prototype.hasOwnProperty.call(data, 'titre')) {
      updates.titre = Validator.validateRequiredString(data.titre, 'Le titre');
    }
    if (Object.prototype.hasOwnProperty.call(data, 'duree')) {
      updates.duree = Validator.validatePositiveInteger(data.duree, 'La durée');
    }
    if (Object.prototype.hasOwnProperty.call(data, 'prix')) {
      updates.prix = Validator.validatePositiveNumber(data.prix, 'Le prix');
    }
    if (Object.prototype.hasOwnProperty.call(data, 'niveau')) {
      updates.niveau = Validator.validateEnum(data.niveau, 'Le niveau', Object.values(FormationLevel));
    }

    if (Object.keys(updates).length === 0) {
      throw new ValidationError('Aucun champ à mettre à jour');
    }

    const updated = this.formationRepository.update(id, updates);

    return updated;
  }
}

module.exports = FormationService;
