import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

const submissions = [
  {
    id: 'RCL-001',
    customer: 'Jane Customer',
    category: 'Smartphone',
    status: 'offer_sent',
    value: '$45',
    pickup: '2026-10-08'
  },
  {
    id: 'RCL-002',
    customer: 'Sam Green',
    category: 'Laptop',
    status: 'under_review',
    value: 'Pending',
    pickup: 'TBD'
  }
];

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>RecraftLife</h1>
        <nav>
          <a href="#">Dashboard</a>
          <a href="#">Submissions</a>
          <a href="#">Offers</a>
          <a href="#">Pickups</a>
          <a href="#">Payments</a>
          <a href="#">Reports</a>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <h2>Operations dashboard</h2>
          <button>New offer</button>
        </header>

        <section className="stats-grid">
          <div className="stat-card"><span>New submissions</span><strong>28</strong></div>
          <div className="stat-card"><span>Offer sent</span><strong>17</strong></div>
          <div className="stat-card"><span>Pickup scheduled</span><strong>9</strong></div>
          <div className="stat-card"><span>Completed</span><strong>42</strong></div>
        </section>

        <section className="table-card">
          <h3>Recent submissions</h3>
          <table>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Customer</th>
                <th>Category</th>
                <th>Status</th>
                <th>Offer</th>
                <th>Pickup</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.customer}</td>
                  <td>{item.category}</td>
                  <td><span className="badge">{item.status}</span></td>
                  <td>{item.value}</td>
                  <td>{item.pickup}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
