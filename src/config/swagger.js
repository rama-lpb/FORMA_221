const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API FORMA 221 - Gestion centre de formation',
      version: '1.0.0',
      description: 'API pour gérer les formateurs, formations, sessions et inscriptions',
      contact: {
        name: 'Support API',
        email: 'support@forma221.sn'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Serveur local'
      }
    ],
	    components: {
	      schemas: {
	        Formateur: {
	          type: 'object',
	          required: ['prenom', 'nom', 'email', 'telephone', 'specialite'],
	          properties: {
	            id: {
	              type: 'string',
	              readOnly: true,
	              description: 'ID unique du formateur'
	            },
	            prenom: { 
	              type: 'string', 
	              example: 'Moussa',
	              description: 'Prénom du formateur (min 2 caractères)' 
	            },
            nom: { 
              type: 'string', 
              example: 'Sarr',
              description: 'Nom du formateur (min 2 caractères)' 
            },
            email: { 
              type: 'string', 
              example: 'moussa.sarr@forma221.sn',
              description: 'Email unique et valide' 
            },
            telephone: { 
              type: 'string', 
              example: '771234567',
              description: 'Numéro sénégalais (9 chiffres): 70, 75, 76, 77, 78' 
            },
            specialite: { 
              type: 'string', 
              example: 'Développement Web',
              description: 'Spécialité du formateur' 
            }
          }
        },
	        Formation: {
	          type: 'object',
	          required: ['code', 'titre', 'duree', 'prix', 'niveau'],
	          properties: {
	            id: {
	              type: 'string',
	              readOnly: true,
	              description: 'ID unique de la formation'
	            },
	            code: { 
	              type: 'string', 
	              example: 'DEV001',
	              description: 'Code unique de la formation' 
	            },
            titre: { 
              type: 'string', 
              example: 'Développement Web Avancé',
              description: 'Titre de la formation' 
            },
            duree: { 
              type: 'integer', 
              example: 40,
              description: 'Durée en heures (doit être > 0)' 
            },
            prix: { 
              type: 'number', 
              example: 150000,
              description: 'Prix de la formation en FCFA (doit être > 0)' 
            },
            niveau: { 
              type: 'string', 
              example: 'INTERMEDIAIRE',
              enum: ['DEBUTANT', 'INTERMEDIAIRE', 'AVANCE'], 
              description: 'Niveau de la formation' 
            }
          }
        },
	        Session: {
	          type: 'object',
	          required: ['formationId', 'formateurId', 'dateDebut', 'dateFin', 'placesMax'],
	          properties: {
	            id: {
	              type: 'string',
	              readOnly: true,
	              description: 'ID unique de la session'
	            },
	            formationId: { 
	              type: 'string', 
	              example: 'uuid-formation',
	              description: 'ID de la formation' 
	            },
            formateurId: { 
              type: 'string', 
              example: 'uuid-formateur',
              description: 'ID du formateur' 
            },
            dateDebut: { 
              type: 'string', 
              example: '2025-06-01',
              format: 'date', 
              description: 'Date de début (YYYY-MM-DD)' 
            },
            dateFin: { 
              type: 'string', 
              example: '2025-06-15',
              format: 'date', 
              description: 'Date de fin (doit être > dateDebut)' 
            },
            placesMax: { 
              type: 'integer', 
              example: 20,
              description: 'Nombre de places maximum (doit être > 0)' 
            }
          }
        },
	        Inscription: {
	          type: 'object',
	          required: ['nomParticipant', 'email', 'telephone', 'sessionId'],
	          properties: {
	            id: {
	              type: 'string',
	              readOnly: true,
	              description: 'ID unique de l\'inscription'
	            },
	            nomParticipant: { 
	              type: 'string', 
	              example: 'Aminata Diallo',
	              description: 'Nom du participant' 
	            },
            email: { 
              type: 'string', 
              example: 'aminata.diallo@email.sn',
              description: 'Email du participant' 
            },
            telephone: { 
              type: 'string', 
              example: '771234567',
              description: 'Téléphone du participant (9 chiffres)' 
            },
            sessionId: { 
              type: 'string', 
              example: 'uuid-session',
              description: 'ID de la session' 
            },
            dateInscription: { 
              type: 'string', 
              example: '2025-05-20',
              format: 'date', 
              description: 'Date d\'inscription (défaut: aujourd\'hui, ne peut pas être dans le futur)' 
            }
          }
        },
	        Link: {
	          type: 'object',
	          required: ['href'],
	          properties: {
	            href: { type: 'string', example: '/api/formateurs/uuid' }
	          }
	        },
	        ProblemDetails: {
	          type: 'object',
	          required: ['type', 'title', 'status', 'detail', 'instance'],
	          properties: {
	            type: { type: 'string', example: 'about:blank' },
	            title: { type: 'string', example: 'Request Error' },
	            status: { type: 'integer', example: 400 },
	            detail: { type: 'string', example: 'Le téléphone est obligatoire' },
	            instance: { type: 'string', example: '/api/formateurs' }
	          }
	        },
	        FormateurResource: {
	          allOf: [
	            { $ref: '#/components/schemas/Formateur' },
	            {
	              type: 'object',
	              required: ['_links'],
	              properties: {
	                _links: {
	                  type: 'object',
	                  properties: {
	                    self: { $ref: '#/components/schemas/Link' },
	                    collection: { $ref: '#/components/schemas/Link' }
	                  }
	                }
	              }
	            }
	          ]
	        },
	        FormationResource: {
	          allOf: [
	            { $ref: '#/components/schemas/Formation' },
	            {
	              type: 'object',
	              required: ['_links'],
	              properties: {
	                _links: {
	                  type: 'object',
	                  properties: {
	                    self: { $ref: '#/components/schemas/Link' },
	                    collection: { $ref: '#/components/schemas/Link' }
	                  }
	                }
	              }
	            }
	          ]
	        },
	        SessionResource: {
	          allOf: [
	            { $ref: '#/components/schemas/Session' },
	            {
	              type: 'object',
	              required: ['_links'],
	              properties: {
	                _links: {
	                  type: 'object',
	                  properties: {
	                    self: { $ref: '#/components/schemas/Link' },
	                    collection: { $ref: '#/components/schemas/Link' },
	                    formation: { $ref: '#/components/schemas/Link' },
	                    formateur: { $ref: '#/components/schemas/Link' },
	                    inscriptions: { $ref: '#/components/schemas/Link' }
	                  }
	                }
	              }
	            }
	          ]
	        },
	        InscriptionResource: {
	          allOf: [
	            { $ref: '#/components/schemas/Inscription' },
	            {
	              type: 'object',
	              required: ['_links'],
	              properties: {
	                _links: {
	                  type: 'object',
	                  properties: {
	                    self: { $ref: '#/components/schemas/Link' },
	                    collection: { $ref: '#/components/schemas/Link' },
	                    session: { $ref: '#/components/schemas/Link' },
	                    sessionInscriptions: { $ref: '#/components/schemas/Link' }
	                  }
	                }
	              }
	            }
	          ]
	        },
	        FormateurCollection: {
	          type: 'object',
	          required: ['count', 'items', '_links'],
	          properties: {
	            count: { type: 'integer', example: 1 },
	            items: { type: 'array', items: { $ref: '#/components/schemas/FormateurResource' } },
	            _links: {
	              type: 'object',
	              properties: { self: { $ref: '#/components/schemas/Link' } }
	            }
	          }
	        },
	        FormationCollection: {
	          type: 'object',
	          required: ['count', 'items', '_links'],
	          properties: {
	            count: { type: 'integer', example: 1 },
	            items: { type: 'array', items: { $ref: '#/components/schemas/FormationResource' } },
	            _links: {
	              type: 'object',
	              properties: { self: { $ref: '#/components/schemas/Link' } }
	            }
	          }
	        },
	        SessionCollection: {
	          type: 'object',
	          required: ['count', 'items', '_links'],
	          properties: {
	            count: { type: 'integer', example: 1 },
	            items: { type: 'array', items: { $ref: '#/components/schemas/SessionResource' } },
	            _links: {
	              type: 'object',
	              properties: { self: { $ref: '#/components/schemas/Link' } }
	            }
	          }
	        },
	        InscriptionCollection: {
	          type: 'object',
	          required: ['count', 'items', '_links'],
	          properties: {
	            count: { type: 'integer', example: 1 },
	            items: { type: 'array', items: { $ref: '#/components/schemas/InscriptionResource' } },
	            _links: {
	              type: 'object',
	              properties: { self: { $ref: '#/components/schemas/Link' } }
	            }
	          }
	        }
	      }
	    },
    paths: {
      '/formateurs': {
        post: {
          summary: 'Créer un formateur',
          tags: ['Formateurs'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Formateur' },
                example: {
                  prenom: 'Moussa',
                  nom: 'Sarr',
                  email: 'moussa.sarr@forma221.sn',
                  telephone: '771234567',
                  specialite: 'Développement Web'
                }
              }
            }
          },
	          responses: {
	            '201': { 
	              description: 'Formateur créé avec succès',
	              headers: {
	                Location: { schema: { type: 'string' }, description: 'URL de la ressource créée' }
	              },
	              content: { 'application/json': { schema: { $ref: '#/components/schemas/FormateurResource' } } }
	            },
	            '400': { 
	              description: 'Erreur de validation',
	              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
	            },
	            '409': { 
	              description: 'Conflit - Email déjà existant',
	              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
	            }
	          }
	        },
	        get: {
	          summary: 'Liste des formateurs',
	          tags: ['Formateurs'],
	          responses: {
	            '200': { 
	              description: 'Liste des formateurs',
	              content: { 'application/json': { schema: { $ref: '#/components/schemas/FormateurCollection' } } }
	            }
	          }
	        }
	      },
      '/formateurs/{id}': {
	        get: {
          summary: 'Obtenir un formateur par ID',
          tags: ['Formateurs'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID du formateur' }
          ],
	          responses: {
	            '200': { 
	              description: 'Formateur trouvé',
	              content: { 'application/json': { schema: { $ref: '#/components/schemas/FormateurResource' } } }
	            },
	            '404': { 
	              description: 'Formateur non trouvé',
	              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
	            }
	          }
	        },
	        put: {
          summary: 'Remplacer un formateur (PUT)',
          tags: ['Formateurs'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID du formateur' }
          ],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Formateur' } } }
          },
	          responses: {
	            '200': {
	              description: 'Formateur mis à jour',
	              content: { 'application/json': { schema: { $ref: '#/components/schemas/FormateurResource' } } }
	            },
	            '400': {
	              description: 'Erreur de validation',
	              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
	            },
	            '404': {
	              description: 'Formateur non trouvé',
	              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
	            },
	            '409': {
	              description: 'Conflit - Email déjà existant',
	              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
	            }
	          }
	        },
	        patch: {
          summary: 'Modifier partiellement un formateur (PATCH)',
          tags: ['Formateurs'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID du formateur' }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    prenom: { type: 'string' },
                    nom: { type: 'string' },
                    email: { type: 'string' },
                    telephone: { type: 'string' },
                    specialite: { type: 'string' }
                  }
                }
              }
            }
          },
	          responses: {
	            '200': {
	              description: 'Formateur mis à jour',
	              content: { 'application/json': { schema: { $ref: '#/components/schemas/FormateurResource' } } }
	            },
	            '400': {
	              description: 'Erreur de validation',
	              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
	            },
	            '404': {
	              description: 'Formateur non trouvé',
	              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
	            },
	            '409': {
	              description: 'Conflit - Email déjà existant',
	              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
	            }
	          }
	        },
	        delete: {
          summary: 'Supprimer un formateur',
          tags: ['Formateurs'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID du formateur' }
          ],
	          responses: {
	            '204': { description: 'Formateur supprimé' },
	            '400': { 
	              description: 'Impossible de supprimer - sessions existantes',
	              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
	            },
	            '404': { 
	              description: 'Formateur non trouvé',
	              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
	            }
	          }
	        }
	      },
      '/formations': {
        post: {
          summary: 'Créer une formation',
          tags: ['Formations'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Formation' },
                example: {
                  code: 'DEV001',
                  titre: 'Développement Web Avancé',
                  duree: 40,
                  prix: 150000,
                  niveau: 'INTERMEDIAIRE'
                }
              }
            }
          },
          responses: {
            '201': { 
              description: 'Formation créée avec succès',
              headers: {
                Location: { schema: { type: 'string' }, description: 'URL de la ressource créée' }
              },
              content: { 'application/json': { schema: { $ref: '#/components/schemas/FormationResource' } } }
            },
            '400': { 
              description: 'Erreur de validation',
              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
            },
            '409': { 
              description: 'Conflit - Code déjà existant',
              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
            }
          }
        },
        get: {
          summary: 'Liste des formations',
          tags: ['Formations'],
          responses: {
            '200': { 
              description: 'Liste des formations',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/FormationCollection' } } }
            }
          }
        }
      },
      '/formations/{id}': {
        get: {
          summary: 'Obtenir une formation par ID',
          tags: ['Formations'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID de la formation' }
          ],
          responses: {
            '200': { 
              description: 'Formation trouvée',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/FormationResource' } } }
            },
            '404': { 
              description: 'Formation non trouvée',
              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
            }
          }
        },
        put: {
          summary: 'Remplacer une formation (PUT)',
          tags: ['Formations'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID de la formation' }
          ],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Formation' } } }
          },
          responses: {
            '200': {
              description: 'Formation mise à jour',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/FormationResource' } } }
            },
            '400': {
              description: 'Erreur de validation',
              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
            },
            '404': {
              description: 'Formation non trouvée',
              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
            },
            '409': {
              description: 'Conflit - Code déjà existant',
              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
            }
          }
        },
        patch: {
          summary: 'Modifier partiellement une formation (PATCH)',
          tags: ['Formations'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID de la formation' }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    code: { type: 'string' },
                    titre: { type: 'string' },
                    duree: { type: 'integer' },
                    prix: { type: 'number' },
                    niveau: { type: 'string', enum: ['DEBUTANT', 'INTERMEDIAIRE', 'AVANCE'] }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Formation mise à jour',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/FormationResource' } } }
            },
            '400': {
              description: 'Erreur de validation',
              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
            },
            '404': {
              description: 'Formation non trouvée',
              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
            },
            '409': {
              description: 'Conflit - Code déjà existant',
              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
            }
          }
        },
        delete: {
          summary: 'Supprimer une formation',
          tags: ['Formations'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID de la formation' }
          ],
          responses: {
            '204': { description: 'Formation supprimée' },
            '400': { 
              description: 'Impossible de supprimer - sessions existantes',
              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
            },
            '404': { 
              description: 'Formation non trouvée',
              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
            }
          }
        }
      },
      '/sessions': {
        post: {
          summary: 'Planifier une session',
          tags: ['Sessions'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Session' },
                example: {
                  formationId: 'uuid-formation',
                  formateurId: 'uuid-formateur',
                  dateDebut: '2025-06-01',
                  dateFin: '2025-06-15',
                  placesMax: 20
                }
              }
            }
          },
          responses: {
            '201': { 
              description: 'Session créée avec succès',
              headers: {
                Location: { schema: { type: 'string' }, description: 'URL de la ressource créée' }
              },
              content: { 'application/json': { schema: { $ref: '#/components/schemas/SessionResource' } } }
            },
            '400': { 
              description: 'Erreur de validation (dates invalides, chevauchement, etc.)',
              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
            },
            '404': { 
              description: 'Formation ou formateur non trouvé',
              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
            }
          }
        },
        get: {
          summary: 'Liste des sessions',
          tags: ['Sessions'],
          responses: {
            '200': { 
              description: 'Liste des sessions',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/SessionCollection' } } }
            }
          }
        }
      },
      '/sessions/{id}': {
        get: {
          summary: 'Obtenir une session par ID',
          tags: ['Sessions'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID de la session' }
          ],
          responses: {
            '200': { 
              description: 'Session trouvée',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/SessionResource' } } }
            },
            '404': { 
              description: 'Session non trouvée',
              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
            }
          }
        },
        put: {
          summary: 'Remplacer une session (PUT)',
          tags: ['Sessions'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID de la session' }
          ],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Session' } } }
          },
          responses: {
            '200': {
              description: 'Session mise à jour',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/SessionResource' } } }
            },
            '400': {
              description: 'Erreur de validation',
              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
            },
            '404': {
              description: 'Session / formation / formateur non trouvé',
              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
            }
          }
        },
        patch: {
          summary: 'Modifier partiellement une session (PATCH)',
          tags: ['Sessions'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID de la session' }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    formationId: { type: 'string' },
                    formateurId: { type: 'string' },
                    dateDebut: { type: 'string', format: 'date' },
                    dateFin: { type: 'string', format: 'date' },
                    placesMax: { type: 'integer' },
                    statut: { type: 'string', enum: ['OUVERTE', 'COMPLETE', 'ANNULEE', 'TERMINEE'] }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Session mise à jour',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/SessionResource' } } }
            },
            '400': {
              description: 'Erreur de validation',
              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
            },
            '404': {
              description: 'Session / formation / formateur non trouvé',
              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
            }
          }
        },
        delete: {
          summary: 'Supprimer une session',
          tags: ['Sessions'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID de la session' }
          ],
          responses: {
            '204': { description: 'Session supprimée' },
            '400': { 
              description: 'Impossible de supprimer - inscriptions confirmées',
              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
            },
            '404': { 
              description: 'Session non trouvée',
              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
            }
          }
        }
      },
      '/sessions/{sessionId}/inscriptions': {
        post: {
          summary: 'Inscrire un participant à une session (REST)',
          tags: ['Inscriptions'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['nomParticipant', 'email', 'telephone'],
                  properties: {
                    nomParticipant: { type: 'string' },
                    email: { type: 'string' },
                    telephone: { type: 'string' },
                    dateInscription: { type: 'string', format: 'date' }
                  }
                }
              }
            }
          },
          parameters: [
            { name: 'sessionId', in: 'path', required: true, schema: { type: 'string' }, description: 'ID de la session' }
          ],
          responses: {
            '201': {
              description: 'Inscription créée avec succès',
              headers: {
                Location: { schema: { type: 'string' }, description: 'URL de la ressource créée' }
              },
              content: { 'application/json': { schema: { $ref: '#/components/schemas/InscriptionResource' } } }
            },
            '400': {
              description: 'Erreur de validation (session pleine, non ouverte, etc.)',
              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
            },
            '404': {
              description: 'Session non trouvée',
              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
            },
            '409': {
              description: 'Conflit - Email déjà inscrit à cette session',
              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
            }
          }
        },
        get: {
          summary: 'Liste des inscriptions d\'une session (REST)',
          tags: ['Inscriptions'],
          parameters: [
            { name: 'sessionId', in: 'path', required: true, schema: { type: 'string' }, description: 'ID de la session' }
          ],
          responses: {
            '200': {
              description: 'Liste des inscriptions pour la session',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/InscriptionCollection' } } }
            }
          }
        }
      },
      '/inscriptions': {
        get: {
          summary: 'Liste des inscriptions',
          tags: ['Inscriptions'],
          responses: {
            '200': { 
              description: 'Liste des inscriptions',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/InscriptionCollection' } } }
            }
          }
        }
      },
      '/inscriptions/{id}': {
        get: {
          summary: 'Obtenir une inscription par ID',
          tags: ['Inscriptions'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID de l\'inscription' }
          ],
          responses: {
            '200': { 
              description: 'Inscription trouvée',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/InscriptionResource' } } }
            },
            '404': { 
              description: 'Inscription non trouvée',
              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
            }
          }
        },
        put: {
          summary: 'Remplacer une inscription (PUT)',
          tags: ['Inscriptions'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID de l\'inscription' }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['nomParticipant', 'email', 'telephone'],
                  properties: {
                    nomParticipant: { type: 'string' },
                    email: { type: 'string' },
                    telephone: { type: 'string' },
                    statut: { type: 'string', enum: ['CONFIRMEE', 'ANNULEE'] }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Inscription mise à jour',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/InscriptionResource' } } }
            },
            '400': {
              description: 'Erreur de validation',
              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
            },
            '404': {
              description: 'Inscription non trouvée',
              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
            },
            '409': {
              description: 'Conflit - Email déjà inscrit à cette session',
              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
            }
          }
        },
        patch: {
          summary: 'Modifier partiellement une inscription (PATCH)',
          tags: ['Inscriptions'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID de l\'inscription' }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    nomParticipant: { type: 'string' },
                    email: { type: 'string' },
                    telephone: { type: 'string' },
                    statut: { type: 'string', enum: ['CONFIRMEE', 'ANNULEE'] }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Inscription mise à jour',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/InscriptionResource' } } }
            },
            '400': {
              description: 'Erreur de validation',
              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
            },
            '404': {
              description: 'Inscription non trouvée',
              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
            },
            '409': {
              description: 'Conflit - Email déjà inscrit à cette session',
              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
            }
          }
        },
        delete: {
          summary: 'Supprimer une inscription',
          tags: ['Inscriptions'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID de l\'inscription' }
          ],
          responses: {
            '204': { description: 'Inscription supprimée' },
            '404': {
              description: 'Inscription non trouvée',
              content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/ProblemDetails' } } }
            }
          }
        }
      },
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
