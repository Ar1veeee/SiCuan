export const resepSchemas = {
    BahanRequest: {
        type: 'object',
        required: ['nama_bahan', 'harga_beli', 'jumlah', 'satuan', 'jumlah_digunakan', 'minimum_stock'],
        properties: {
            nama_bahan: {
                type: 'string',
                description: 'Nama bahan'
            },
            harga_beli: {
                type: 'number',
                description: 'Harga beli per satuan'
            },
            jumlah: {
                type: 'number',
                description: 'Jumlah stok bahan yang dibeli'
            },
            satuan: {
                type: 'string',
                description: 'Satuan bahan (gram, kg, liter, pcs, dll)'
            },
            jumlah_digunakan: {
                type: 'number',
                description: 'Jumlah bahan yang digunakan dalam resep per porsi'
            },
            minimum_stock: {
                type: 'number',
                description: 'Minimum stok untuk alert'
            }
        },
        example: {
            nama_bahan: 'Beras',
            harga_beli: 15000,
            jumlah: 5,
            satuan: 'kg',
            jumlah_digunakan: 0.2,
            minimum_stock: 1
        }
    },

    RecipeResponse: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                description: 'ID resep (ULID)'
            },
            userId: {
                type: 'string',
                description: 'ID user (ULID)'
            },
            nama_bahan: {
                type: 'string',
                description: 'Nama bahan'
            },
            jumlah: {
                type: 'number',
                description: 'Jumlah bahan yang digunakan per porsi'
            },
            harga_beli: {
                type: 'number',
                description: 'Harga beli per satuan'
            },
            satuan: {
                type: 'string',
                description: 'Satuan bahan'
            },
            minimum_stock: {
                type: 'number',
                description: 'Stock minimum untuk alert'
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
            },
            menuBahan: {
                type: 'array',
                properties: {
                    jumlah: {
                        type: 'number',
                        description: 'Stok tersedia'
                    }
                }
            }
        },
        example: {
            id: '01JWQ4W8NNKQ7YNDCVNHP3CRA1',
            userId: '01JWQ4W8NNKQ7YNDCVNHP3CRA2',
            nama_bahan: 'Beras',
            jumlah_digunakan: 0.2,
            harga_beli: 15000,
            satuan: 'kg',
            minimum_stock: 1,
            createdAt: '2023-07-20T10:30:00Z',
            updatedAt: '2023-07-20T10:30:00Z',
            menuBahan: {
                jumlah: 5
            }
        }
    }
}