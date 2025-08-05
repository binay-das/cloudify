"use client";

import { Copy, CopyCheck  } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Button
      onClick={handleCopy}
      className="transition bg-background text-primary"
      title="Copy to clipboard"
    >
      {copied ? <CopyCheck className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
    </Button>
  );
}
