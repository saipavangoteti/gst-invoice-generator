# Quick Start Guide

Get your GST Invoice Generator running in 3 minutes!

## Local Development

### 1. Install Dependencies
```bash
cd gst-invoice-generator
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
Visit [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

### Fastest Way (2 minutes):

1. **Create GitHub Repo**
   - Go to GitHub and create a new repository
   - Copy the repository URL

2. **Push Your Code**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

3. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"
   - Done! Your app is live in 1-2 minutes

## Using the Invoice Generator

### Basic Steps:

1. **Company Info** - Click and edit your company name, address, GSTIN
2. **Invoice Number** - Change the invoice number (e.g., INV-001, INV-002)
3. **Client Info** - Fill in customer details under "Bill To"
4. **Add Items** - Click "+ Add Item" to add products/services
5. **HSN Codes** - Enter appropriate HSN codes for each item
6. **Tax Rate** - Set GST percentage (automatically splits to CGST/SGST)
7. **Print** - Click "Print Invoice" when ready

### Example Invoice:

- **Invoice #**: INV-2024-001
- **Item**: Web Development Services
- **HSN Code**: 998314
- **Quantity**: 1
- **Rate**: ₹50,000
- **Tax Rate**: 18% (9% CGST + 9% SGST)
- **Total**: ₹59,000

## Common HSN Codes

- **998314** - Software/IT services
- **9983** - Information technology services
- **997331** - Consulting services
- **9954** - Advertising services
- **996511** - Freight transport services

## Tips

- 💡 All fields are editable - just click to change
- 💡 Calculations are automatic
- 💡 Use browser print or save as PDF
- 💡 Invoice data is saved in browser until page refresh
- 💡 Common tax rates: 5%, 12%, 18%, 28%

## Next Steps

- Read [README.md](README.md) for detailed features
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment options
- Customize default values in `pages/index.js`

## Need Help?

- Check if server is running: `npm run dev`
- Build for production: `npm run build`
- Start production: `npm start`

That's it! You're ready to generate professional GST invoices! 🎉
