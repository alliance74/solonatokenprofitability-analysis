import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  Download,
  Wallet,
  DollarSign,
  BarChart3,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalysisResult {
  date: string;
  price: number;
  walletsInProfit: number;
  totalWallets: number;
  percentageInProfit: number;
}

interface AnalysisResponse {
  results: AnalysisResult[];
  csvDownloadUrl: string;
}

export default function Index() {
  const [tokenMint, setTokenMint] = useState(
    "So11111111111111111111111111111111111111112",
  );
  const [heliusApiKey, setHeliusApiKey] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!tokenMint || !heliusApiKey) {
      setError("Please provide both Token Mint Address and Helius API Key");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch("/api/analyze-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tokenMint,
          heliusApiKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const data: AnalysisResponse = await response.json();
      setResults(data.results);
      setDownloadUrl(data.csvDownloadUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
    }
  };

  const averageProfit = results
    ? results.reduce((sum, day) => sum + day.percentageInProfit, 0) /
      results.length
    : 0;

  const totalWallets =
    results && results.length > 0
      ? results[results.length - 1].totalWallets
      : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 rounded-full bg-primary/10 border border-primary/20 animate-float">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-6">
              Solana Token Profitability
              <span className="block text-primary animate-gradient-x bg-gradient-to-r from-primary via-green-500 to-primary bg-clip-text">
                Analysis
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Analyze token holder profitability over the past 7 days. Track
              wallet performance, profit margins, and export comprehensive CSV
              reports.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 -mt-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Analysis Form */}
          <Card className="mb-8 border-border/50 backdrop-blur-sm bg-card/50 shadow-xl shadow-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Token Analysis Configuration
              </CardTitle>
              <CardDescription>
                Enter your token mint address and Helius API key to begin the
                analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="tokenMint">SPL Token Mint Address</Label>
                  <Input
                    id="tokenMint"
                    value={tokenMint}
                    onChange={(e) => setTokenMint(e.target.value)}
                    placeholder="So11111111111111111111111111111111111111112"
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Example: SOL token mint address (wrapped SOL)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heliusApiKey">Helius API Key</Label>
                  <Input
                    id="heliusApiKey"
                    type="password"
                    value={heliusApiKey}
                    onChange={(e) => setHeliusApiKey(e.target.value)}
                    placeholder="Enter your Helius API key or 'demo' for demo mode"
                  />
                  <p className="text-xs text-muted-foreground">
                    Get your free API key at{" "}
                    <a
                      href="https://helius.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      helius.dev
                    </a>{" "}
                    or enter{" "}
                    <code className="bg-muted px-1 py-0.5 rounded text-xs">
                      demo
                    </code>{" "}
                    to try with sample data
                  </p>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-destructive font-medium">{error}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !tokenMint || !heliusApiKey}
                  className="flex-1 sm:flex-none relative overflow-hidden"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Token...
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-gradient-x" />
                    </>
                  ) : (
                    <>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Start Analysis
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setHeliusApiKey("demo");
                    setTimeout(() => handleAnalyze(), 100);
                  }}
                  disabled={isAnalyzing}
                  className="flex-1 sm:flex-none"
                >
                  <Activity className="mr-2 h-4 w-4" />
                  Try Demo
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {isAnalyzing && (
            <Card className="mb-8 border-border/50 backdrop-blur-sm bg-card/50">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="flex items-center justify-center">
                    <div className="p-3 rounded-full bg-primary/10 border border-primary/20 animate-pulse">
                      <Activity className="h-8 w-8 text-primary animate-spin" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Analyzing Token Data
                    </h3>
                    <p className="text-muted-foreground">
                      This may take a few moments while we process blockchain
                      data...
                    </p>
                  </div>
                  <div className="space-y-3 max-w-md mx-auto">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <span>Fetching token holders</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100" />
                      <span>Retrieving price history</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200" />
                      <span>Calculating profitability</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Section */}
          {results && !isAnalyzing && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                          Total Wallets
                        </p>
                        <p className="text-2xl font-bold">
                          {totalWallets.toLocaleString()}
                        </p>
                      </div>
                      <Wallet className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                          Avg. Profit Rate
                        </p>
                        <p
                          className={cn(
                            "text-2xl font-bold transition-colors",
                            averageProfit > 50
                              ? "text-green-500"
                              : "text-red-500",
                          )}
                        >
                          {averageProfit.toFixed(1)}%
                        </p>
                      </div>
                      {averageProfit > 50 ? (
                        <TrendingUp className="h-8 w-8 text-green-500 group-hover:scale-110 transition-transform" />
                      ) : (
                        <TrendingDown className="h-8 w-8 text-red-500 group-hover:scale-110 transition-transform" />
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                          Analysis Period
                        </p>
                        <p className="text-2xl font-bold">7 Days</p>
                      </div>
                      <Activity className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Daily Results */}
              <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Daily Profitability Analysis</CardTitle>
                    <CardDescription>
                      7-day breakdown of wallet profitability and token price
                    </CardDescription>
                  </div>
                  {downloadUrl && (
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      size="sm"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download CSV
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results.map((day, index) => (
                      <div
                        key={day.date}
                        className="p-4 rounded-lg border border-border/50 bg-card/20 hover:bg-card/40 hover:border-primary/30 transition-all duration-300 group"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">{day.date}</Badge>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                ${day.price.toFixed(4)}
                              </span>
                            </div>
                          </div>
                          <Badge
                            variant={
                              day.percentageInProfit > 50
                                ? "default"
                                : "secondary"
                            }
                            className={cn(
                              day.percentageInProfit > 50
                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                : "bg-red-500/10 text-red-500 border-red-500/20",
                            )}
                          >
                            {day.percentageInProfit.toFixed(1)}% Profitable
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                          <span>
                            {day.walletsInProfit.toLocaleString()} /{" "}
                            {day.totalWallets.toLocaleString()} wallets in
                            profit
                          </span>
                        </div>

                        <Progress
                          value={day.percentageInProfit}
                          className="h-2 group-hover:h-3 transition-all duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-border/50 pt-8">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              <span className="font-medium">
                Solana Token Profitability Analysis
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Powered by{" "}
              <a
                href="https://helius.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Helius API
              </a>{" "}
              and{" "}
              <a
                href="https://birdeye.so"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Birdeye
              </a>{" "}
              for real-time blockchain data
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span>Built with React + Express</span>
              <span>•</span>
              <span>Solana Web3.js</span>
              <span>•</span>
              <span>TypeScript</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
