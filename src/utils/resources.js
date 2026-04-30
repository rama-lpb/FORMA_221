function apiHref(req, path) {
  const baseUrl = req.baseUrl || '';
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalized}`;
}

function toCollection(req, items) {
  return {
    count: items.length,
    items,
    _links: {
      self: { href: req.originalUrl }
    }
  };
}

function toFormateurResource(req, formateur) {
  return {
    ...formateur,
    _links: {
      self: { href: apiHref(req, `/formateurs/${formateur.id}`) },
      collection: { href: apiHref(req, '/formateurs') }
    }
  };
}

function toFormationResource(req, formation) {
  return {
    ...formation,
    _links: {
      self: { href: apiHref(req, `/formations/${formation.id}`) },
      collection: { href: apiHref(req, '/formations') }
    }
  };
}

function toSessionResource(req, session) {
  return {
    ...session,
    _links: {
      self: { href: apiHref(req, `/sessions/${session.id}`) },
      collection: { href: apiHref(req, '/sessions') },
      formation: { href: apiHref(req, `/formations/${session.formationId}`) },
      formateur: { href: apiHref(req, `/formateurs/${session.formateurId}`) },
      inscriptions: { href: apiHref(req, `/sessions/${session.id}/inscriptions`) }
    }
  };
}

function toInscriptionResource(req, inscription) {
  return {
    ...inscription,
    _links: {
      self: { href: apiHref(req, `/inscriptions/${inscription.id}`) },
      collection: { href: apiHref(req, '/inscriptions') },
      session: { href: apiHref(req, `/sessions/${inscription.sessionId}`) },
      sessionInscriptions: { href: apiHref(req, `/sessions/${inscription.sessionId}/inscriptions`) }
    }
  };
}

function toProblemDetails(req, error) {
  const status = error.statusCode || 500;
  const title = status >= 500 ? 'Internal Server Error' : 'Request Error';
  return {
    type: 'about:blank',
    title,
    status,
    detail: error.message || 'Une erreur est survenue',
    instance: req.originalUrl
  };
}

module.exports = {
  apiHref,
  toCollection,
  toFormateurResource,
  toFormationResource,
  toSessionResource,
  toInscriptionResource,
  toProblemDetails
};

