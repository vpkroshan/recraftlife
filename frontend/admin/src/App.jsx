import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

const submissions = [
  { id: 'RCL-001', customer: 'Jane Customer', category: 'Smartphone', status: 'offer_sent', value: '$45', pickup: '2026-10-08' },
  { id: 'RCL-002', customer: 'Sam Green', category: 'Laptop', status: 'under_review', value: 'Pending', pickup: 'TBD' },
  { id: 'RCL-003', customer: 'Lisa Wright', category: 'Tablet', status: 'pickup_scheduled', value: '$30', pickup: '2026-10-12' },
  { id: 'RCL-004', customer: 'Mike Hill', category: 'Monitor', status: 'payment_completed', value: '$80', pickup: '2026-10-05' }
];

function App() {
  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">R</div>
          <div>
            <h1>RecraftLife</h1>
            <small>Operations</small>
          </div>
        </div>

        <nav className="nav">
          <button className="nav-item active">Dashboard</button>
          <button className="nav-item">Submissions</button>
          <button className="nav-item">Offers</button>
          <button className="nav-item">Pickups</button>
          <button className="nav-item">Payments</button>
          <button className="nav-item">Reports</button>
          <button className="nav-item">Users</button>
          <button className="nav-item">Settings</button>
        </nav>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Overview</p>
            <h2>Operations dashboard</h2>
          </div>
          <button className="primary-btn">Create offer</button>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <span>New submissions</span>
            <strong>28</strong>
            <small>+12% vs last week</small>
          </div>
          <div className="stat-card">
            <span>Pending offers</span>
            <strong>17</strong>
            <small>4 expiring today</small>
          </div>
          <div className="stat-card">
            <span>Open pickups</span>
            <strong>9</strong>
            <small>3 in transit</small>
          </div>
          <div className="stat-card">
            <span>Processed this month</span>
            <strong>42</strong>
            <small>2.8 t diverted</small>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel">
            <div className="panel-header">
              <h3>Recent submissions</h3>
              <button className="link-btn">View all</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Request</th>
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
                    <td><span className={`badge status-${item.status}`}>{item.status}</span></td>
                    <td>{item.value}</td>
                    <td>{item.pickup}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>Operational health</h3>
            </div>
            <div className="mini-chart">
              <div className="bar-group">
                <span className="bar bar-1" style={{ height: '65%' }} />
                <span className="bar bar-2" style={{ height: '82%' }} />
                <span className="bar bar-3" style={{ height: '58%' }} />
                <span className="bar bar-4" style={{ height: '90%' }} />
                <span className="bar bar-5" style={{ height: '74%' }} />
              </div>
            </div>
            <ul className="metrics">
              <li><span>Pickup SLA</span><strong>94%</strong></li>
              <li><span>Offer response</span><strong>1.8d</strong></li>
              <li><span>Payment success</span><strong>98.2%</strong></li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
