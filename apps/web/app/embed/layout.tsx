import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NeuralisOS Chat",
  description: "AI-powered chat assistant embedded widget.",
};

/**
 * Standalone layout for the /embed route — intentionally bare.
 * No ClerkProvider, no nav, no sidebar. This is rendered inside an <iframe>
 * on third-party websites.
 */
export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0, overflow: "hidden", background: "#09090b" }}>
        {children}
      </body>
    </html>
  );
}
