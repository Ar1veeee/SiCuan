import { commonResponses } from '../utils/responses'

export const authPaths = {
    '/auth/register': {
        post: {
            summary: 'Mendaftarkan pengguna baru',
            tags: ['Auth'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/UserRegister'
                        }
                    }
                }
            },
            responses: {
                '201': {
                    description: 'Pendaftaran berhasil',
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
                                        example: 'Pendaftaran berhasil'
                                    }
                                }
                            }
                        }
                    }
                },
                ...commonResponses.badRequest,
                ...commonResponses.serverError
            }
        }
    },

    '/auth/login': {
        post: {
            summary: 'Login pengguna',
            tags: ['Auth'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/UserLogin'
                        }
                    }
                }
            },
            responses: {
                '200': {
                    description: 'Login berhasil',
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
                                            message: {
                                                type: 'string',
                                                example: 'Login berhasil'
                                            },
                                            userID: {
                                                type: 'string',
                                                description: 'ID pengguna (ULID format)',
                                                example: '01JWQ4VJ6GN4A16CGPMGMJHJDD'
                                            },
                                            username: {
                                                type: 'string',
                                                example: 'johndoe'
                                            },
                                            access_token: {
                                                type: 'string',
                                                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                                            },
                                            expiresAt: {
                                                type: 'string',
                                                format: 'date-time',
                                                example: '2024-01-27T10:30:00.000Z'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                ...commonResponses.badRequest,
                ...commonResponses.notFound,
                ...commonResponses.serverError
            }
        }
    },

    '/auth/refresh-token': {
        post: {
            summary: 'Refresh access token',
            tags: ['Auth'],
            responses: {
                '200': {
                    description: 'Token berhasil diperbarui',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/AuthSuccessResponse'
                            }
                        }
                    }
                },
                ...commonResponses.badRequest,
                ...commonResponses.serverError
            }
        }
    },

    '/auth/forget-password': {
        post: {
            summary: 'Mengirimkan kode OTP untuk reset password',
            tags: ['Auth'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/OtpRequest'
                        }
                    }
                }
            },
            responses: {
                '200': {
                    description: 'OTP berhasil dikirim',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/AuthSuccessResponse'
                            }
                        }
                    }
                },
                ...commonResponses.badRequest,
                ...commonResponses.notFound,
                ...commonResponses.serverError
            }
        }
    },

    '/auth/verify-otp': {
        post: {
            summary: 'Verifikasi kode OTP',
            tags: ['Auth'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/OtpVerify'
                        }
                    }
                }
            },
            responses: {
                '200': {
                    description: 'OTP berhasil diverifikasi',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/AuthSuccessResponse'
                            }
                        }
                    }
                },
                ...commonResponses.badRequest,
                ...commonResponses.serverError
            }
        }
    },

    '/auth/reset-password': {
        post: {
            summary: 'Reset password pengguna',
            tags: ['Auth'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/ResetPassword'
                        }
                    }
                }
            },
            responses: {
                '200': {
                    description: 'Password berhasil diubah',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/AuthSuccessResponse'
                            }
                        }
                    }
                },
                ...commonResponses.badRequest,
                ...commonResponses.serverError
            }
        }
    }
}