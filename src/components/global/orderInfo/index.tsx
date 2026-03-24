"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ImEmbed2 } from "react-icons/im";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy } from "lucide-react";

interface SchemaModalProps {
  schema: {
    _id: string;
    name: string;
    fields: {
      name: string;
      type: string;
    }[];
    link: string;
    websSiteUrl: string;
  };
}

const SchemaInfo = ({ schema }: SchemaModalProps) => {
  const [copied, setCopied] = useState(false);

  const link = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/data/${schema._id}`;

  const embedCode = `
  <form action="${link}" method="POST">
    ${schema.fields.map((field) => `<input type="text" name="${field.name}" placeholder="${field.name}" />\n`).join("")}
    <button type="submit">Submit</button>
  </form>

  `;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    toast.success("Copied to clipboard");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  return (
    <ScrollArea className="h-[600px] space-y-4 py-4 ">
      <div className="flex w-full flex-col gap-6 pr-4">
        <div className="flex justify-between  items-center mb-3">
          <div>
            <h2 className="text-2xl font-bold">{schema.name}</h2>
            <p className="text-sm text-muted-foreground">
              Schema ID: {schema._id}
            </p>
            <p className="text-sm text-muted-foreground">
              Website URL: {schema.websSiteUrl}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="flex items-center gap-2"
          >
            <ImEmbed2 className="w-4 h-4" />
            {copied ? "Copied!" : "Copy Embed Code"}
          </Button>
        </div>

        <div className="bg-muted/20 rounded-lg p-4">
          <h3 className="font-semibold mb-3">Fields</h3>
          <div className="space-y-2">
            {schema.fields.map((field, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-background rounded-lg"
              >
                <span className="font-medium">{field.name}</span>
                <Badge variant="secondary">{field.type}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-muted/20 max-w-[500px] overflow-x-scroll rounded-lg p-4">
          <h3 className="font-semibold mb-3">Embed Code</h3>
          <pre className="bg-background p-4 rounded-lg overflow-x-scroll text-sm">
            {embedCode}
          </pre>
        </div>

        <div className="bg-muted/20 rounded-lg p-4">
          <h3 className="font-semibold mb-3">Preview Link</h3>
          <div className="bg-background p-2 rounded-lg w-full flex items-center justify-between">
            <p className="text-sm text-muted-foreground break-all">{link}</p>
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default SchemaInfo;
