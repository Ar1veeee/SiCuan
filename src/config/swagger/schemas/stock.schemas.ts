export const stockSchemas = {
    StockRequest: {
        type: 'object',
        required: ['jumlah', 'jenis_transaksi', 'keterangan'],
        properties: {
            jumlah: {
                type: 'number',
                description: 'Jumlah stok'
            },
            jenis_transaksi: {
                type: 'string',
                enum: ['Masuk', 'Keluar', 'Penyesuaian'],
                description: 'Jenis transaksi stok'
            },
            keterangan: {
                type: 'string',
                description: 'Keterangan tambahan'
            }
        },
        example: {
            jumlah: 10,
            jenis_transaksi: 'Masuk',
            keterangan: 'Restok beras'
        }
    },

    StockData: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                description: 'ID transaksi stok (ULID)'
            },
            userId: {
                type: 'string',
                description: 'ID pengguna pemilik stok (ULID)'
            },
            bahanId: {
                type: 'string',
                description: 'ID bahan (ULID)'
            },
            nama_bahan: {
                type: 'string',
                description: 'Nama bahan'
            },
            jumlah: {
                type: 'number',
                description: 'Jumlah stok'
            },
            jenis_transaksi: {
                type: 'string',
                enum: ['Masuk', 'Keluar', 'Penyesuaian'],
                description: 'Jenis transaksi stok'
            },
            keterangan: {
                type: 'string',
                description: 'Keterangan tambahan'
            },
            createdAt: {
                type: 'string',
                description: 'Tanggal pembuatan (formatted)'
            },
            updatedAt: {
                type: 'string',
                description: 'Tanggal pembaruan (formatted)'
            }
        },
        example: {
            id: '01JWQ4W8NNKQ7YNDCVNHP3CRA1',
            userId: '01JWQ4VJ6GN4A16CGPMGMJHJDD',
            bahanId: '01JWQ4W8NNKQ7YNDCVNHP3CRA3',
            nama_bahan: 'Beras',
            jumlah: 10,
            jenis_transaksi: 'Masuk',
            keterangan: 'Restok beras',
            createdAt: '20 Juli 2023, 10:30',
            updatedAt: '20 Juli 2023, 10:30'
        }
    },

    UpdateStockSuccessResponse: {
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
                message: 'Stok berhasil diperbarui'
            }
        }
    },

    DeleteStockSuccessResponse: {
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
                message: 'Stok berhasil dihapus'
            }
        }
    }
}