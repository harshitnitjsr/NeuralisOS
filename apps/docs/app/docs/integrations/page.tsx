"use client";
import { motion } from "framer-motion";

export default function IntegrationsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold tracking-tight mb-4 text-white bg-clip-text text-transparent bg-gradient-to-br from-white via-zinc-200 to-zinc-600">
        Integrations & Embed
      </h1>
      <p className="text-lg text-zinc-400 font-light mb-10 tracking-wide">
        Embed your custom NeuralisOS assistant across web and mobile platforms.
      </p>

      <div className="prose prose-invert prose-zinc max-w-none">
        <p className="text-zinc-400 mb-6 leading-relaxed">
          Because the embed URL provides a pure HTML framing wrapper without
          restrictive HTTP headers, you can integrate the chat widget natively
          into almost any stack using standard WebViews or iframes.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 border-b border-white/10 pb-2">
          Vanilla React
        </h2>
        <p className="text-zinc-400 mb-4">
          In a standard React App (Vite or Create React App), you can build a
          reusable floating widget component:
        </p>
        <pre className="bg-black/60 border border-white/[0.05] p-4 rounded-xl overflow-x-auto text-sm font-mono text-zinc-300 mb-6">
          <code>{`import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

export default function FloatWidget({ orgId }) {
  const [open, setOpen] = useState(false);
  const embedUrl = \`https://your-domain.com/embed/\${orgId}\`;

  return (
    <>
      <button 
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-xl z-[9999]"
      >
        <MessageSquare />
      </button>

      {open && (
        <iframe 
          src={embedUrl}
          allow="microphone"
          className="fixed bottom-24 right-6 w-[380px] h-[560px] border-none rounded-2xl shadow-2xl z-[9998]"
        />
      )}
    </>
  );
}`}</code>
        </pre>

        <h2 className="text-2xl font-semibold mt-8 mb-4 border-b border-white/10 pb-2">
          Next.js (App Router)
        </h2>
        <p className="text-zinc-400 mb-4">
          When using Next.js App Router, ensure your widget file is a Client
          Component. You can then drop it into your root{" "}
          <code className="bg-white/10 px-1 py-0.5 rounded">layout.tsx</code>.
        </p>
        <pre className="bg-black/60 border border-white/[0.05] p-4 rounded-xl overflow-x-auto text-sm font-mono text-zinc-300 mb-6">
          <code>{`"use client";

import { useState } from "react";
// Same component implementation as Vanilla React
`}</code>
        </pre>
        <p className="text-zinc-400 mb-6">
          In your{" "}
          <code className="bg-white/10 px-1 py-0.5 rounded">
            app/layout.tsx
          </code>
          :
        </p>
        <pre className="bg-black/60 border border-white/[0.05] p-4 rounded-xl overflow-x-auto text-sm font-mono text-zinc-300 mb-6">
          <code>{`import FloatWidget from "@/components/FloatWidget";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <FloatWidget orgId="YOUR_ORG_ID" />
      </body>
    </html>
  );
}`}</code>
        </pre>

        <h2 className="text-2xl font-semibold mt-8 mb-4 border-b border-white/10 pb-2">
          Android (Kotlin WebView)
        </h2>
        <p className="text-zinc-400 mb-4">
          For native Android apps, use the Android{" "}
          <code className="bg-white/10 px-1 py-0.5 rounded">WebView</code>{" "}
          component. Don't forget to enable JavaScript and DOM Storage.
        </p>
        <pre className="bg-black/60 border border-white/[0.05] p-4 rounded-xl overflow-x-auto text-sm font-mono text-zinc-300 mb-6">
          <code>{`import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class ChatActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        val webView = WebView(this)
        
        // Essential configuration
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
        }
        
        webView.webViewClient = WebViewClient()
        
        // Load your NeuralisOS embed route
        webView.loadUrl("https://your-domain.com/embed/YOUR_ORG_ID")
        
        setContentView(webView)
    }
}`}</code>
        </pre>
        <p className="text-xs text-zinc-500 italic">
          Be absolutely sure to add the{" "}
          <code className="bg-white/10 px-1 py-0.5 rounded">
            android.permission.INTERNET
          </code>{" "}
          permission to your AndroidManifest.xml.
        </p>
      </div>
    </motion.div>
  );
}
