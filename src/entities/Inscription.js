class Inscription {
  constructor({ id, nomParticipant, email, telephone, sessionId, dateInscription, statut }) {
    this.id = id;
    this.nomParticipant = nomParticipant;
    this.email = email;
    this.telephone = telephone;
    this.sessionId = sessionId;
    this.dateInscription = dateInscription;
    this.statut = statut;
  }

  static create(data) {
    const { v4: uuidv4 } = require('uuid');
    return new Inscription({ id: uuidv4(), ...data });
  }
}

module.exports = Inscription;