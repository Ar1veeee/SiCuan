import { commonResponses } from '../utils/responses'

export const profilePaths = {
    '/profile': {
        get: {
            summary: 'Mendapatkan profil pengguna',
            tags: ['Profile'],
            security: [{ bearerAuth: [] }],
            responses: {
                '200': {
                    description: 'Profil berhasil diambil',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {
                                        type: 'boolean',
                                        example: true
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'Success'
                                    },
                                    data: {
                                        $ref: '#/components/schemas/UserProfile'
                                    }
                                }
                            }
                        }
                    }
                },
                ...commonResponses.unauthorized,
                ...commonResponses.notFound,
                ...commonResponses.serverError
            }
        }
    },

    '/profile/password': {
        patch: {
            summary: 'Memperbarui password pengguna',
            tags: ['Profile'],
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/UpdatePassword'
                        }
                    }
                }
            },
            responses: {
                '200': {
                    description: 'Password berhasil diperbarui',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/AuthSuccessResponse'
                            }
                        }
                    }
                },
                ...commonResponses.badRequest,
                ...commonResponses.unauthorized,
                ...commonResponses.serverError
            }
        }
    }
}