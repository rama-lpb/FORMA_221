class Session {
  constructor({ id, formationId, formateurId, dateDebut, dateFin, placesMax, statut, inscriptions = [] }) {
    this.id = id;
    this.formationId = formationId;
    this.formateurId = formateurId;
    this.dateDebut = dateDebut;
    this.dateFin = dateFin;
    this.placesMax = placesMax;
    this.statut = statut;
    this.inscriptions = inscriptions;
  }

  static create(data) {
    const { v4: uuidv4 } = require('uuid');
    return new Session({ id: uuidv4(), ...data, inscriptions: [] });
  }
}

module.exports = Session;