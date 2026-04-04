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
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Opération réussie' },
            data: { type: 'object', description: 'Données de la réponse' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Description de l\'erreur' }
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
            '200': { 
              description: 'Formateur créé avec succès',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } }
            },
            '400': { 
              description: 'Erreur de validation',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
            },
            '409': { 
              description: 'Conflit - Email déjà existant',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
            }
          }
        },
        get: {
          summary: 'Liste des formateurs',
          tags: ['Formateurs'],
          responses: {
            '200': { 
              description: 'Liste des formateurs',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } }
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
              content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } }
            },
            '404': { 
              description: 'Formateur non trouvé',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
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
            '200': { 
              description: 'Formateur supprimé',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } }
            },
            '400': { 
              description: 'Impossible de supprimer - sessions existantes',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
            },
            '404': { 
              description: 'Formateur non trouvé',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
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
            '200': { 
              description: 'Formation créée avec succès',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } }
            },
            '400': { 
              description: 'Erreur de validation',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
            },
            '409': { 
              description: 'Conflit - Code déjà existant',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
            }
          }
        },
        get: {
          summary: 'Liste des formations',
          tags: ['Formations'],
          responses: {
            '200': { 
              description: 'Liste des formations',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } }
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
              content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } }
            },
            '404': { 
              description: 'Formation non trouvée',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
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
            '200': { 
              description: 'Formation supprimée',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } }
            },
            '400': { 
              description: 'Impossible de supprimer - sessions existantes',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
            },
            '404': { 
              description: 'Formation non trouvée',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
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
            '200': { 
              description: 'Session créée avec succès',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } }
            },
            '400': { 
              description: 'Erreur de validation (dates invalides, chevauchement, etc.)',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
            },
            '404': { 
              description: 'Formation ou formateur non trouvé',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
            }
          }
        },
        get: {
          summary: 'Liste des sessions',
          tags: ['Sessions'],
          responses: {
            '200': { 
              description: 'Liste des sessions',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } }
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
              content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } }
            },
            '404': { 
              description: 'Session non trouvée',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
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
            '200': { 
              description: 'Session supprimée',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } }
            },
            '400': { 
              description: 'Impossible de supprimer - inscriptions confirmées',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
            },
            '404': { 
              description: 'Session non trouvée',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
            }
          }
        }
      },
      '/inscriptions': {
        post: {
          summary: 'Inscrire un participant',
          tags: ['Inscriptions'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Inscription' },
                example: {
                  nomParticipant: 'Aminata Diallo',
                  email: 'aminata.diallo@email.sn',
                  telephone: '771234567',
                  sessionId: 'uuid-session'
                }
              }
            }
          },
          responses: {
            '200': { 
              description: 'Inscription créée avec succès',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } }
            },
            '400': { 
              description: 'Erreur de validation (session pleine, non ouverte, etc.)',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
            },
            '404': { 
              description: 'Session non trouvée',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
            },
            '409': { 
              description: 'Conflit - Email déjà inscrit à cette session',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
            }
          }
        },
        get: {
          summary: 'Liste des inscriptions',
          tags: ['Inscriptions'],
          responses: {
            '200': { 
              description: 'Liste des inscriptions',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } }
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
              content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } }
            },
            '404': { 
              description: 'Inscription non trouvée',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
            }
          }
        }
      },
      '/inscriptions/session/{sessionId}': {
        get: {
          summary: 'Liste des inscriptions par session',
          tags: ['Inscriptions'],
          parameters: [
            { name: 'sessionId', in: 'path', required: true, schema: { type: 'string' }, description: 'ID de la session' }
          ],
          responses: {
            '200': { 
              description: 'Liste des inscriptions pour la session',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;