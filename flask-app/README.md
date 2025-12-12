# GST Billing System - Flask Application

A complete A-to-Z billing and inventory management system built with Python Flask and Bootstrap.

## Features

### 📊 Dashboard
- Real-time statistics (revenue, invoices, stock alerts)
- Recent invoices overview
- Key metrics visualization

### 📦 Stock/Product Management
- Add, edit, delete products
- Track inventory levels
- Low stock alerts (< 10 units)
- HSN codes, tax rates, categories
- Automatic stock deduction on invoice creation

### 👥 Client Management
- Complete client database
- GSTIN, contact details
- Address management

### 🧾 Invoice Generation
- Auto-incrementing invoice numbers
- Select products from inventory or add custom items
- Automatic CGST/SGST calculation
- Real-time totals
- Invoice history and tracking

### ⚙️ Settings
- Company information management
- GSTIN configuration
- Customizable company details

## Installation

### 1. Create Virtual Environment
```bash
cd flask-app
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install Flask==3.0.0 Werkzeug==3.0.1 Jinja2==3.1.2 reportlab==4.0.7 Pillow==10.1.0 python-dateutil==2.8.2
```

### 3. Run the Application
```bash
python app.py
```

### 4. Access the Application
Open your browser and go to: http://localhost:5000

## Usage Guide

### First Time Setup
1. Go to **Settings** and configure your company information
2. Add your **Clients** via the Clients page
3. Add your **Products** with stock quantities via Products page

### Creating an Invoice
1. Click "Create Invoice" from dashboard or navigation
2. Select a client
3. Add items:
   - Click "Add from Products" to select from inventory (auto-fills HSN, price, tax)
   - Or click "Add Item" to manually enter details
4. Adjust quantities and rates as needed
5. Review CGST/SGST calculations
6. Click "Create Invoice"

### Managing Stock
- Products page shows current stock levels
- Low stock items (< 10) are highlighted in red
- Stock automatically decrements when invoices are created
- Update stock quantities anytime via Edit

## Database Schema

### Tables:
- **products**: Product catalog and inventory
- **clients**: Customer database
- **company_settings**: Your business information
- **invoices**: Invoice headers
- **invoice_items**: Invoice line items

### Database Location:
`database/billing.db` (SQLite)

## API Endpoints

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create product
- `PUT /api/products/<id>` - Update product
- `DELETE /api/products/<id>` - Delete product

### Clients
- `GET /api/clients` - List all clients
- `POST /api/clients` - Create client
- `PUT /api/clients/<id>` - Update client
- `DELETE /api/clients/<id>` - Delete client

### Invoices
- `GET /api/invoices` - List all invoices
- `GET /api/invoices/<id>` - Get invoice details
- `POST /api/invoices` - Create invoice

### Settings
- `GET /api/settings` - Get company settings
- `PUT /api/settings` - Update company settings

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Technology Stack

- **Backend**: Python Flask 3.0
- **Database**: SQLite3
- **Frontend**: Bootstrap 5.3, JavaScript ES6
- **Icons**: Bootstrap Icons
- **PDF Generation**: ReportLab (ready for implementation)

## Features Highlights

✅ Complete inventory/stock management  
✅ Automatic stock updates on sales  
✅ CGST/SGST tax calculations  
✅ HSN code support  
✅ Client database  
✅ Invoice tracking with status  
✅ Dashboard analytics  
✅ Print-ready invoices  
✅ Responsive design  
✅ Zero configuration database  

## Future Enhancements

- PDF export functionality
- Email invoices to clients
- Payment tracking
- Reports and analytics
- Backup/restore database
- Multi-user support
- Invoice templates customization

## Notes

- All currency amounts are in INR (₹)
- Tax rates default to 18% but are customizable per product
- Invoice numbers auto-increment (INV-0001, INV-0002, etc.)
- Database is created automatically on first run
- Stock quantities can be decimal (e.g., 1.5 for services)

## Support

For issues or questions, refer to the main project README or create an issue.
