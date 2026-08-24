const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const port = Number(process.env.PORT) || 3000;
const publicDirectory = path.join(__dirname, 'public');

const articles = [
  {
    id: 'designing-for-the-second-read',
    title: 'Designing for the second read',
    excerpt: 'The best technical writing does more than explain a system. It gives readers a way to return, orient themselves, and go deeper.',
    author: 'Maya Chen',
    role: 'Staff engineer, Saffron',
    date: 'Aug 21, 2026',
    readTime: '7 min read',
    topic: 'Craft',
    color: 'coral',
    featured: true
  },
  {
    id: 'the-quiet-power-of-boring-infrastructure',
    title: 'The quiet power of boring infrastructure',
    excerpt: 'Predictable systems compound. A field guide to choosing the dependable option when the exciting one is calling.',
    author: 'Jon Bell',
    role: 'Infrastructure lead, Northstar',
    date: 'Aug 19, 2026',
    readTime: '9 min read',
    topic: 'Systems',
    color: 'blue'
  },
  {
    id: 'shipping-your-first-ai-feature',
    title: 'Shipping your first AI feature without losing the plot',
    excerpt: 'A practical framework for deciding where intelligence belongs, how to measure it, and when not to add it.',
    author: 'Priya Shah',
    role: 'Product engineer, Lumen',
    date: 'Aug 16, 2026',
    readTime: '6 min read',
    topic: 'AI & Data',
    color: 'yellow'
  },
  {
    id: 'css-is-a-product-surface',
    title: 'CSS is a product surface',
    excerpt: 'A small set of visual decisions can make a complex tool feel calm. Here is how to make them deliberately.',
    author: 'Theo Martins',
    role: 'Design systems, Rook',
    date: 'Aug 12, 2026',
    readTime: '5 min read',
    topic: 'Frontend',
    color: 'green'
  }
];

function sendJson(response, data) {
  response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(data));
}

function serveStatic(response, requestPath) {
  const requested = requestPath === '/' ? '/index.html' : requestPath;
  const filePath = path.normalize(path.join(publicDirectory, requested));
  if (!filePath.startsWith(publicDirectory)) {
    response.writeHead(403);
    return response.end('Forbidden');
  }
  fs.readFile(filePath, (error, file) => {
    if (error) {
      response.writeHead(404, { 'Content-Type': 'text/plain' });
      return response.end('Not found');
    }
    const extension = path.extname(filePath);
    const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' };
    response.writeHead(200, { 'Content-Type': `${types[extension] || 'application/octet-stream'}; charset=utf-8` });
    response.end(file);
  });
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  if (url.pathname === '/health') return sendJson(response, { status: 'ok' });
  if (url.pathname === '/api/articles') {
    const query = (url.searchParams.get('q') || '').toLowerCase();
    const topic = url.searchParams.get('topic');
    const filtered = articles.filter((article) => {
      const matchesQuery = !query || `${article.title} ${article.excerpt} ${article.author}`.toLowerCase().includes(query);
      const matchesTopic = !topic || topic === 'All' || article.topic === topic;
      return matchesQuery && matchesTopic;
    });
    return sendJson(response, filtered);
  }
  if (url.pathname.startsWith('/api/articles/')) {
    const article = articles.find((item) => item.id === url.pathname.split('/').pop());
    if (!article) {
      response.writeHead(404);
      return response.end('Article not found');
    }
    return sendJson(response, article);
  }
  serveStatic(response, url.pathname);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Bytebrief listening on http://localhost:${port}`);
});