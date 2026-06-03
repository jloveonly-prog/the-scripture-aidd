import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import { getAllItems, createItem } from './db/schema';
import { Layout } from './components/Layout';
import { BoardList } from './components/BoardList';

const app = new Hono();

app.use('/public/*', serveStatic({ root: './' }));

app.get('/', (c) => {
  const items = getAllItems();
  return c.html(
    <Layout title="QR Code Board">
      <div class="max-w-3xl mx-auto px-4 py-8">
        <header class="text-center mb-10">
          <h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">QR Code Board</h1>
          <p class="text-gray-500">Scan QR codes and share them instantly.</p>
        </header>

        <div class="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100">
          <div class="p-6 bg-gradient-to-b from-gray-50 to-white" x-data="{ scanning: false, result: '' }">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect x="7" y="7" width="10" height="10" rx="1"/><path d="M7 12h10"/><path d="M12 7v10"/></svg>
                Scanner
              </h2>
              <button 
                x-on:click="scanning = !scanning; if(scanning) startScanner(); else stopScanner();"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <span x-text="scanning ? 'Stop Scanning' : 'Start Camera'"></span>
              </button>
            </div>
            
            <div x-show="scanning" class="mb-6 rounded-xl overflow-hidden bg-black aspect-video relative flex items-center justify-center border-2 border-dashed border-gray-300">
              <div id="qr-reader" class="w-full"></div>
            </div>

            {/* Form to submit scanned result */}
            <form hx-post="/api/board" hx-target="#board-list" hx-swap="afterbegin" x-on:submit="result = ''" class="flex gap-3">
              <input 
                type="text" 
                name="content" 
                x-model="result" 
                placeholder="Scanned result will appear here..." 
                required
                class="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button type="submit" class="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg">
                Post
              </button>
            </form>
          </div>
        </div>

        <div class="space-y-4">
          <h2 class="text-xl font-bold flex items-center gap-2 mb-4 px-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Recent Scans
          </h2>
          <div id="board-list" class="space-y-3">
            <BoardList items={items} />
          </div>
        </div>
      </div>
    </Layout>
  );
});

app.post('/api/board', async (c) => {
  const body = await c.req.parseBody();
  const content = body['content'];
  if (typeof content !== 'string' || !content.trim()) {
    return c.text('Content is required', 400);
  }
  
  // Basic validation/sanitization to prevent XSS could be added here
  // For JSX, Hono escapes HTML by default.
  const newItem = createItem(content.trim());
  
  // Return just the newly created item to be prepended via HTMX
  return c.html(
    <div class="p-4 bg-white rounded-xl shadow-sm border border-gray-100 flex justify-between items-start animate-[slideDown_0.3s_ease-out]">
      <p class="text-gray-800 break-all">{newItem.content}</p>
      <span class="text-xs text-gray-400 whitespace-nowrap ml-4">Just now</span>
    </div>
  );
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});
