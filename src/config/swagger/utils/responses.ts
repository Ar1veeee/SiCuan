export const commonResponses = {
    badRequest: {
        '400': {
            description: 'Data tidak valid',
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/ErrorResponse'
                    }
                }
            }
        }
    },

    unauthorized: {
        '401': {
            description: 'Tidak terautentikasi',
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/ErrorResponse'
                    }
                }
            }
        }
    },

    forbidden: {
        '403': {
            description: 'Tidak memiliki akses',
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/ErrorResponse'
                    }
                }
            }
        }
    },

    notFound: {
        '404': {
            description: 'Data tidak ditemukan',
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/ErrorResponse'
                    }
                }
            }
        }
    },

    serverError: {
        '500': {
            description: 'Server error',
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/ErrorResponse'
                    }
                }
            }
        }
    }
}