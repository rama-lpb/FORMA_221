class FormationRepository {
  constructor() {
    this.formations = [];
  }

  save(formation) {
    this.formations.push(formation);
    return formation;
  }

  findById(id) {
    return this.formations.find(f => f.id === id) || null;
  }

  findByCode(code) {
    return this.formations.find(f => f.code === code) || null;
  }

  findAll() {
    return [...this.formations];
  }

  delete(id) {
    const index = this.formations.findIndex(f => f.id === id);
    if (index === -1) return false;
    this.formations.splice(index, 1);
    return true;
  }
}

module.exports = FormationRepository;