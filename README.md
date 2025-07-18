# Solana Token Profitability Analysis

A modern web application for analyzing SPL token holder profitability on the Solana blockchain. Track wallet performance, profit margins, and export comprehensive CSV reports over the past 7 days.

![Solana Token Analysis](https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=400&fit=crop)

## 🎯 Features

- **Real-time Analysis**: Analyze any SPL token's holder profitability
- **7-Day Tracking**: Monitor daily price movements and wallet performance
- **Profit Calculation**: Calculate which wallets are currently in profit
- **CSV Export**: Export detailed analysis reports
- **Modern UI**: Beautiful, responsive interface with crypto-themed design
- **Live Data**: Powered by Helius and Birdeye APIs for real-time blockchain data

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS 3
- **Backend**: Express.js + Node.js
- **Blockchain**: Solana Web3.js
- **APIs**: Helius API, Birdeye API
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: TailwindCSS with custom crypto theme

## 🚀 Quick Start

1. **Clone and Install**

   ```bash
   git clone <repository-url>
   cd solana-token-analysis
   npm install
   ```

2. **Set up Environment Variables**

   ```bash
   cp .env.example .env
   # Edit .env and add your Helius API key
   ```

3. **Get API Keys**

   - Get a free Helius API key from [helius.dev](https://helius.dev)
   - (Optional) Get a Birdeye API key from [birdeye.so](https://birdeye.so)

4. **Start Development Server**

   ```bash
   npm run dev
   ```

5. **Open in Browser**
   Navigate to `http://localhost:8080`

## 📊 How It Works

1. **Enter Token Details**: Input the SPL token mint address and your Helius API key
2. **Analysis Process**:
   - Fetches all token holders from Helius API
   - Retrieves 7-day price history from Birdeye API
   - Calculates average buy prices for each wallet
   - Determines profit/loss status for each day
3. **View Results**: See daily breakdown with interactive charts and summaries
4. **Export Data**: Download comprehensive CSV reports

## 🔧 API Endpoints

- `POST /api/analyze-token` - Start token profitability analysis
- `GET /api/download/:filename` - Download generated CSV files

## 📁 Project Structure

```
client/                   # React frontend
├── pages/               # Route components
├── components/ui/       # UI component library
└── lib/                # Utilities and helpers

server/                  # Express backend
├── routes/             # API route handlers
└── index.ts           # Server configuration

shared/                 # Shared types and interfaces
└── api.ts             # API type definitions
```

## 🎨 Features in Detail

### Modern Crypto UI

- Dark theme with green accent colors
- Animated gradients and micro-interactions
- Responsive design for all screen sizes
- Loading states and error handling

### Real-time Data Processing

- Helius API integration for blockchain data
- Birdeye API for historical price data
- Efficient wallet profitability calculations
- CSV export functionality

### Performance Optimized

- TypeScript throughout for type safety
- Efficient API batching and caching
- Progressive loading states
- Error boundaries and fallbacks

## 🔐 Environment Variables

```env
HELIUS_API_KEY=your_helius_api_key_here
BIRDEYE_API_KEY=your_birdeye_api_key_here
PORT=8080
```

## 📝 Example Usage

1. Enter a token mint address (e.g., `So11111111111111111111111111111111111111112` for Wrapped SOL)
2. Provide your Helius API key
3. Click "Start Analysis"
4. View the 7-day profitability breakdown
5. Download the CSV report

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- [Helius API Documentation](https://docs.helius.dev/)
- [Birdeye API Documentation](https://docs.birdeye.so/)
- [Solana Web3.js Documentation](https://solana-labs.github.io/solana-web3.js/)
- [React Documentation](https://react.dev/)

---

Built with ❤️ for the Solana ecosystem

https://chatgpt.com/c/6878c029-61c0-8009-baa6-12fa5b9ecf48#   s o l o n a t o k e n p r o f i t a b i l i t y - a n a l y s i s  
 