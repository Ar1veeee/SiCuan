export const menuIdParameter = {
    in: 'path',
    name: 'menu_id',
    required: true,
    schema: {
        type: 'string'
    },
    description: 'ID menu (ULID format)'
}

export const bahanIdParameter = {
    in: 'path',
    name: 'bahan_id',
    required: true,
    schema: {
        type: 'string'
    },
    description: 'ID bahan (ULID format)'
}

export const stockIdParameter = {
    in: 'path',
    name: 'stock_id',
    required: true,
    schema: {
        type: 'string'
    },
    description: 'ID transaksi stok (ULID format)'
}