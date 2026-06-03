import { html } from 'hono/html';

interface LayoutProps {
  title: string;
  children: any;
}

export function Layout({ title, children }: LayoutProps) {
  return html`
    <!DOCTYPE html>
    <html lang="ko" class="h-full">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        
        <!-- Google Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
        
        <!-- Tailwind CSS -->
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
          tailwind.config = {
            theme: {
              extend: {
                fontFamily: {
                  sans: ['Inter', 'sans-serif'],
                  outfit: ['Outfit', 'sans-serif'],
                },
                colors: {
                  cathedralGold: '#d4af37',
                  mutedGold: '#aa8010',
                  deepSlate: '#0a0b0d',
                  glassCharcoal: '#121418',
                  holyWhite: '#f1f5f9',
                  slateGrey: '#94a3b8',
                  repentRed: '#ef4444',
                }
              }
            }
          }
        </script>
        
        <!-- HTMX and Alpine.js -->
        <script src="https://unpkg.com/htmx.org@1.9.12"></script>
        <script defer src="https://unpkg.com/alpinejs@3.14.0/dist/cdn.min.js"></script>
        
        <style>
          body {
            font-family: 'Inter', sans-serif;
            background-color: #0a0b0d;
            color: #f1f5f9;
          }
          .font-outfit {
            font-family: 'Outfit', sans-serif;
          }
          /* Custom Scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
          }
          ::-webkit-scrollbar-track {
            background: #0a0b0d;
          }
          ::-webkit-scrollbar-thumb {
            background: #1e222b;
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #d4af37;
          }
        </style>
      </head>
      <body class="h-full flex flex-col antialiased">
        ${children}
      </body>
    </html>
  `;
}
