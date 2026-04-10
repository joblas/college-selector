const http = require('http');
const { Pool } = require('pg');

const pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  database: 'college_selector',
  user: 'sellerdoor',
  password: 'sellerdoor',
});

const PORT = 8766;

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;

  try {
    if (path === '/health') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'healthy', service: 'college-db-api' }));
      return;
    }

    if (path === '/users') {
      const result = await pool.query('SELECT id, name, created_at FROM users ORDER BY created_at DESC');
      res.writeHead(200);
      res.end(JSON.stringify({ users: result.rows }));
      return;
    }

    if (path === '/users/create' && req.method === 'POST') {
      let body = '';
      for await (const chunk of req) body += chunk;
      const data = JSON.parse(body);
      
      const result = await pool.query(
        'INSERT INTO users (name, pin) VALUES ($1, $2) RETURNING id, name, created_at',
        [data.name, data.pin]
      );
      const user = result.rows[0];
      
      await pool.query('INSERT INTO profile (user_id, name) VALUES ($1, $2)', [user.id, data.name]);
      await pool.query('INSERT INTO weights (user_id) VALUES ($1)', [user.id]);
      
      res.writeHead(200);
      res.end(JSON.stringify({ user }));
      return;
    }

    if (path === '/sync' && req.method === 'GET') {
      const userId = url.searchParams.get('userId');
      const schools = await pool.query('SELECT * FROM schools WHERE user_id = $1', [userId]);
      const scholarships = await pool.query('SELECT * FROM scholarships WHERE user_id = $1', [userId]);
      const profile = await pool.query('SELECT * FROM profile WHERE user_id = $1', [userId]);
      const weights = await pool.query('SELECT * FROM weights WHERE user_id = $1', [userId]);
      
      res.writeHead(200);
      res.end(JSON.stringify({
        schools: schools.rows,
        scholarships: scholarships.rows,
        profile: profile.rows[0] || {},
        weights: weights.rows[0]?.data || {}
      }));
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  } catch (err) {
    console.error(err);
    res.writeHead(500);
    res.end(JSON.stringify({ error: err.message }));
  }
});

server.listen(PORT, () => {
  console.log(`🎓 College DB API running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
});