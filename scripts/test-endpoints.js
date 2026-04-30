const http = require('http');
const stream = require('stream');
const app = require('../src/app');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function injectExpress(expressApp, method, url, body) {
  return new Promise((resolve, reject) => {
    const responseChunks = [];

    const socket = new stream.Duplex({
      read() {},
      write(chunk, enc, cb) {
        responseChunks.push(Buffer.from(chunk));
        cb();
      }
    });
    socket.encrypted = false;

    const req = new stream.Readable({ read() {} });
    req.method = method;
    req.url = url;
    req.headers = { accept: 'application/json' };
    req.socket = req.connection = socket;

    let requestBody = null;
    if (body !== undefined) {
      requestBody = JSON.stringify(body);
      req.headers['content-type'] = 'application/json';
      req.headers['content-length'] = Buffer.byteLength(requestBody).toString();
    }

    const res = new http.ServerResponse(req);
    res.assignSocket(socket);

    const timeout = setTimeout(() => {
      reject(new Error(`Timeout waiting for response: ${method} ${url}`));
    }, 1000);

    res.on('finish', () => {
      clearTimeout(timeout);
      const raw = Buffer.concat(responseChunks).toString('utf8');
      const separatorIndex = raw.indexOf('\r\n\r\n');
      const bodyText = separatorIndex >= 0 ? raw.slice(separatorIndex + 4) : raw;
      const headers = res.getHeaders();
      const contentType = (headers['content-type'] || '').toString();
      const json = contentType.includes('json') && bodyText ? JSON.parse(bodyText) : null;
      resolve({
        status: res.statusCode,
        headers,
        json,
        text: bodyText
      });
    });

    res.on('error', reject);
    socket.on('error', reject);

    if (requestBody) req.push(Buffer.from(requestBody));
    req.push(null);

    expressApp.handle(req, res, err => {
      if (err) reject(err);
    });
  });
}

async function requestJson(method, path, body) {
  const res = await injectExpress(app, method, path, body);
  if (res.status === 204) {
    return { ...res, json: null };
  }
  return res;
}

function expectProblemDetails(res) {
  const contentType = (res.headers['content-type'] || '').toString();
  assert(contentType.includes('application/problem+json'), `Expected application/problem+json, got: ${contentType}`);
  assert(res.json && typeof res.json === 'object', 'Expected JSON body for problem details');
  assert(typeof res.json.status === 'number', 'Expected problem details "status"');
  assert(typeof res.json.detail === 'string', 'Expected problem details "detail"');
  assert(typeof res.json.instance === 'string', 'Expected problem details "instance"');
}

function expectResource(obj) {
  assert(obj && typeof obj === 'object', 'Expected resource JSON object');
  assert(typeof obj.id === 'string' && obj.id.length > 0, 'Expected resource id');
  assert(obj._links && typeof obj._links === 'object', 'Expected resource _links');
  assert(obj._links.self && typeof obj._links.self.href === 'string', 'Expected _links.self.href');
}

function expectCollection(obj) {
  assert(obj && typeof obj === 'object', 'Expected collection JSON object');
  assert(typeof obj.count === 'number', 'Expected collection count');
  assert(Array.isArray(obj.items), 'Expected collection items array');
  assert(obj._links && obj._links.self && typeof obj._links.self.href === 'string', 'Expected collection _links.self.href');
}

async function run() {
  const state = {
    formateur: null,
    formation: null,
    session: null,
    inscription: null
  };

  const steps = [];
  const step = (name, fn) => steps.push({ name, fn });

  step('GET /api-docs', async () => {
    const res = await requestJson('GET', '/api-docs');
    assert(res.status === 301 || res.status === 200, `Expected 200/301, got ${res.status}`);
  });

  // Formateurs
  step('POST /api/formateurs', async () => {
    const res = await requestJson('POST', '/api/formateurs', {
      prenom: 'Moussa',
      nom: 'Sarr',
      email: 'moussa.sarr@forma221.sn',
      telephone: '771234567',
      specialite: 'Développement Web'
    });
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    assert(typeof res.headers.location === 'string', 'Expected Location header');
    expectResource(res.json);
    state.formateur = res.json;
  });

  step('GET /api/formateurs', async () => {
    const res = await requestJson('GET', '/api/formateurs');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    expectCollection(res.json);
    assert(res.json.items.some(i => i.id === state.formateur.id), 'Expected created formateur in collection');
  });

  step('GET /api/formateurs/:id', async () => {
    const res = await requestJson('GET', `/api/formateurs/${state.formateur.id}`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    expectResource(res.json);
  });

  step('PATCH /api/formateurs/:id', async () => {
    const res = await requestJson('PATCH', `/api/formateurs/${state.formateur.id}`, {
      specialite: 'Backend'
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    expectResource(res.json);
    assert(res.json.specialite === 'Backend', 'Expected patched specialite');
  });

  step('PUT /api/formateurs/:id', async () => {
    const res = await requestJson('PUT', `/api/formateurs/${state.formateur.id}`, {
      prenom: 'Moussa',
      nom: 'Sarr',
      email: 'moussa.sarr@forma221.sn',
      telephone: '771234567',
      specialite: 'API'
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    expectResource(res.json);
    assert(res.json.specialite === 'API', 'Expected updated specialite');
  });

  // Formations
  step('POST /api/formations', async () => {
    const res = await requestJson('POST', '/api/formations', {
      code: 'DEV001',
      titre: 'Développement Web Avancé',
      duree: 40,
      prix: 150000,
      niveau: 'INTERMEDIAIRE'
    });
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    assert(typeof res.headers.location === 'string', 'Expected Location header');
    expectResource(res.json);
    state.formation = res.json;
  });

  step('GET /api/formations', async () => {
    const res = await requestJson('GET', '/api/formations');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    expectCollection(res.json);
    assert(res.json.items.some(i => i.id === state.formation.id), 'Expected created formation in collection');
  });

  step('GET /api/formations/:id', async () => {
    const res = await requestJson('GET', `/api/formations/${state.formation.id}`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    expectResource(res.json);
  });

  step('PATCH /api/formations/:id', async () => {
    const res = await requestJson('PATCH', `/api/formations/${state.formation.id}`, {
      prix: 160000
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    expectResource(res.json);
    assert(res.json.prix === 160000, 'Expected patched prix');
  });

  step('PUT /api/formations/:id', async () => {
    const res = await requestJson('PUT', `/api/formations/${state.formation.id}`, {
      code: 'DEV001',
      titre: 'Développement Web Avancé',
      duree: 40,
      prix: 160000,
      niveau: 'INTERMEDIAIRE'
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    expectResource(res.json);
  });

  // Sessions
  step('POST /api/sessions', async () => {
    const res = await requestJson('POST', '/api/sessions', {
      formationId: state.formation.id,
      formateurId: state.formateur.id,
      dateDebut: '2026-04-20',
      dateFin: '2026-04-25',
      placesMax: 20
    });
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    assert(typeof res.headers.location === 'string', 'Expected Location header');
    expectResource(res.json);
    assert(res.json._links.inscriptions && typeof res.json._links.inscriptions.href === 'string', 'Expected session inscriptions link');
    state.session = res.json;
  });

  step('GET /api/sessions', async () => {
    const res = await requestJson('GET', '/api/sessions');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    expectCollection(res.json);
    assert(res.json.items.some(i => i.id === state.session.id), 'Expected created session in collection');
  });

  step('GET /api/sessions/:id', async () => {
    const res = await requestJson('GET', `/api/sessions/${state.session.id}`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    expectResource(res.json);
  });

  step('PATCH /api/sessions/:id', async () => {
    const res = await requestJson('PATCH', `/api/sessions/${state.session.id}`, {
      placesMax: 25
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    expectResource(res.json);
    assert(res.json.placesMax === 25, 'Expected patched placesMax');
  });

  step('PUT /api/sessions/:id', async () => {
    const res = await requestJson('PUT', `/api/sessions/${state.session.id}`, {
      formationId: state.formation.id,
      formateurId: state.formateur.id,
      dateDebut: '2026-04-20',
      dateFin: '2026-04-25',
      placesMax: 25,
      statut: 'OUVERTE'
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    expectResource(res.json);
  });

  // Inscriptions (nested)
  step('POST /api/sessions/:sessionId/inscriptions', async () => {
    const res = await requestJson('POST', `/api/sessions/${state.session.id}/inscriptions`, {
      nomParticipant: 'Aminata Diallo',
      email: 'aminata.diallo@email.sn',
      telephone: '771234567',
      dateInscription: '2026-04-13'
    });
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    assert(typeof res.headers.location === 'string', 'Expected Location header');
    expectResource(res.json);
    state.inscription = res.json;
  });

  step('GET /api/sessions/:sessionId/inscriptions', async () => {
    const res = await requestJson('GET', `/api/sessions/${state.session.id}/inscriptions`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    expectCollection(res.json);
    assert(res.json.items.some(i => i.id === state.inscription.id), 'Expected inscription in session inscriptions');
  });

  step('GET /api/inscriptions', async () => {
    const res = await requestJson('GET', '/api/inscriptions');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    expectCollection(res.json);
    assert(res.json.items.some(i => i.id === state.inscription.id), 'Expected created inscription in collection');
  });

  step('GET /api/inscriptions/:id', async () => {
    const res = await requestJson('GET', `/api/inscriptions/${state.inscription.id}`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    expectResource(res.json);
  });

  step('PATCH /api/inscriptions/:id', async () => {
    const res = await requestJson('PATCH', `/api/inscriptions/${state.inscription.id}`, {
      telephone: '781234567'
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    expectResource(res.json);
    assert(res.json.telephone === '781234567', 'Expected patched telephone');
  });

  step('PUT /api/inscriptions/:id', async () => {
    const res = await requestJson('PUT', `/api/inscriptions/${state.inscription.id}`, {
      nomParticipant: 'Aminata Diallo',
      email: 'aminata.diallo@email.sn',
      telephone: '781234567',
      statut: 'CONFIRMEE'
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    expectResource(res.json);
  });

  // Negative checks for business rules
  step('DELETE /api/sessions/:id (should fail with confirmed inscriptions)', async () => {
    const res = await requestJson('DELETE', `/api/sessions/${state.session.id}`);
    assert(res.status === 400, `Expected 400, got ${res.status}`);
    expectProblemDetails(res);
  });

  step('DELETE /api/inscriptions/:id', async () => {
    const res = await requestJson('DELETE', `/api/inscriptions/${state.inscription.id}`);
    assert(res.status === 204, `Expected 204, got ${res.status}`);
  });

  step('DELETE /api/sessions/:id', async () => {
    const res = await requestJson('DELETE', `/api/sessions/${state.session.id}`);
    assert(res.status === 204, `Expected 204, got ${res.status}`);
  });

  step('DELETE /api/formations/:id', async () => {
    const res = await requestJson('DELETE', `/api/formations/${state.formation.id}`);
    assert(res.status === 204, `Expected 204, got ${res.status}`);
  });

  step('DELETE /api/formateurs/:id', async () => {
    const res = await requestJson('DELETE', `/api/formateurs/${state.formateur.id}`);
    assert(res.status === 204, `Expected 204, got ${res.status}`);
  });

  // Not found example
  step('GET /api/formateurs/:id (404)', async () => {
    const res = await requestJson('GET', `/api/formateurs/${state.formateur.id}`);
    assert(res.status === 404, `Expected 404, got ${res.status}`);
    expectProblemDetails(res);
  });

  let passed = 0;
  for (let i = 0; i < steps.length; i += 1) {
    const s = steps[i];
    // eslint-disable-next-line no-console
    console.log(`- ${s.name}`);
    await s.fn();
    passed += 1;
  }

  // eslint-disable-next-line no-console
  console.log(`\nOK: ${passed}/${steps.length} endpoints checks passed`);
}

run().catch(err => {
  // eslint-disable-next-line no-console
  console.error('\nFAILED');
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
