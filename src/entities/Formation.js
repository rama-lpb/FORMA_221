class Formation {
  constructor({ id, code, titre, duree, prix, niveau }) {
    this.id = id;
    this.code = code;
    this.titre = titre;
    this.duree = duree;
    this.prix = prix;
    this.niveau = niveau;
  }

  static create(data) {
    const { v4: uuidv4 } = require('uuid');
    return new Formation({ id: uuidv4(), ...data });
  }
}

module.exports = Formation;