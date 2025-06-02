import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SiCuan API Documentation',
      version: '1.0.0',
      description: 'Dokumentasi API untuk aplikasi SiCuan',
      contact: {
        name: 'Tim Pengembang SiCuan',
        email: 'aliefarifin99.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Development Server',
      },
      {
        url: 'https://sicuan-api-678045816602.asia-southeast2.run.app',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Authentication dan Authorization',
      },
      {
        name: 'Profile',
        description: 'Manajemen profil pengguna',
      },
      {
        name: 'Menu',
        description: 'Manajemen menu',
      },
      {
        name: 'Resep',
        description: 'Manajemen resep/HPP',
      },
      {
        name: 'Stock',
        description: 'Manajemen stok',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'], // Path ke file rute dan model Anda
};

const specs = swaggerJsdoc(options);

export default specs;