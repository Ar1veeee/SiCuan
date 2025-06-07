export const menuSchemas = {
    MenuRequest: {
        type: 'object',
        required: ['nama_menu'],
        properties: {
            nama_menu: {
                type: 'string',
                description: 'Nama menu'
            }
        },
        example: {
            nama_menu: 'Es Teh'
        }
    },

    MenuResponse: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                description: 'ID menu'
            },
            userId: {
                type: 'string',
                description: 'ID pengguna pemilik menu'
            },
            nama_menu: {
                type: 'string',
                description: 'Nama menu'
            },
            hpp: {
                type: 'number',
                nullable: true,
                description: 'Harga pokok produksi'
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'Tanggal pembuatan'
            },
            updatedAt: {
                type: 'string',
                format: 'date-time',
                description: 'Tanggal pembaruan terakhir'
            }
        },
        example: {
            id: '01JWQ4W8NNKQ7YNDCVNHP3CRA1',
            userId: '01JWQ4VJ6GN4A16CGPMGMJHJDD',
            nama_menu: 'Es Teh',
            hpp: 2000,
            createdAt: '2023-07-20T10:30:00Z',
            updatedAt: '2023-07-20T10:30:00Z'
        }
    },

    MenuRequestSuccessResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                description: 'Status sukses'
            },
            message: {
                type: 'string',
                description: 'Pesan sukses'
            },
            data: {
                type: 'object',
                properties: {
                    meesage: {
                        type: 'string',
                        description: 'Pesan sukses'
                    }
                }
            },
        },
        example: {
            success: true,
            message: 'Resource created successfully',
            data: {
                message: 'Menu berhasil ditambahkan'
            }
        }
    },

    UpdateMenuSuccessResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                description: 'Status sukses'
            },
            message: {
                type: 'string',
                description: 'Pesan sukses'
            },
            data: {
                type: 'object',
                properties: {
                    meesage: {
                        type: 'string',
                        description: 'Pesan sukses'
                    }
                }
            },
        },
        example: {
            success: true,
            message: 'Success',
            data: {
                message: 'Menu berhasil diperbarui'
            }
        }
    },

    DeleteMenuSuccessResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                description: 'Status sukses'
            },
            message: {
                type: 'string',
                description: 'Pesan sukses'
            },
            data: {
                type: 'object',
                properties: {
                    meesage: {
                        type: 'string',
                        description: 'Pesan sukses'
                    }
                }
            },
        },
        example: {
            success: true,
            message: 'Success',
            data: {
                message: 'Menu berhasil dihapus'
            }
        }
    }
}