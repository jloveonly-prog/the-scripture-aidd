import { html } from 'hono/html';
import { type Child } from 'hono/jsx';

interface LayoutProps {
  title: string;
  children?: Child;
}

export const Layout = ({ title, children }: LayoutProps) => {
  return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        <link rel="stylesheet" href="/public/output.css" />
        <script src="https://unpkg.com/htmx.org@1.9.10"></script>
        <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
        <script src="https://unpkg.com/html5-qrcode"></script>
        <script src="/public/scanner.js" defer></script>
      </head>
      <body>
        ${children}
      </body>
    </html>
  `;
};
