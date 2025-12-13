// Default values for new invoices
export const DEFAULT_INVOICE = {
  invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  currency: '₹',
  taxTypes: [
    { label: 'GST 0%', value: 0 },
    { label: 'GST 5%', value: 5 },
    { label: 'GST 12%', value: 12 },
    { label: 'GST 18%', value: 18 },
    { label: 'GST 28%', value: 28 },
  ],
};

// Default company details
export const DEFAULT_COMPANY = {
  name: 'Your Company Name',
  address: 'Your Address',
  city: 'City, State - PIN',
  gstin: '22AAAAA0000A1Z5',
  phone: '9876543210',
  email: 'billing@example.com',
  bankName: 'Your Bank Name',
  accountNumber: 'XXXXXXXXXXXX',
  ifscCode: 'XXXX0000000',
  bankBranch: 'Your Branch Name'
};

// Default client details
export const DEFAULT_CLIENT = {
  name: 'Client Name',
  address: 'Client Address',
  city: 'City, State - PIN',
  gstin: '',
  phone: '',
  email: ''
};

// Default invoice item
export const DEFAULT_ITEM = {
  id: Date.now(),
  description: 'Product/Service Description',
  hsnCode: '',
  quantity: 1,
  rate: 0,
  taxRate: 18,
  total: 0,
  tax: 0
};

// Common HSN codes for reference
export const COMMON_HSN_CODES = [
  { code: '9968', description: 'IT Services' },
  { code: '9983', description: 'Professional Services' },
  { code: '9985', description: 'Support Services' },
  { code: '9986', description: 'Support Services - IT' },
  { code: '6115', description: 'T-Shirts' },
  { code: '6109', description: 'T-Shirts, Knitted' },
  { code: '6205', description: 'Shirts, Woven' },
  { code: '6211', description: 'Garments' },
  { code: '9403', description: 'Furniture' },
  { code: '9401', description: 'Seats' },
];
