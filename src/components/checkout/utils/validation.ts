
export const validateField = (field: string, value: string) => {
  switch (field) {
    case 'name':
      if (!value.trim()) return 'Nome é obrigatório';
      if (value.trim().length < 2) return 'Nome deve ter pelo menos 2 caracteres';
      if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) return 'Nome deve conter apenas letras';
      return '';
    
    case 'email':
      if (!value.trim()) return 'E-mail é obrigatório';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'E-mail inválido';
      return '';
    
    case 'phone':
      if (!value.trim()) return 'Telefone é obrigatório';
      const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
      if (!phoneRegex.test(value)) return 'Telefone deve estar no formato (11) 99999-9999';
      return '';
    
    case 'zipCode':
      if (!value.trim()) return 'CEP é obrigatório';
      const zipRegex = /^\d{5}-\d{3}$/;
      if (!zipRegex.test(value)) return 'CEP deve estar no formato 00000-000';
      return '';
    
    case 'street':
      if (!value.trim()) return 'Endereço é obrigatório';
      if (value.trim().length < 5) return 'Endereço deve ter pelo menos 5 caracteres';
      return '';
    
    case 'city':
      if (!value.trim()) return 'Cidade é obrigatória';
      if (value.trim().length < 2) return 'Nome da cidade deve ter pelo menos 2 caracteres';
      if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) return 'Cidade deve conter apenas letras';
      return '';
    
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

  if (field === 'name' || field === 'city') {
    // Capitalizar primeira letra de cada palavra
    value = value.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }

  return value;
};

export const validateCompleteAddress = (customerInfo: any) => {
  const errors: Record<string, string> = {};
  
  // Validar campos obrigatórios
  const requiredFields = ['name', 'email', 'phone', 'street', 'city'];
  
  requiredFields.forEach(field => {
    const value = field === 'street' || field === 'city' 
      ? customerInfo.address?.[field] 
      : customerInfo[field];
    
    const error = validateField(field, value || '');
    if (error) {
      errors[field] = error;
    }
  });

  // CEP é opcional mas se preenchido deve ser válido
  if (customerInfo.address?.zipCode) {
    const zipError = validateField('zipCode', customerInfo.address.zipCode);
    if (zipError) {
      errors.zipCode = zipError;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
