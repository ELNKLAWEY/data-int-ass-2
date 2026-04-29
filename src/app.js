require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// Simple template engine using plain HTML + handlebars-like syntax
function renderTemplate(templateName, data = {}) {
  const filePath = path.join(__dirname, '../views', `${templateName}.html`);
  let html = fs.readFileSync(filePath, 'utf-8');

  // {{#each array}} ... {{/each}}
  html = html.replace(/\{\{#each (\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (_, key, block) => {
    const items = data[key] || [];
    return items.map(item => {
      let rendered = block;
      rendered = rendered.replace(/\{\{this\.(\w+)\}\}/g, (__, field) => item[field] ?? '');
      rendered = rendered.replace(/\{\{#if this\.(\w+)\}\}([\s\S]*?)\{\{else\}\}([\s\S]*?)\{\{\/if\}\}/g,
        (__, field, truePart, falsePart) => item[field] ? truePart : falsePart);
      return rendered;
    }).join('');
  });

  // {{#if_eq var "value"}} ... {{/if_eq}}
  html = html.replace(/\{\{#if_eq (\w+(?:\.\w+)*) "([^"]+)"\}\}([\s\S]*?)\{\{\/if_eq\}\}/g, (_, keyPath, val, block) => {
    const actual = keyPath.split('.').reduce((o, k) => o?.[k], data);
    return actual === val ? block : '';
  });

  // {{#if var}} ... {{else}} ... {{/if}}
  html = html.replace(/\{\{#if (\w+)\}\}([\s\S]*?)\{\{else\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, key, truePart, falsePart) =>
    data[key] ? truePart : falsePart
  );

  // {{#if var}} ... {{/if}}
  html = html.replace(/\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, key, block) =>
    data[key] ? block : ''
  );

  // {{var}} and {{var.prop}}
  html = html.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (_, keyPath) => {
    const val = keyPath.split('.').reduce((o, k) => o?.[k], data);
    return val !== undefined && val !== null ? String(val) : '';
  });

  return html;
}

// Attach render helper to res
app.use((req, res, next) => {
  res.render = (view, data = {}) => {
    try {
      const html = renderTemplate(view, data);
      res.send(html);
    } catch (err) {
      console.error('Render error:', err);
      res.status(500).send('<h1>Server Error</h1><p>' + err.message + '</p>');
    }
  };
  next();
});

app.get('/', (req, res) => res.render('index'));

app.use('/', authRoutes);
app.use('/', protectedRoutes);

app.use((req, res) => {
  res.status(404).render('error', { message: 'Page not found.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🔐 SecureAuth running on http://localhost:${PORT}\n`);
  console.log('  Routes:');
  console.log('  GET  /register     → Registration page');
  console.log('  GET  /login        → Login page');
  console.log('  GET  /dashboard    → Dashboard (protected)');
  console.log('  GET  /admin        → Admin only');
  console.log('  GET  /manager      → Manager + Admin');
  console.log('  GET  /user         → User only');
  console.log('  GET  /profile      → All authenticated users\n');
});

module.exports = app;
