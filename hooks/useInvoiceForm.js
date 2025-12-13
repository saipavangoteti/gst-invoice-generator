import { useState, useEffect, useCallback } from 'react';
import { 
  calculateItemTotal, 
  calculateTax,
  validateInvoiceData,
  calculateInvoiceTotals
} from '../utils/invoiceUtils';
import { 
  DEFAULT_INVOICE, 
  DEFAULT_COMPANY, 
  DEFAULT_CLIENT, 
  DEFAULT_ITEM 
} from '../config/constants';

export const useInvoiceForm = () => {
  // State for form data
  const [invoiceNumber, setInvoiceNumber] = useState(DEFAULT_INVOICE.invoiceNumber);
  const [invoiceDate, setInvoiceDate] = useState(DEFAULT_INVOICE.invoiceDate);
  const [dueDate, setDueDate] = useState(DEFAULT_INVOICE.dueDate);
  const [currency, setCurrency] = useState(DEFAULT_INVOICE.currency);
  const [companyDetails, setCompanyDetails] = useState(DEFAULT_COMPANY);
  const [clientDetails, setClientDetails] = useState(DEFAULT_CLIENT);
  const [items, setItems] = useState([{ ...DEFAULT_ITEM }]);
  const [notes, setNotes] = useState('Thank you for your business!');
  const [terms, setTerms] = useState('Payment due within 30 days');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Calculate totals whenever items change
  const { subtotal, totalTax, grandTotal } = calculateInvoiceTotals(items);

  // Reset form to default values
  const resetForm = useCallback(() => {
    setInvoiceNumber(DEFAULT_INVOICE.invoiceNumber);
    setInvoiceDate(DEFAULT_INVOICE.invoiceDate);
    setDueDate(DEFAULT_INVOICE.dueDate);
    setCurrency(DEFAULT_INVOICE.currency);
    setCompanyDetails(DEFAULT_COMPANY);
    setClientDetails(DEFAULT_CLIENT);
    setItems([{ ...DEFAULT_ITEM }]);
    setNotes('Thank you for your business!');
    setTerms('Payment due within 30 days');
    setError(null);
    setSuccess(null);
  }, []);

  // Handle changes in company details
  const handleCompanyChange = (field, value) => {
    setCompanyDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle changes in client details
  const handleClientChange = (field, value) => {
    setClientDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add a new item to the invoice
  const addItem = () => {
    setItems(prevItems => [
      ...prevItems,
      {
        ...DEFAULT_ITEM,
        id: Date.now() + prevItems.length
      }
    ]);
  };

  // Update an existing item
  const updateItem = (id, field, value) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id 
          ? { 
              ...item, 
              [field]: value,
              // Recalculate total and tax if quantity, rate, or taxRate changes
              ...(field === 'quantity' || field === 'rate' || field === 'taxRate' 
                ? { 
                    total: calculateItemTotal(
                      field === 'quantity' ? value : item.quantity,
                      field === 'rate' ? value : item.rate
                    ),
                    tax: calculateTax(
                      calculateItemTotal(
                        field === 'quantity' ? value : item.quantity,
                        field === 'rate' ? value : item.rate
                      ),
                      field === 'taxRate' ? value : item.taxRate
                    )
                  }
                : {})
            } 
          : item
      )
    );
  };

  // Remove an item from the invoice
  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(prevItems => prevItems.filter(item => item.id !== id));
    }
  };

  // Validate and submit the invoice
  const submitInvoice = async () => {
    const invoiceData = {
      invoiceNumber,
      invoiceDate,
      dueDate,
      currency,
      companyDetails,
      clientDetails,
      items: items.map(({ id, ...rest }) => rest), // Remove id before sending
      notes,
      terms,
      subtotal,
      totalTax,
      grandTotal
    };

    // Validate the invoice data
    const { isValid, errors } = validateInvoiceData(invoiceData);
    
    if (!isValid) {
      setError(errors.join('\n'));
      return { success: false, errors };
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Call the API to generate the invoice
      const response = await fetch('/api/invoice/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate invoice');
      }

      const result = await response.json();
      setSuccess('Invoice generated successfully!');
      return { success: true, data: result };
    } catch (err) {
      console.error('Error generating invoice:', err);
      setError(err.message || 'Failed to generate invoice');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate totals for each item whenever items change
  useEffect(() => {
    const updatedItems = items.map(item => ({
      ...item,
      total: calculateItemTotal(item.quantity, item.rate),
      tax: calculateTax(calculateItemTotal(item.quantity, item.rate), item.taxRate)
    }));
    
    // Only update if there are actual changes to prevent infinite loops
    if (JSON.stringify(updatedItems) !== JSON.stringify(items)) {
      setItems(updatedItems);
    }
  }, [items]);

  return {
    // Form state
    invoiceNumber,
    invoiceDate,
    dueDate,
    currency,
    companyDetails,
    clientDetails,
    items,
    notes,
    terms,
    subtotal,
    totalTax,
    grandTotal,
    isLoading,
    error,
    success,
    
    // Form actions
    setInvoiceNumber,
    setInvoiceDate,
    setDueDate,
    setCurrency,
    handleCompanyChange,
    handleClientChange,
    addItem,
    updateItem,
    removeItem,
    setNotes,
    setTerms,
    submitInvoice,
    resetForm,
    setError,
    setSuccess
  };
};
