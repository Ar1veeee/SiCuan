import swaggerJsdoc from 'swagger-jsdoc'
import { authSchemas } from './schemas/auth.schemas'
import { profileSchemas } from './schemas/profile.schemas'
import { menuSchemas } from './schemas/menu.schemas'
import { resepSchemas } from './schemas/resep.schemas'
import { stockSchemas } from './schemas/stock.schemas'
import { commonSchemas } from './schemas/common.schemas'
import { authPaths } from './paths/auth.paths'
import { profilePaths } from './paths/profile.paths'
import { menuPaths } from './paths/menu.paths'
import { resepPaths } from './paths/resep.paths'
import { stockPaths } from './paths/stock.paths'

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SiCuan API Documentation',
            version: '1.0.0',
            description: 'Dokumentasi API untuk aplikasi SiCuan',
            contact: {
                name: 'Tim Pengembang SiCuan',
                email: 'aliefarifin99@gmail.com',
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
            schemas: {
                ...authSchemas,
                ...profileSchemas,
                ...menuSchemas,
                ...resepSchemas,
                ...stockSchemas,
                ...commonSchemas,
            }
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
        paths: {
            ...authPaths,
            ...profilePaths,
            ...menuPaths,
            ...resepPaths,
            ...stockPaths,
        }
    },
    apis: []
}

const specs = swaggerJsdoc(options)

export default specs