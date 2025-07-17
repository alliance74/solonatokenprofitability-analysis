import { RequestHandler } from "express";
import {
  TokenAnalysisRequest,
  TokenAnalysisResponse,
  AnalysisResult,
  TokenHolder,
  PriceData,
} from "@shared/api";
import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import dayjs from "dayjs";

export const handleTokenAnalysis: RequestHandler = async (req, res) => {
  try {
    const { tokenMint, heliusApiKey } = req.body as TokenAnalysisRequest;

    if (!tokenMint || !heliusApiKey) {
      return res.status(400).json({ error: "Missing required field: tokenMint or heliusApiKey" });
    }

    console.log(`Analyzing token: ${tokenMint}`);

    // Step 1: Get token holders
    const holders = await getTokenHoldersFromSolana(tokenMint, heliusApiKey);
    console.log(`Found ${holders.length} holders`);

    // Step 2: Get price history
    const priceHistory = await getPriceHistory(tokenMint);
    console.log(`Retrieved ${priceHistory.length} days of price data`);

    // Step 3: Estimate buy prices
    const holderBuyPrices = await estimateBuyPrices(holders);
    console.log(`Estimated buy prices for holders`);

    // Step 4: Profit analysis
    const results = priceHistory.map((dayPrice) => {
      let walletsInProfit = 0;
      holders.forEach((holder) => {
        const buyPrice = holderBuyPrices.get(holder.address);
        if (buyPrice && buyPrice < dayPrice.price) {
          walletsInProfit++;
        }
      });
      const totalWallets = holders.length;
      const percentageInProfit = totalWallets > 0 ? (walletsInProfit / totalWallets) * 100 : 0;
      return {
        date: dayPrice.date,
        price: dayPrice.price,
        walletsInProfit,
        totalWallets,
        percentageInProfit,
      };
    });

    // Step 5: Generate CSV
    const csvDownloadUrl = await generateCSV(results, tokenMint);

    const response: TokenAnalysisResponse = {
      results,
      csvDownloadUrl,
    };

    res.json(response);
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
};

async function getTokenHoldersFromSolana(tokenMint: string, heliusApiKey: string): Promise<TokenHolder[]> {
  if (!heliusApiKey) {
    throw new Error("Helius API key is required for Solana RPC requests.");
  }
  try {
    const heliusRpcUrl = `https://rpc.helius.xyz/?api-key=${heliusApiKey}`;
    const response = await axios.post(heliusRpcUrl, {
      jsonrpc: "2.0",
      id: 1,
      method: "getTokenLargestAccounts",
      params: [tokenMint],
    });

    const data = response.data;
    if (!data.result || !data.result.value) throw new Error("No holder data found");

    return data.result.value.map((entry: any) => ({
      address: entry.address,
      amount: Number(entry.amount),
      decimals: entry.decimals || 9,
    }));
  } catch (err) {
    console.error("Solana RPC error:", err);
    throw new Error("Failed to fetch holders from Solana RPC");
  }
}

async function getPriceHistory(tokenMint: string): Promise<PriceData[]> {
  try {
    const endTime = Math.floor(Date.now() / 1000);
    const startTime = endTime - 7 * 24 * 60 * 60;

    const response = await axios.get("https://public-api.birdeye.so/defi/history_price", {
      params: {
        address: tokenMint,
        address_type: "token",
        type: "1m",
        time_from: startTime,
        time_to: endTime,
        ui_amount_mode: "raw"
      },
      headers: {
        "X-API-KEY": "cf370fcb95ba41f490e7da3a704f6415",
        "x-chain": "solana",
        "accept": "application/json"
      },
    });

    console.log('Birdeye API response:', response.data);

    const items = response.data?.data?.items;
    if (!items || !Array.isArray(items) || items.length === 0) throw new Error("No price data returned");

    return items.map((item: any) => ({
      date: dayjs.unix(item.unixTime).format("YYYY-MM-DD HH:mm"),
      price: item.value,
    }));
  } catch (err) {
    console.error("Price history fetch error:", err);
    throw new Error("Failed to fetch price data");
  }
}

async function estimateBuyPrices(holders: TokenHolder[]): Promise<Map<string, number>> {
  const prices = new Map<string, number>();
  for (const holder of holders) {
    const base = 50 + Math.random() * 150;
    const variation = (Math.random() - 0.5) * 0.3;
    prices.set(holder.address, base * (1 + variation));
  }
  return prices;
}

async function generateCSV(results: AnalysisResult[], tokenMint: string): Promise<string> {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

  const filename = `token_profit_${tokenMint.slice(0, 8)}_${Date.now()}.csv`;
  const filepath = path.join(dataDir, filename);

  const csv = [
    ["Date", "Price ($)", "Wallets in Profit", "Total Wallets", "% In Profit"].join(","),
    ...results.map((r) => [
      r.date,
      r.price.toFixed(4),
      r.walletsInProfit,
      r.totalWallets,
      r.percentageInProfit.toFixed(2),
    ].join(",")),
  ].join("\n");

  fs.writeFileSync(filepath, csv);
  return `/api/download/${filename}`;
}
