import { commonResponses } from '../utils/responses'
import { menuIdParameter, bahanIdParameter } from '../utils/parameters'

export const resepPaths = {
    '/resep/{menu_id}': {
        get: {
            summary: 'Mendapatkan semua bahan dari resep menu',
            tags: ['Resep'],
            security: [{ bearerAuth: [] }],
            parameters: [menuIdParameter],
            responses: {
                '200': {
                    description: 'Daftar bahan resep berhasil diambil',
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
                                        type: 'object',
                                        properties: {
                                            recipes: {
                                                type: 'array',
                                                items: {
                                                    $ref: '#/components/schemas/RecipeResponse'
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                ...commonResponses.unauthorized,
                ...commonResponses.forbidden,
                ...commonResponses.notFound,
                ...commonResponses.serverError
            }
        },

        post: {
            summary: 'Menambah bahan baru ke resep menu',
            tags: ['Resep'],
            security: [{ bearerAuth: [] }],
            parameters: [menuIdParameter],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/BahanRequest'
                        }
                    }
                }
            },
            responses: {
                '201': {
                    description: 'Bahan berhasil ditambahkan ke resep',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/BahanRequestSuccessResponse'
                            }
                        }
                    }
                },
                ...commonResponses.badRequest,
                ...commonResponses.unauthorized,
                ...commonResponses.forbidden,
                ...commonResponses.notFound,
                ...commonResponses.serverError
            }
        }
    },

    '/resep/{menu_id}/{bahan_id}': {
        put: {
            summary: 'Mengubah bahan dalam resep menu',
            tags: ['Resep'],
            security: [{ bearerAuth: [] }],
            parameters: [menuIdParameter, bahanIdParameter],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/BahanRequest'
                        }
                    }
                }
            },
            responses: {
                '200': {
                    description: 'Bahan berhasil diperbarui',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/UpdateBahanSuccessResponse'
                            }
                        }
                    }
                },
                ...commonResponses.badRequest,
                ...commonResponses.unauthorized,
                ...commonResponses.forbidden,
                ...commonResponses.notFound,
                ...commonResponses.serverError
            }
        },

        delete: {
            summary: 'Menghapus bahan dari resep menu',
            tags: ['Resep'],
            security: [{ bearerAuth: [] }],
            parameters: [menuIdParameter, bahanIdParameter],
            responses: {
                '200': {
                    description: 'Bahan berhasil dihapus dari resep',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/DeleteBahanSuccessResponse'
                            }
                        }
                    }
                },
                ...commonResponses.badRequest,
                ...commonResponses.unauthorized,
                ...commonResponses.forbidden,
                ...commonResponses.notFound,
                ...commonResponses.serverError
            }
        }
    }
}