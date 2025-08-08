import React, { useEffect, useState } from 'react';

interface Signup {
  id: number;
  username: string;
}

interface Report {
  id: number;
  reason: string;
}

const Admin: React.FC = () => {
  const [pendingCreators, setPendingCreators] = useState<Signup[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    // Basic token check. Redirect non-admins away.
    const t = localStorage.getItem('token');
    if (!t) {
      window.location.href = '/';
      return;
    }
    try {
      const payload = JSON.parse(atob(t.split('.')[1]));
      if (payload.role !== 'admin') {
        window.location.href = '/';
      }
    } catch (e) {
      window.location.href = '/';
    }

    // Placeholder data for the demo
    setPendingCreators([{ id: 1, username: 'newCreator' }]);
    setReports([{ id: 101, reason: 'Offensive content' }]);
  }, []);

  const approveCreator = async (id: number) => {
    await fetch('/api/approveCreator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setPendingCreators((prev) => prev.filter((c) => c.id !== id));
  };

  const banUser = async (id: number) => {
    await fetch('/api/banUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
  };

  const reviewReport = async (id: number) => {
    await fetch('/api/reviewReport', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      <section>
        <h2 className="font-semibold mb-2">Pending Creator Signups</h2>
        <ul className="space-y-2">
          {pendingCreators.map((c) => (
            <li key={c.id} className="flex justify-between bg-gray-800 p-2 rounded">
              <span>{c.username}</span>
              <div className="space-x-2">
                <button className="bg-green-600 px-2 rounded" onClick={() => approveCreator(c.id)}>
                  Approve
                </button>
                <button className="bg-red-600 px-2 rounded" onClick={() => banUser(c.id)}>
                  Ban
                </button>
              </div>
            </li>
          ))}
          {pendingCreators.length === 0 && <li>No pending signups.</li>}
        </ul>
      </section>
      <section>
        <h2 className="font-semibold mb-2">Reported Content</h2>
        <ul className="space-y-2">
          {reports.map((r) => (
            <li key={r.id} className="flex justify-between bg-gray-800 p-2 rounded">
              <span>Report #{r.id}: {r.reason}</span>
              <button className="bg-blue-600 px-2 rounded" onClick={() => reviewReport(r.id)}>
                Mark Reviewed
              </button>
            </li>
          ))}
          {reports.length === 0 && <li>No reports.</li>}
        </ul>
      </section>
    </div>
  );
};

export default Admin;
