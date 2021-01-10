import bcrypt from 'bcryptjs'

export const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10)

  return hashedPassword
}

export const compareHash = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash)
}

export const capitalizeFirst = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export const hasSymbols = (str: string) => {
  return str.match(/^[^a-zA-Z0-9]+$/) ? true : false
}

export const isValid = (val: any) => {
  if (val !== '' && val !== undefined && val !== null) {
    return true
  }

  return false
}

export const isCep = (cep: string) => {
  if (
    (cep.length === 9 && cep.match(/^[0-9]{5}\-[0-9]{3}$/)) ||
    (cep.length === 8 && cep.match(/^[0-9]{5}[0-9]{3}$/))
  ) {
    return true
  }

  return false
}

export const formatCep = (cep: string) => {
  if (cep.length === 9 && cep.match(/^[0-9]{5}\-[0-9]{3}$/)) {
    return cep.replace('-', '')
  } else if (cep.length === 8 && cep.match(/^[0-9]{5}[0-9]{3}$/)) {
    return cep
  } else {
    return ''
  }
}
