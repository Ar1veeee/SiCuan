export const authSchemas = {
  UserRegister: {
    type: 'object',
    required: ['email', 'username', 'password', 'confirmPassword', 'nama_usaha'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'Email pengguna'
      },
      username: {
        type: 'string',
        description: 'Username pengguna'
      },
      password: {
        type: 'string',
        format: 'password',
        description: 'Password pengguna (min 8 karakter)'
      },
      confirmPassword: {
        type: 'string',
        format: 'password',
        description: 'Konfirmasi password'
      },
      nama_usaha: {
        type: 'string',
        description: 'Nama usaha pengguna'
      }
    },
    example: {
      email: 'john@example.com',
      username: 'johndoe',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      nama_usaha: "John's Restaurant"
    }
  },

  UserLogin: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'Email pengguna'
      },
      password: {
        type: 'string',
        format: 'password',
        description: 'Password pengguna'
      }
    },
    example: {
      email: 'john@example.com',
      password: 'Password123!'
    }
  },

  OtpRequest: {
    type: 'object',
    required: ['email'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'Email pengguna'
      }
    },
    example: {
      email: 'john@example.com'
    }
  },

  OtpVerify: {
    type: 'object',
    required: ['otp'],
    properties: {
      otp: {
        type: 'string',
        description: 'Kode OTP (6 digit)'
      }
    },
    example: {
      otp: '123456'
    }
  },

  ResetPassword: {
    type: 'object',
    required: ['otp', 'newPassword', 'confirmPassword'],
    properties: {
      otp: {
        type: 'string',
        description: 'Kode OTP (6 digit)'
      },
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
      otp: '123456',
      newPassword: 'NewPassword123!',
      confirmPassword: 'NewPassword123!'
    }
  }
}