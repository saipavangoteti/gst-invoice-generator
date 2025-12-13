import os
import sqlite3
import json
from datetime import datetime, timedelta
import io

from flask import Flask, render_template, request, jsonify, send_file, redirect, url_for
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT

# Initialize Flask app with template and static folders
app = Flask(
    __name__,
    template_folder='templates',
    static_folder='static'
)
app.config.update(
    SECRET_KEY=os.environ.get('SECRET_KEY', 'dev-key-123'),
    DATABASE=os.path.join(os.path.dirname(__file__), 'database/billing.db')
)

DATABASE = 'database/billing.db'

# Database initialization
def init_db():
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    
    # Products/Stock table
    c.execute('''CREATE TABLE IF NOT EXISTS products
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT NOT NULL,
                  description TEXT,
                  hsn_code TEXT,
                  unit_price REAL NOT NULL,
                  stock_quantity INTEGER DEFAULT 0,
                  tax_rate REAL DEFAULT 18.0,
                  category TEXT,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
    
    # Clients table
    c.execute('''CREATE TABLE IF NOT EXISTS clients
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT NOT NULL,
                  email TEXT,
                  phone TEXT,
                  address TEXT,
                  city TEXT,
                  state TEXT,
                  pincode TEXT,
                  gstin TEXT,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
    
    # Company settings table
    c.execute('''CREATE TABLE IF NOT EXISTS company_settings
                 (id INTEGER PRIMARY KEY CHECK (id = 1),
                  company_name TEXT NOT NULL,
                  address TEXT,
                  city TEXT,
                  state TEXT,
                  pincode TEXT,
                  gstin TEXT,
                  phone TEXT,
                  email TEXT,
                  logo_path TEXT,
                  terms_and_conditions TEXT,
                  banking_details TEXT)''')
    # Backward compatibility: add new columns if missing
    try:
        c.execute("ALTER TABLE company_settings ADD COLUMN terms_and_conditions TEXT")
    except sqlite3.OperationalError:
        pass
    try:
        c.execute("ALTER TABLE company_settings ADD COLUMN banking_details TEXT")
    except sqlite3.OperationalError:
        pass
    
    # Invoices table
    c.execute('''CREATE TABLE IF NOT EXISTS invoices
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  invoice_number TEXT UNIQUE NOT NULL,
                  client_id INTEGER,
                  invoice_date DATE NOT NULL,
                  due_date DATE,
                  subtotal REAL NOT NULL,
                  total_tax REAL NOT NULL,
                  grand_total REAL NOT NULL,
                  status TEXT DEFAULT 'unpaid',
                  mode_of_transport TEXT,
                  notes TEXT,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (client_id) REFERENCES clients (id))''')
    # Backward compatibility: add mode_of_transport column if missing
    try:
        c.execute("ALTER TABLE invoices ADD COLUMN mode_of_transport TEXT")
    except sqlite3.OperationalError:
        # Column may already exist; ignore error
        pass
    
    # Invoice items table
    c.execute('''CREATE TABLE IF NOT EXISTS invoice_items
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  invoice_id INTEGER NOT NULL,
                  product_id INTEGER,
                  description TEXT NOT NULL,
                  hsn_code TEXT,
                  quantity REAL NOT NULL,
                  rate REAL NOT NULL,
                  tax_rate REAL NOT NULL,
                  amount REAL NOT NULL,
                  FOREIGN KEY (invoice_id) REFERENCES invoices (id),
                  FOREIGN KEY (product_id) REFERENCES products (id))''')
    
    # Insert default company settings if not exists
    c.execute("SELECT COUNT(*) FROM company_settings")
    if c.fetchone()[0] == 0:
        c.execute('''INSERT INTO company_settings 
                     (id, company_name, address, city, state, pincode, gstin, phone, email, terms_and_conditions, banking_details)
                     VALUES (1, 'Your Company Name', 'Your Address', 'City', 'State', '000000', 
                             'GSTIN Number', 'Phone', 'email@example.com', '', '')''')
    
    conn.commit()
    conn.close()

# Initialize database on first request
@app.before_first_request
def initialize_database():
    db_dir = os.path.dirname(app.config['DATABASE'])
    if not os.path.exists(db_dir):
        os.makedirs(db_dir, exist_ok=True)
    init_db()

# Helper function to get database connection
def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# Routes
@app.route('/')
def index():
    return render_template('dashboard.html')

@app.route('/invoices')
def invoices():
    return render_template('invoices.html')

@app.route('/create-invoice')
def create_invoice():
    return render_template('create_invoice.html')

@app.route('/invoice/<int:invoice_id>')
def invoice_detail(invoice_id):
    conn = get_db()
    invoice = conn.execute('''SELECT i.*, c.* FROM invoices i 
                             LEFT JOIN clients c ON i.client_id = c.id 
                             WHERE i.id=?''', (invoice_id,)).fetchone()
    items = conn.execute('SELECT * FROM invoice_items WHERE invoice_id=?', (invoice_id,)).fetchall()
    settings = conn.execute('SELECT * FROM company_settings WHERE id=1').fetchone()
    conn.close()

    if not invoice:
        return redirect(url_for('invoices'))

    return render_template(
        'invoice_detail.html',
        invoice=invoice,
        items=items,
        settings=settings,
    )

@app.route('/products')
def products():
    return render_template('products.html')

@app.route('/clients')
def clients():
    return render_template('clients.html')

@app.route('/settings')
def settings():
    return render_template('settings.html')

# API Routes - Products
@app.route('/api/products', methods=['GET'])
def get_products():
    conn = get_db()
    products = conn.execute('SELECT * FROM products ORDER BY name').fetchall()
    conn.close()
    return jsonify([dict(row) for row in products])

@app.route('/api/products', methods=['POST'])
def add_product():
    data = request.json
    conn = get_db()
    c = conn.cursor()
    c.execute('''INSERT INTO products (name, description, hsn_code, unit_price, stock_quantity, tax_rate, category)
                 VALUES (?, ?, ?, ?, ?, ?, ?)''',
              (data['name'], data.get('description', ''), data.get('hsn_code', ''),
               data['unit_price'], data.get('stock_quantity', 0), 
               data.get('tax_rate', 18.0), data.get('category', '')))
    conn.commit()
    product_id = c.lastrowid
    conn.close()
    return jsonify({'id': product_id, 'message': 'Product added successfully'})

@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    data = request.json
    conn = get_db()
    conn.execute('''UPDATE products SET name=?, description=?, hsn_code=?, 
                    unit_price=?, stock_quantity=?, tax_rate=?, category=?
                    WHERE id=?''',
                 (data['name'], data.get('description', ''), data.get('hsn_code', ''),
                  data['unit_price'], data.get('stock_quantity', 0),
                  data.get('tax_rate', 18.0), data.get('category', ''), product_id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Product updated successfully'})

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    conn = get_db()
    conn.execute('DELETE FROM products WHERE id=?', (product_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Product deleted successfully'})

# API Routes - Clients
@app.route('/api/clients', methods=['GET'])
def get_clients():
    conn = get_db()
    clients = conn.execute('SELECT * FROM clients ORDER BY name').fetchall()
    conn.close()
    return jsonify([dict(row) for row in clients])

@app.route('/api/clients', methods=['POST'])
def add_client():
    data = request.json
    conn = get_db()
    c = conn.cursor()
    c.execute('''INSERT INTO clients (name, email, phone, address, city, state, pincode, gstin)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
              (data['name'], data.get('email', ''), data.get('phone', ''),
               data.get('address', ''), data.get('city', ''), data.get('state', ''),
               data.get('pincode', ''), data.get('gstin', '')))
    conn.commit()
    client_id = c.lastrowid
    conn.close()
    return jsonify({'id': client_id, 'message': 'Client added successfully'})

@app.route('/api/clients/<int:client_id>', methods=['PUT'])
def update_client(client_id):
    data = request.json
    conn = get_db()
    conn.execute('''UPDATE clients SET name=?, email=?, phone=?, address=?, 
                    city=?, state=?, pincode=?, gstin=? WHERE id=?''',
                 (data['name'], data.get('email', ''), data.get('phone', ''),
                  data.get('address', ''), data.get('city', ''), data.get('state', ''),
                  data.get('pincode', ''), data.get('gstin', ''), client_id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Client updated successfully'})

@app.route('/api/clients/<int:client_id>', methods=['DELETE'])
def delete_client(client_id):
    conn = get_db()
    conn.execute('DELETE FROM clients WHERE id=?', (client_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Client deleted successfully'})

# API Routes - Invoices
@app.route('/api/invoices', methods=['GET'])
def get_invoices():
    conn = get_db()
    invoices = conn.execute('''SELECT i.*, c.name as client_name 
                               FROM invoices i 
                               LEFT JOIN clients c ON i.client_id = c.id 
                               ORDER BY i.created_at DESC''').fetchall()
    conn.close()
    return jsonify([dict(row) for row in invoices])

@app.route('/api/invoices/<int:invoice_id>', methods=['GET'])
def get_invoice(invoice_id):
    conn = get_db()
    invoice = conn.execute('''SELECT i.*, c.* FROM invoices i 
                             LEFT JOIN clients c ON i.client_id = c.id 
                             WHERE i.id=?''', (invoice_id,)).fetchone()
    items = conn.execute('SELECT * FROM invoice_items WHERE invoice_id=?', (invoice_id,)).fetchall()
    conn.close()
    
    if invoice:
        return jsonify({
            'invoice': dict(invoice),
            'items': [dict(row) for row in items]
        })
    return jsonify({'error': 'Invoice not found'}), 404

@app.route('/api/invoices/<int:invoice_id>', methods=['DELETE'])
def delete_invoice(invoice_id):
    conn = get_db()
    c = conn.cursor()
    # Delete items first due to foreign key relationship
    c.execute('DELETE FROM invoice_items WHERE invoice_id=?', (invoice_id,))
    c.execute('DELETE FROM invoices WHERE id=?', (invoice_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Invoice deleted successfully'})

@app.route('/api/invoices', methods=['POST'])
def create_invoice_api():
    data = request.json
    conn = get_db()
    c = conn.cursor()
    
    # Generate invoice number if not provided
    invoice_number = data.get('invoice_number')
    if not invoice_number:
        # Get last invoice number
        last = conn.execute('SELECT invoice_number FROM invoices ORDER BY id DESC LIMIT 1').fetchone()
        if last:
            last_num = int(last['invoice_number'].split('-')[-1])
            invoice_number = f"INV-{last_num + 1:04d}"
        else:
            invoice_number = "INV-0001"
    
    # Insert invoice
    c.execute('''INSERT INTO invoices 
                 (invoice_number, client_id, invoice_date, due_date, subtotal, total_tax, grand_total, status, mode_of_transport, notes)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
              (invoice_number, data['client_id'], data['invoice_date'], data.get('due_date'),
               data['subtotal'], data['total_tax'], data['grand_total'], 
               data.get('status', 'unpaid'), data.get('mode_of_transport', ''), data.get('notes', '')))
    
    invoice_id = c.lastrowid
    
    # Insert invoice items and update stock
    for item in data['items']:
        c.execute('''INSERT INTO invoice_items 
                     (invoice_id, product_id, description, hsn_code, quantity, rate, tax_rate, amount)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
                  (invoice_id, item.get('product_id'), item['description'], item.get('hsn_code', ''),
                   item['quantity'], item['rate'], item['tax_rate'], item['amount']))
        
        # Update stock if product_id exists
        if item.get('product_id'):
            c.execute('UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
                     (item['quantity'], item['product_id']))
    
    conn.commit()
    conn.close()
    
    return jsonify({'id': invoice_id, 'invoice_number': invoice_number, 'message': 'Invoice created successfully'})

# API Routes - Company Settings
@app.route('/api/settings', methods=['GET'])
def get_settings():
    conn = get_db()
    settings = conn.execute('SELECT * FROM company_settings WHERE id=1').fetchone()
    conn.close()
    return jsonify(dict(settings) if settings else {})

@app.route('/api/settings', methods=['PUT'])
def update_settings():
    data = request.json
    conn = get_db()
    conn.execute('''UPDATE company_settings SET 
                    company_name=?, address=?, city=?, state=?, pincode=?, 
                    gstin=?, phone=?, email=?, terms_and_conditions=?, banking_details=? WHERE id=1''',
                 (data['company_name'], data.get('address', ''), data.get('city', ''),
                  data.get('state', ''), data.get('pincode', ''), data.get('gstin', ''),
                  data.get('phone', ''), data.get('email', ''),
                  data.get('terms_and_conditions', ''), data.get('banking_details', '')))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Settings updated successfully'})

# Dashboard statistics
@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    conn = get_db()
    
    # Total products
    total_products = conn.execute('SELECT COUNT(*) as count FROM products').fetchone()['count']
    
    # Total clients
    total_clients = conn.execute('SELECT COUNT(*) as count FROM clients').fetchone()['count']
    
    # Total invoices
    total_invoices = conn.execute('SELECT COUNT(*) as count FROM invoices').fetchone()['count']
    
    # Total revenue
    total_revenue = conn.execute('SELECT SUM(grand_total) as total FROM invoices').fetchone()['total'] or 0
    
    # Pending invoices
    pending_invoices = conn.execute('SELECT COUNT(*) as count FROM invoices WHERE status="unpaid"').fetchone()['count']
    
    # Low stock products (less than 10)
    low_stock = conn.execute('SELECT COUNT(*) as count FROM products WHERE stock_quantity < 10').fetchone()['count']
    
    # Recent invoices
    recent_invoices = conn.execute('''SELECT i.*, c.name as client_name 
                                      FROM invoices i 
                                      LEFT JOIN clients c ON i.client_id = c.id 
                                      ORDER BY i.created_at DESC LIMIT 5''').fetchall()
    
    conn.close()
    
    return jsonify({
        'total_products': total_products,
        'total_clients': total_clients,
        'total_invoices': total_invoices,
        'total_revenue': total_revenue,
        'pending_invoices': pending_invoices,
        'low_stock': low_stock,
        'recent_invoices': [dict(row) for row in recent_invoices]
    })

# This file is used by Vercel to run the application
# No main block needed for Vercel deployment
