export const profileSchemas = {
    UserProfile: {
        type: 'object',
        properties: {
            userId: {
                type: 'string',
                description: 'ID pengguna (ULID format)'
            },
            username: {
                type: 'string',
                description: 'Username pengguna'
            },
            email: {
                type: 'string',
                format: 'email',
                description: 'Email pengguna'
            },
            nama_usaha: {
                type: 'string',
                description: 'Nama usaha pengguna'
            }
        },
        example: {
            userId: '01JWQ4VJ6GN4A16CGPMGMJHJDD',
            username: 'johndoe',
            email: 'john@example.com',
            nama_usaha: "John's Restaurant"
        }
    },

    UpdatePassword: {
        type: 'object',
        required: ['newPassword', 'confirmPassword'],
        properties: {
            newPassword: {
                type: 'string',
                format: 'password',
                description: 'Password baru (min 8 karakter)'
            },
            confirmPassword: {
                type: 'string',
                format: 'password',
                description: 'Konfirmasi password baru'
            }
        },
        example: {
            newPassword: 'NewPassword123!',
            confirmPassword: 'NewPassword123!'
        }
    },

    UpdatePasswordSuccessResponse: {
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
                message: 'Password berhasil diperbarui'
            }
        }
    }
}