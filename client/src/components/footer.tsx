export default function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <p className="text-sm text-muted-foreground">
            CryptoAI Advisor - AI-Powered Trading Analysis
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
