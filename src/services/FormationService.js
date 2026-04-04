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

    return {
      success: true,
      message: 'Formation créée avec succès',
      data: this.formationRepository.save(formation)
    };
  }

  getAll() {
    const formations = this.formationRepository.findAll();
    return {
      success: true,
      message: `${formations.length} formation(s) trouvée(s)`,
      data: formations
    };
  }

  getById(id) {
    const formation = this.formationRepository.findById(id);
    if (!formation) {
      throw new NotFoundError('Formation', id);
    }
    return {
      success: true,
      message: 'Formation trouvée',
      data: formation
    };
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
    return {
      success: true,
      message: 'Formation supprimée avec succès'
    };
  }
}

module.exports = FormationService;