export const commonSchemas = {
    ErrorResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: false
            },
            message: {
                type: 'string',
                description: 'Pesan error'
            }
        },
        required: ['success', 'message']
    },

    AuthSuccessResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true
            },
            message: {
                type: 'string',
                description: 'Pesan sukses'
            },
            data: {
                type: 'object',
                description: 'Data response'
            }
        },
        required: ['success', 'message']
    }
}