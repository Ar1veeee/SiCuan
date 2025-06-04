import { commonResponses } from '../utils/responses'
import { stockIdParameter } from '../utils/parameters'

export const stockPaths = {
    '/stock': {
        get: {
            summary: 'Mendapatkan semua transaksi stok pengguna',
            tags: ['Stock'],
            security: [{ bearerAuth: [] }],
            responses: {
                '200': {
                    description: 'Daftar stok berhasil diambil',
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
                                        example: 'Daftar stok berhasil diambil'
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            stocks: {
                                                type: 'array',
                                                items: {
                                                    $ref: '#/components/schemas/StockData'
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
        }
    },

    '/stock/{stock_id}': {
        get: {
            summary: 'Mendapatkan detail transaksi stok',
            tags: ['Stock'],
            security: [{ bearerAuth: [] }],
            parameters: [stockIdParameter],
            responses: {
                '200': {
                    description: 'Detail stok berhasil diambil',
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
                                        example: 'Detail stok berhasil diambil'
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            stock: {
                                                $ref: '#/components/schemas/StockData'
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
            summary: 'Memperbarui transaksi stok',
            tags: ['Stock'],
            security: [{ bearerAuth: [] }],
            parameters: [stockIdParameter],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/StockRequest'
                        }
                    }
                }
            },
            responses: {
                '200': {
                    description: 'Stok berhasil diperbarui',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/AuthSuccessResponse'
                            }
                        }
                    }
                },
                '400': {
                    description: 'Data tidak valid atau jumlah stok tidak cukup',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
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

        delete: {
            summary: 'Menghapus transaksi stok',
            tags: ['Stock'],
            security: [{ bearerAuth: [] }],
            parameters: [stockIdParameter],
            responses: {
                '200': {
                    description: 'Stok berhasil dihapus',
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
                ...commonResponses.forbidden,
                ...commonResponses.notFound,
                ...commonResponses.serverError
            }
        }
    }
}