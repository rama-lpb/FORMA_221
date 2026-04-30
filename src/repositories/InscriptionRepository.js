class InscriptionRepository {
  constructor() {
    this.inscriptions = [];
  }

  save(inscription, sessionId, sessions) {
    this.inscriptions.push(inscription);
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      session.inscriptions.push(inscription);
    }
    return inscription;
  }

  findById(id) {
    return this.inscriptions.find(i => i.id === id) || null;
  }

  findBySessionId(sessionId) {
    return this.inscriptions.filter(i => i.sessionId === sessionId);
  }

  findByEmailAndSession(email, sessionId) {
    return this.inscriptions.find(i => i.email === email && i.sessionId === sessionId) || null;
  }

  findAll() {
    return [...this.inscriptions];
  }

  countBySessionId(sessionId) {
    return this.inscriptions.filter(i => i.sessionId === sessionId && i.statut === 'CONFIRMEE').length;
  }

  update(id, updates) {
    const inscription = this.findById(id);
    if (!inscription) return null;
    Object.assign(inscription, updates);
    return inscription;
  }

  delete(id, sessions) {
    const index = this.inscriptions.findIndex(i => i.id === id);
    if (index === -1) return null;
    const [removed] = this.inscriptions.splice(index, 1);

    if (Array.isArray(sessions)) {
      const session = sessions.find(s => s.id === removed.sessionId);
      if (session) {
        session.inscriptions = session.inscriptions.filter(i => i.id !== id);
      }
    }

    return removed;
  }
}

module.exports = InscriptionRepository;
