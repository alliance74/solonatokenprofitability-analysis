import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Home, BarChart3 } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent rounded-3xl" />

        <Card className="relative max-w-md w-full border-border/50 backdrop-blur-sm bg-card/50">
          <CardContent className="p-8 text-center">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-destructive/10 border border-destructive/20">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
            </div>

            {/* Content */}
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              404
            </h1>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Page Not Found
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              The page you're looking for doesn't exist or may have been moved.
              Let's get you back to analyzing token profitability.
            </p>

            {/* Actions */}
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Return to Home
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Start Analysis
                </Link>
              </Button>
            </div>

            {/* Additional info */}
            <p className="text-xs text-muted-foreground mt-6">
              Path:{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-foreground">
                {location.pathname}
              </code>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
