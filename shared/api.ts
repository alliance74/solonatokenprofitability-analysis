/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Request payload for token analysis
 */
export interface TokenAnalysisRequest {
  tokenMint: string;
  heliusApiKey: string;
}

/**
 * Single day analysis result
 */
export interface AnalysisResult {
  date: string;
  price: number;
  walletsInProfit: number;
  totalWallets: number;
  percentageInProfit: number;
}

/**
 * Complete analysis response
 */
export interface TokenAnalysisResponse {
  results: AnalysisResult[];
  csvDownloadUrl: string;
}

/**
 * Token holder information from Helius
 */
export interface TokenHolder {
  address: string;
  amount: number;
  decimals: number;
}

/**
 * Price data for a specific date
 */
export interface PriceData {
  date: string;
  price: number;
}
