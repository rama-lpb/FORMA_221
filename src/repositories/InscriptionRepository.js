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
}

module.exports = InscriptionRepository;