import { commonResponses } from '../utils/responses'
import { menuIdParameter } from '../utils/parameters'

export const menuPaths = {
    '/menu': {
        get: {
            summary: 'Mendapatkan semua menu pengguna saat ini',
            tags: ['Menu'],
            security: [{ bearerAuth: [] }],
            responses: {
                '200': {
                    description: 'Daftar menu berhasil diambil',
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
                                            menus: {
                                                type: 'array',
                                                items: {
                                                    $ref: '#/components/schemas/MenuResponse'
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
                ...commonResponses.serverError
            }
        },

        post: {
            summary: 'Membuat menu baru',
            tags: ['Menu'],
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/MenuRequest'
                        }
                    }
                }
            },
            responses: {
                '201': {
                    description: 'Menu berhasil dibuat',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/MenuRequestSuccessResponse'
                            }
                        }
                    }
                },
                ...commonResponses.badRequest,
                ...commonResponses.unauthorized,
                ...commonResponses.serverError
            }
        }
    },

    '/menu/{menu_id}': {
        get: {
            summary: 'Mendapatkan detail menu berdasarkan ID',
            tags: ['Menu'],
            security: [{ bearerAuth: [] }],
            parameters: [menuIdParameter],
            responses: {
                '200': {
                    description: 'Detail menu berhasil diambil',
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
                                            menu: {
                                                $ref: '#/components/schemas/MenuResponse'
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

        patch: {
            summary: 'Memperbarui menu',
            tags: ['Menu'],
            security: [{ bearerAuth: [] }],
            parameters: [menuIdParameter],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/Menu'
                        }
                    }
                }
            },
            responses: {
                '200': {
                    description: 'Menu berhasil diperbarui',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/UpdateMenuSuccessResponse'
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
            summary: 'Menghapus menu',
            tags: ['Menu'],
            security: [{ bearerAuth: [] }],
            parameters: [menuIdParameter],
            responses: {
                '200': {
                    description: 'Menu berhasil dihapus',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/DeleteMenuSuccessResponse'
                            }
                        }
                    }
                },
                ...commonResponses.unauthorized,
                ...commonResponses.forbidden,
                ...commonResponses.notFound,
                '422': {
                    description: 'Menu sudah dipakai',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                },
                ...commonResponses.serverError
            }
        }
    }
}