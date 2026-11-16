// Minimal sample healthcare app (in-memory, demo only - no real patient data).
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const appointments = [];
const claims = [];

const isLoggedIn = (req) => (req.headers.cookie || '').includes('session=ok');
const layout = (title, body) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>${title}</title></head><body><main><h1>${title}</h1>${body}</main></body></html>`;

app.get('/login', (req, res) => {
  res.send(layout('Clinic Portal Login', `
  <form id="login-form">
    <label for="username">Username</label><input id="username" data-testid="username">
    <label for="password">Password</label><input id="password" type="password" data-testid="password">
    <button type="submit" data-testid="login-button">Sign in</button>
    <p data-testid="login-error" role="alert"></p>
  </form>
  <script>
    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const r = await fetch('/api/login', {method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({username: username.value, password: password.value})});
      if (r.ok) location.href = '/appointments';
      else document.querySelector('[data-testid=login-error]').textContent = 'Invalid credentials';
    });
  </script>`));
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'nurse1' && password === 'Pass@123') {
    res.cookie('session', 'ok', { httpOnly: true });
    return res.json({ ok: true });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

app.get('/appointments', (req, res) => {
  if (!isLoggedIn(req)) return res.redirect('/login');
  res.send(layout('Appointments', `
  <form id="appt-form">
    <label for="patient-name">Patient name</label><input id="patient-name" data-testid="patient-name">
    <label for="appointment-date">Date</label><input id="appointment-date" type="date" data-testid="appointment-date">
    <label for="doctor">Doctor</label>
    <select id="doctor" data-testid="doctor"><option>Dr. Rao</option><option>Dr. Smith</option></select>
    <button type="submit" data-testid="book-appointment">Book</button>
    <p data-testid="form-error" role="alert"></p>
  </form>
  <ul data-testid="appointment-list"></ul>
  <script>
    const list = document.querySelector('[data-testid=appointment-list]');
    const err = document.querySelector('[data-testid=form-error]');
    const render = (items) => { list.innerHTML = items.map(a => '<li>' + a.patientName + ' - ' + a.date + ' - ' + a.doctor + '</li>').join(''); };
    fetch('/api/appointments').then(r => r.json()).then(render);
    document.getElementById('appt-form').addEventListener('submit', async (e) => {
      e.preventDefault(); err.textContent = '';
      const r = await fetch('/api/appointments', {method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({patientName: document.getElementById('patient-name').value,
          date: document.getElementById('appointment-date').value, doctor: document.getElementById('doctor').value})});
      if (!r.ok) { err.textContent = (await r.json()).error; return; }
      render(await (await fetch('/api/appointments')).json());
    });
  </script>`));
});

app.get('/api/appointments', (req, res) => res.json(appointments));

app.post('/api/appointments', (req, res) => {
  const { patientName, date, doctor } = req.body;
  if (!patientName || !patientName.trim()) return res.status(400).json({ error: 'Patient name is required' });
  if (!date) return res.status(400).json({ error: 'Date is required' });
  const appt = { id: appointments.length + 1, patientName: patientName.trim(), date, doctor };
  appointments.push(appt);
  res.status(201).json(appt);
});

app.post('/api/claims', (req, res) => {
  const { patientName, amount } = req.body;
  if (!patientName) return res.status(400).json({ error: 'Patient name is required' });
  if (typeof amount !== 'number' || amount <= 0) return res.status(400).json({ error: 'Amount must be greater than 0' });
  const claim = { id: claims.length + 1, patientName, amount, status: 'SUBMITTED' };
  claims.push(claim);
  res.status(201).json(claim);
});

app.get('/', (req, res) => res.redirect('/login'));
app.listen(3000, () => console.log('Clinic portal running on http://localhost:3000'));
