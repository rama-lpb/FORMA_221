class FormateurRepository {
  constructor() {
    this.formateurs = [];
  }

  save(formateur) {
    this.formateurs.push(formateur);
    return formateur;
  }

  findById(id) {
    return this.formateurs.find(f => f.id === id) || null;
  }

  findByEmail(email) {
    return this.formateurs.find(f => f.email === email) || null;
  }

  findAll() {
    return [...this.formateurs];
  }

  update(id, updates) {
    const formateur = this.findById(id);
    if (!formateur) return null;
    Object.assign(formateur, updates);
    return formateur;
  }

  delete(id) {
    const index = this.formateurs.findIndex(f => f.id === id);
    if (index === -1) return false;
    this.formateurs.splice(index, 1);
    return true;
  }
}

module.exports = FormateurRepository;
