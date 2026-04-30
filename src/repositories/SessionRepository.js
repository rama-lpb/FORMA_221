class SessionRepository {
  constructor() {
    this._sessions = [];
  }

  get sessions() {
    return this._sessions;
  }

  save(session) {
    this._sessions.push(session);
    return session;
  }

  findById(id) {
    return this._sessions.find(s => s.id === id) || null;
  }

  findByFormateurId(formateurId) {
    return this._sessions.filter(s => s.formateurId === formateurId);
  }

  findByFormationId(formationId) {
    return this._sessions.filter(s => s.formationId === formationId);
  }

  findAll() {
    return [...this._sessions];
  }

  update(id, updates) {
    const session = this.findById(id);
    if (!session) return null;
    Object.assign(session, updates);
    return session;
  }

  delete(id) {
    const index = this._sessions.findIndex(s => s.id === id);
    if (index === -1) return false;
    this._sessions.splice(index, 1);
    return true;
  }

  hasConfirmedInscriptions(sessionId) {
    const session = this.findById(sessionId);
    if (!session) return false;
    return session.inscriptions.some(i => i.statut === 'CONFIRMEE');
  }
}

module.exports = SessionRepository;
