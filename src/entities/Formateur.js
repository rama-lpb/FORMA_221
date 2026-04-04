class Formateur {
  constructor({ id, prenom, nom, email, telephone, specialite }) {
    this.id = id;
    this.prenom = prenom;
    this.nom = nom;
    this.email = email;
    this.telephone = telephone;
    this.specialite = specialite;
  }

  static create(data) {
    const { v4: uuidv4 } = require('uuid');
    return new Formateur({ id: uuidv4(), ...data });
  }
}

module.exports = Formateur;