export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}

export const validatePassword = (password) => {
  return password.length >= 8
}

export const validateConfirmPassword = (password, confirm) => {
  return password === confirm
}
