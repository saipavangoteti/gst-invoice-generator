import { useState } from 'react'
import Head from 'next/head'

export default function Home() {
  const [invoiceNumber, setInvoiceNumber] = useState('INV-001')
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
  
  const [companyDetails, setCompanyDetails] = useState({
    name: 'Your Company Name',
    address: 'Your Address',
    city: 'City, State - PIN',
    gstin: 'GSTIN Number',
    phone: 'Phone Number',
    email: 'email@example.com'
  })

  const [clientDetails, setClientDetails] = useState({
    name: 'Client Name',
    address: 'Client Address',
    city: 'City, State - PIN',
    gstin: 'Client GSTIN',
    phone: 'Client Phone',
    email: 'client@example.com'
  })

  const [items, setItems] = useState([
    {
      id: 1,
      description: 'Product/Service Description',
      hsnCode: '998314',
      quantity: 1,
      rate: 1000,
      taxRate: 18
    }
  ])

  const addItem = () => {
    setItems([...items, {
      id: items.length + 1,
      description: 'Product/Service Description',
      hsnCode: '998314',
      quantity: 1,
      rate: 1000,
      taxRate: 18
    }])
  }

  const updateItem = (id, field, value) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  const calculateItemTotal = (item) => {
    return item.quantity * item.rate
  }

  const calculateItemTax = (item) => {
    const subtotal = calculateItemTotal(item)
    return (subtotal * item.taxRate) / 100
  }

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + calculateItemTotal(item), 0)
  }

  const calculateTotalTax = () => {
    return items.reduce((sum, item) => sum + calculateItemTax(item), 0)
  }

  const calculateGrandTotal = () => {
    return calculateSubtotal() + calculateTotalTax()
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <Head>
        <title>GST Invoice Generator</title>
        <meta name="description" content="Generate GST compliant invoices with CGST, SGST, and HSN codes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-4 no-print">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">GST Invoice Generator</h1>
          <p className="text-gray-600">Generate professional GST-compliant invoices with CGST/SGST breakdown</p>
        </div>

        {/* Invoice Container */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Print Button */}
          <div className="flex justify-end mb-6 no-print">
            <button 
              onClick={handlePrint}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Print Invoice
            </button>
          </div>

          {/* Invoice Header */}
          <div className="border-b-2 border-gray-800 pb-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={companyDetails.name}
                  onChange={(e) => setCompanyDetails({...companyDetails, name: e.target.value})}
                  className="text-2xl font-bold text-gray-800 mb-2 w-full border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                />
                <textarea
                  value={companyDetails.address}
                  onChange={(e) => setCompanyDetails({...companyDetails, address: e.target.value})}
                  className="text-gray-600 w-full border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none resize-none"
                  rows={2}
                />
                <input
                  type="text"
                  value={companyDetails.city}
                  onChange={(e) => setCompanyDetails({...companyDetails, city: e.target.value})}
                  className="text-gray-600 w-full border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                />
                <div className="mt-2">
                  <input
                    type="text"
                    value={companyDetails.gstin}
                    onChange={(e) => setCompanyDetails({...companyDetails, gstin: e.target.value})}
                    className="text-gray-700 font-semibold w-full border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                    placeholder="GSTIN Number"
                  />
                  <input
                    type="text"
                    value={companyDetails.phone}
                    onChange={(e) => setCompanyDetails({...companyDetails, phone: e.target.value})}
                    className="text-gray-600 w-full border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                    placeholder="Phone"
                  />
                  <input
                    type="email"
                    value={companyDetails.email}
                    onChange={(e) => setCompanyDetails({...companyDetails, email: e.target.value})}
                    className="text-gray-600 w-full border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                    placeholder="Email"
                  />
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">INVOICE</h2>
                <div className="space-y-2">
                  <div>
                    <label className="text-gray-600 text-sm">Invoice #</label>
                    <input
                      type="text"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      className="block w-full text-right border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm">Date</label>
                    <input
                      type="date"
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      className="block w-full text-right border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm">Due Date</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="block w-full text-right border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bill To Section */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Bill To:</h3>
            <input
              type="text"
              value={clientDetails.name}
              onChange={(e) => setClientDetails({...clientDetails, name: e.target.value})}
              className="text-lg font-semibold text-gray-800 w-full border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none mb-1"
            />
            <textarea
              value={clientDetails.address}
              onChange={(e) => setClientDetails({...clientDetails, address: e.target.value})}
              className="text-gray-600 w-full border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none resize-none"
              rows={2}
            />
            <input
              type="text"
              value={clientDetails.city}
              onChange={(e) => setClientDetails({...clientDetails, city: e.target.value})}
              className="text-gray-600 w-full border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
            />
            <div className="mt-2">
              <input
                type="text"
                value={clientDetails.gstin}
                onChange={(e) => setClientDetails({...clientDetails, gstin: e.target.value})}
                className="text-gray-700 font-semibold w-full border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                placeholder="Client GSTIN"
              />
              <input
                type="text"
                value={clientDetails.phone}
                onChange={(e) => setClientDetails({...clientDetails, phone: e.target.value})}
                className="text-gray-600 w-full border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                placeholder="Phone"
              />
              <input
                type="email"
                value={clientDetails.email}
                onChange={(e) => setClientDetails({...clientDetails, email: e.target.value})}
                className="text-gray-600 w-full border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                placeholder="Email"
              />
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-center">HSN Code</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Rate</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-center">Tax %</th>
                  <th className="p-3 text-right">CGST</th>
                  <th className="p-3 text-right">SGST</th>
                  <th className="p-3 text-right">Total</th>
                  <th className="p-3 no-print"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  const amount = calculateItemTotal(item)
                  const totalTax = calculateItemTax(item)
                  const cgst = totalTax / 2
                  const sgst = totalTax / 2
                  const total = amount + totalTax

                  return (
                    <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="p-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          className="w-full p-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={item.hsnCode}
                          onChange={(e) => updateItem(item.id, 'hsnCode', e.target.value)}
                          className="w-24 p-1 border border-gray-300 rounded text-center"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-20 p-1 border border-gray-300 rounded text-center"
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-24 p-1 border border-gray-300 rounded text-right"
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="p-2 text-right font-semibold">₹{amount.toFixed(2)}</td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={item.taxRate}
                          onChange={(e) => updateItem(item.id, 'taxRate', parseFloat(e.target.value) || 0)}
                          className="w-16 p-1 border border-gray-300 rounded text-center"
                          min="0"
                          max="100"
                          step="0.01"
                        />
                      </td>
                      <td className="p-2 text-right text-gray-700">₹{cgst.toFixed(2)}</td>
                      <td className="p-2 text-right text-gray-700">₹{sgst.toFixed(2)}</td>
                      <td className="p-2 text-right font-bold">₹{total.toFixed(2)}</td>
                      <td className="p-2 no-print">
                        {items.length > 1 && (
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-800 font-bold"
                          >
                            ×
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <button
              onClick={addItem}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition no-print"
            >
              + Add Item
            </button>
          </div>

          {/* Summary */}
          <div className="flex justify-end mb-6">
            <div className="w-96">
              <div className="flex justify-between py-2 border-b">
                <span className="font-semibold">Subtotal:</span>
                <span>₹{calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-semibold">Total Tax:</span>
                <span>₹{calculateTotalTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 bg-gray-800 text-white px-3 mt-2 rounded">
                <span className="font-bold text-lg">Grand Total:</span>
                <span className="font-bold text-lg">₹{calculateGrandTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Tax Breakdown */}
          <div className="mb-6 p-4 bg-gray-50 rounded">
            <h3 className="font-bold text-lg mb-3">Tax Breakdown</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">HSN Code</th>
                  <th className="text-right p-2">Taxable Amount</th>
                  <th className="text-center p-2">Tax Rate</th>
                  <th className="text-right p-2">CGST</th>
                  <th className="text-right p-2">SGST</th>
                  <th className="text-right p-2">Total Tax</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const amount = calculateItemTotal(item)
                  const totalTax = calculateItemTax(item)
                  const cgst = totalTax / 2
                  const sgst = totalTax / 2
                  
                  return (
                    <tr key={item.id} className="border-b">
                      <td className="p-2">{item.hsnCode}</td>
                      <td className="p-2 text-right">₹{amount.toFixed(2)}</td>
                      <td className="p-2 text-center">{item.taxRate}%</td>
                      <td className="p-2 text-right">₹{cgst.toFixed(2)} ({(item.taxRate/2).toFixed(2)}%)</td>
                      <td className="p-2 text-right">₹{sgst.toFixed(2)} ({(item.taxRate/2).toFixed(2)}%)</td>
                      <td className="p-2 text-right font-semibold">₹{totalTax.toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-gray-300 pt-6 mt-8">
            <div className="text-gray-600 text-sm">
              <p className="mb-2"><strong>Terms & Conditions:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Payment is due within the due date specified above</li>
                <li>Please make checks payable to the company name</li>
                <li>This is a computer-generated invoice</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="text-center mt-6 text-gray-600 text-sm no-print">
          <p>© 2025 GST Invoice Generator | Vercel Compatible</p>
        </div>
      </div>
    </div>
  )
}
