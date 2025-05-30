export interface ValidationResult {
  isValid: boolean
  message: string
}

export function validateUsername(username: string): ValidationResult {
  // Проверка длины
  if (username.length < 3) {
    return { isValid: false, message: "Username must be at least 3 characters long" }
  }

  if (username.length > 20) {
    return { isValid: false, message: "Username must be no more than 20 characters long" }
  }

  // Проверка на допустимые символы (только буквы, цифры, подчеркивание, дефис)
  const allowedPattern = /^[a-zA-Z0-9_-]+$/
  if (!allowedPattern.test(username)) {
    return { isValid: false, message: "Username can only contain letters, numbers, underscores and hyphens" }
  }

  // Проверка что не начинается с цифры
  if (/^\d/.test(username)) {
    return { isValid: false, message: "Username cannot start with a number" }
  }

  // Проверка на запрещенные слова
  const forbiddenWords = ["admin", "root", "user", "test", "null", "undefined", "system"]
  if (forbiddenWords.includes(username.toLowerCase())) {
    return { isValid: false, message: "This username is not allowed" }
  }

  return { isValid: true, message: "Username is valid" }
}

export function validatePassword(password: string): ValidationResult {
  // Минимальная длина
  if (password.length < 8) {
    return { isValid: false, message: "Password must be at least 8 characters long" }
  }

  // Максимальная длина
  if (password.length > 128) {
    return { isValid: false, message: "Password must be no more than 128 characters long" }
  }

  // Проверка на наличие заглавной буквы
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one uppercase letter" }
  }

  // Проверка на наличие строчной буквы
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one lowercase letter" }
  }

  // Проверка на наличие цифры
  if (!/\d/.test(password)) {
    return { isValid: false, message: "Password must contain at least one number" }
  }

  // Проверка на наличие специального символа
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one special character" }
  }

  // Проверка на повторяющиеся символы
  if (/(.)\1{2,}/.test(password)) {
    return { isValid: false, message: "Password cannot contain more than 2 consecutive identical characters" }
  }

  return { isValid: true, message: "Password is strong" }
}

export function getPasswordStrength(password: string): {
  score: number
  label: string
  color: string
} {
  let score = 0

  // Длина
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1

  // Символы
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score += 1

  // Разнообразие
  if (password.length >= 16) score += 1
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?].*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score += 1

  if (score <= 2) return { score, label: "Weak", color: "red" }
  if (score <= 4) return { score, label: "Medium", color: "orange" }
  if (score <= 6) return { score, label: "Strong", color: "green" }
  return { score, label: "Very Strong", color: "emerald" }
}

export function validateEmail(email: string): ValidationResult {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email) {
    return { isValid: false, message: "Email is required" }
  }

  if (!emailPattern.test(email)) {
    return { isValid: false, message: "Please enter a valid email address" }
  }

  if (email.length > 254) {
    return { isValid: false, message: "Email address is too long" }
  }

  return { isValid: true, message: "Email is valid" }
}
