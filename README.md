# GST Invoice Generator

A modern, professional GST-compliant invoice generator built with Next.js and Tailwind CSS. Generate invoices with automatic CGST/SGST calculations and HSN code support.

## Features

- ✅ **Editable Invoice Numbers** - Customize invoice numbers to match your sequence
- ✅ **CGST & SGST Breakdown** - Automatic calculation and split of taxes
- ✅ **HSN Code Support** - Add HSN codes for each item
- ✅ **Dynamic Items** - Add/remove items as needed
- ✅ **Company & Client Details** - Fully editable company and client information
- ✅ **Print-Ready** - Professional print layout
- ✅ **Tax Breakdown Table** - Detailed GST breakdown by HSN code
- ✅ **Vercel Compatible** - Ready to deploy to Vercel

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd gst-invoice-generator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Edit Company Details**: Click on any company field to edit your business information
2. **Edit Client Details**: Update client/customer information in the "Bill To" section
3. **Add Items**: Click "+ Add Item" to add products/services
4. **Enter HSN Codes**: Add appropriate HSN codes for each item
5. **Set Tax Rates**: Adjust GST rates as needed (auto-splits to CGST/SGST)
6. **Print**: Click "Print Invoice" to generate a printer-friendly version

## Deployment on Vercel

### Option 1: Deploy via GitHub

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js and configure the build settings
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

## Technologies Used

- **Next.js** - React framework for production
- **React** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Vercel** - Deployment platform

## GST Compliance Features

- Automatic CGST/SGST calculation (50/50 split)
- HSN code tracking
- Tax breakdown by HSN code
- Invoice numbering system
- Date tracking (Invoice date & Due date)
- GSTIN fields for both company and client

## Customization

You can customize the default values in `pages/index.js`:

- Default tax rate (currently 18%)
- Default HSN code (currently 998314)
- Terms & Conditions
- Date formats
- Currency symbol

## License

ISC

## Support

For issues or questions, please open an issue on GitHub.
