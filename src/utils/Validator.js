const ValidationError = require('../errors/ValidationError');

class Validator {
  static validatePhone(telephone) {
    if (!telephone) {
      throw new ValidationError('Le téléphone est obligatoire');
    }
    const cleanPhone = telephone.replace(/\s/g, '');
    if (!/^(\+221)?[0-9]{9}$/.test(cleanPhone)) {
      throw new ValidationError('Le téléphone doit être un numéro sénégalais à 9 chiffres (ex: 771234567)');
    }
    const prefix = cleanPhone.substring(0, 2);
    const validPrefixes = ['70', '75', '76', '77', '78'];
    if (!validPrefixes.includes(prefix)) {
      throw new ValidationError('Le téléphone doit commencer par 70, 75, 76, 77 ou 78');
    }
    return cleanPhone;
  }

  static validateEmail(email) {
    if (!email) {
      throw new ValidationError('L\'email est obligatoire');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('L\'email doit être au format valide (ex: exemple@domaine.com)');
    }
    return email.toLowerCase();
  }

  static validateRequiredString(value, fieldName, minLength = 2) {
    if (!value || typeof value !== 'string') {
      throw new ValidationError(`${fieldName} est obligatoire`);
    }
    if (value.trim().length < minLength) {
      throw new ValidationError(`${fieldName} doit contenir au moins ${minLength} caractères`);
    }
    return value.trim();
  }

  static validatePositiveNumber(value, fieldName) {
    if (value === undefined || value === null || isNaN(value) || value <= 0) {
      throw new ValidationError(`${fieldName} doit être un nombre positif`);
    }
    return value;
  }

  static validatePositiveInteger(value, fieldName) {
    if (value === undefined || value === null || !Number.isInteger(value) || value <= 0) {
      throw new ValidationError(`${fieldName} doit être un entier positif`);
    }
    return value;
  }

  static validateDate(dateStr, fieldName, allowFuture = true) {
    if (!dateStr) {
      throw new ValidationError(`${fieldName} est obligatoire`);
    }
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      throw new ValidationError(`${fieldName} doit être une date valide`);
    }
    if (!allowFuture && date > new Date()) {
      throw new ValidationError(`${fieldName} ne peut pas être dans le futur`);
    }
    return dateStr;
  }

  static validateEnum(value, fieldName, allowedValues) {
    if (!value || !allowedValues.includes(value)) {
      throw new ValidationError(`${fieldName} doit être parmi: ${allowedValues.join(', ')}`);
    }
    return value;
  }
}

module.exports = Validator;