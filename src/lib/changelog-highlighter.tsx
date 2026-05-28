'use client'

import { useEffect } from 'react';
import hljs from 'highlight.js';
// Import the official VS Code theme styles directly from the package!
import 'highlight.js/styles/vs2015.css'; 

export default function ChangelogHighlighter() {
  useEffect(() => {
    // Finds all <pre><code> blocks on the page and colors them instantly
    hljs.highlightAll();
  }, []);

  return null; // This component doesn't render any UI, it just runs the script
}
