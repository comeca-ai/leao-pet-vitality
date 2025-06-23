
export const validateField = (field: string, value: string) => {
  switch (field) {
    case 'name':
      return value.length >= 2 ? '' : 'Nome deve ter pelo menos 2 caracteres';
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? '' : 'E-mail inválido';
    case 'phone':
      const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
      return phoneRegex.test(value) ? '' : 'Telefone inválido';
    case 'zipCode':
      const zipRegex = /^\d{5}-\d{3}$/;
      return zipRegex.test(value) ? '' : 'CEP inválido';
    default:
      return '';
  }
};

export const formatField = (field: string, value: string) => {
  if (field === 'phone') {
    value = value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
    }
  }

  if (field === 'zipCode') {
    value = value.replace(/\D/g, '');
    if (value.length <= 8) {
      value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
  }

  return value;
};
