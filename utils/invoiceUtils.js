// Utility functions for invoice calculations and validations

export const calculateItemTotal = (quantity, rate) => {
  return quantity * rate;
};

export const calculateTax = (subtotal, taxRate) => {
  return (subtotal * taxRate) / 100;
};

export const validateGSTIN = (gstin) => {
  // Basic GSTIN validation (15 characters, alphanumeric)
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin);
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  // Basic phone validation (10 digits)
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

export const validateInvoiceData = (invoiceData) => {
  const errors = [];
  
  // Validate company details
  if (!invoiceData.companyDetails.name?.trim()) {
    errors.push('Company name is required');
  }
  
  if (!invoiceData.companyDetails.gstin || !validateGSTIN(invoiceData.companyDetails.gstin)) {
    errors.push('Valid company GSTIN is required');
  }
  
  // Validate client details
  if (!invoiceData.clientDetails.name?.trim()) {
    errors.push('Client name is required');
  }
  
  if (invoiceData.clientDetails.gstin && !validateGSTIN(invoiceData.clientDetails.gstin)) {
    errors.push('Invalid client GSTIN format');
  }
  
  // Validate items
  if (!invoiceData.items?.length) {
    errors.push('At least one item is required');
  } else {
    invoiceData.items.forEach((item, index) => {
      if (!item.description?.trim()) {
        errors.push(`Item ${index + 1}: Description is required`);
      }
      if (isNaN(item.quantity) || item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
      }
      if (isNaN(item.rate) || item.rate < 0) {
        errors.push(`Item ${index + 1}: Rate must be a positive number`);
      }
      if (isNaN(item.taxRate) || item.taxRate < 0) {
        errors.push(`Item ${index + 1}: Tax rate must be a positive number`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Calculate all totals for the invoice
export const calculateInvoiceTotals = (items) => {
  const itemTotals = items.map(item => ({
    ...item,
    total: calculateItemTotal(item.quantity, item.rate),
    tax: calculateTax(calculateItemTotal(item.quantity, item.rate), item.taxRate)
  }));
  
  const subtotal = itemTotals.reduce((sum, item) => sum + item.total, 0);
  const totalTax = itemTotals.reduce((sum, item) => sum + item.tax, 0);
  const grandTotal = subtotal + totalTax;
  
  return {
    items: itemTotals,
    subtotal,
    totalTax,
    grandTotal
  };
};
