const grid = document.querySelector('#articleGrid');
const topics = document.querySelector('#topics');
const searchButton = document.querySelector('#searchButton');

function articleTemplate(article) {
  return `<article class="article ${article.featured ? 'featured' : ''}"><div class="article-visual ${article.color}"></div><p class="eyebrow">${article.topic}</p><h3>${article.title}</h3><p>${article.excerpt}</p><div class="article-meta"><span class="author">${article.author}</span><span>${article.date} · ${article.readTime}</span></div></article>`;
}

async function loadArticles(topic = 'All', query = '') {
  const params = new URLSearchParams({ topic });
  if (query) params.set('q', query);
  const response = await fetch(`/api/articles?${params}`);
  const results = await response.json();
  grid.innerHTML = results.length ? results.map(articleTemplate).join('') : '<p>No essays found. Try another search.</p>';
}

topics.addEventListener('click', (event) => {
  const button = event.target.closest('[data-topic]');
  if (!button) return;
  document.querySelectorAll('.topic').forEach((item) => item.classList.remove('active'));
  button.classList.add('active');
  loadArticles(button.dataset.topic);
});

searchButton.addEventListener('click', () => {
  const query = window.prompt('Search Bytebrief');
  if (query) loadArticles('All', query);
});

document.querySelector('#startReading').addEventListener('click', () => document.querySelector('#discover').scrollIntoView());
document.querySelector('#writeButton').addEventListener('click', () => window.alert('The editor is coming soon. Join the list to hear when it opens.'));
document.querySelector('#newsletterForm').addEventListener('submit', (event) => {
  event.preventDefault();
  document.querySelector('#formMessage').textContent = 'You are on the list. Welcome to the signal.';
  event.target.reset();
});

loadArticles();