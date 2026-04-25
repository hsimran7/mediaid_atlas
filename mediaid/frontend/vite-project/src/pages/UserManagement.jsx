import { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';

export default function UserManagement({ showToast }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadUsers();
    loadStats();
  }, [roleFilter]);

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await usersAPI.getAll({ search, role: roleFilter });
      setUsers(data.users || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    try {
      const data = await usersAPI.getStats();
      setStats(data.stats);
    } catch (_) {}
  }

  async function handleToggleActive(id) {
    try {
      const res = await usersAPI.toggleActive(id);
      showToast(res.message, 'success');
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: res.isActive } : u));
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('PERMANENT DELETION: Are you sure? This will remove the user from the database.')) return;
    try {
      await usersAPI.delete(id);
      showToast('User deleted.', 'success');
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function handleRoleChange(id, role) {
    try {
      const res = await usersAPI.updateRole(id, role);
      showToast(res.message, 'success');
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role } : u));
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  return (
    <div className="page active">
      <div className="pg-body">
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 44, fontWeight: 900, color: 'var(--pine)', letterSpacing: -1 }}>USER MANAGEMENT</div>
            <div style={{ fontSize: 13, color: 'var(--text3)', fontWeight: 500, marginTop: 4, opacity: 0.8 }}>
              Manage contributors, seekers, and system access
            </div>
          </div>
          {stats && (
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 18, fontFamily: 'var(--display)', color: 'var(--cyan)' }}>{stats.total}</div>
                <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>TOTAL USERS</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 18, fontFamily: 'var(--display)', color: 'var(--green)' }}>{stats.activeToday}</div>
                <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>ACTIVE TODAY</div>
              </div>
            </div>
          )}
        </div>

        {/* FILTERS */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && loadUsers()}
              style={{ width: '100%', padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, color: 'var(--text)', outline: 'none' }}
            />
          </div>
          <select 
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            style={{ padding: '0 16px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, color: 'var(--text)', outline: 'none' }}
          >
            <option value="">All Roles</option>
            <option value="seeker">Seekers</option>
            <option value="contributor">Contributors</option>
            <option value="admin">Admins</option>
          </select>
          <button 
            onClick={loadUsers}
            style={{ padding: '0 24px', background: 'var(--cyan)', border: 'none', borderRadius: 10, color: '#000', fontWeight: 700, cursor: 'pointer' }}
          >
            SEARCH
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--cyan)', fontFamily: 'var(--mono)' }}>FETCHING USERS...</div>
        ) : (
          <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--line)' }}>
                  <th style={{ textAlign: 'left', padding: '14px 20px', color: 'var(--text3)', fontFamily: 'var(--mono)', fontSize: 10 }}>USER</th>
                  <th style={{ textAlign: 'left', padding: '14px 20px', color: 'var(--text3)', fontFamily: 'var(--mono)', fontSize: 10 }}>ROLE</th>
                  <th style={{ textAlign: 'left', padding: '14px 20px', color: 'var(--text3)', fontFamily: 'var(--mono)', fontSize: 10 }}>STATS</th>
                  <th style={{ textAlign: 'left', padding: '14px 20px', color: 'var(--text3)', fontFamily: 'var(--mono)', fontSize: 10 }}>STATUS</th>
                  <th style={{ textAlign: 'right', padding: '14px 20px', color: 'var(--text3)', fontFamily: 'var(--mono)', fontSize: 10 }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} style={{ borderBottom: '1px solid var(--line)', transition: 'all 0.2s', opacity: u.isActive ? 1 : 0.6 }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 24 }}>{u.avatar}</span>
                        <div>
                          <div style={{ fontWeight: 600, color: u.isActive ? 'var(--text)' : 'var(--text3)' }}>{u.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text3)' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <select 
                        value={u.role}
                        onChange={e => handleRoleChange(u._id, e.target.value)}
                        style={{ background: 'transparent', border: '1px solid var(--line2)', borderRadius: 4, color: 'var(--text2)', fontSize: 11, padding: '2px 4px' }}
                      >
                        <option value="seeker">Seeker</option>
                        <option value="contributor">Contributor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      {u.role === 'contributor' ? (
                        <div style={{ fontSize: 11, color: 'var(--text2)' }}>
                          <span title="Approved" style={{ color: 'var(--green)' }}>✓ {u.verifiedCount}</span>
                          {' '}<span title="Rejected" style={{ color: 'var(--red)' }}>✗ {u.rejectedCount || 0}</span>
                          {' '}<span title="Total Uploads" style={{ color: 'var(--cyan)' }}>↑ {u.solutionsCount}</span>
                        </div>
                      ) : (
                        <div style={{ fontSize: 11, color: 'var(--text3)' }}>{u.queriesCount || 0} queries</div>
                      )}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ 
                        display: 'inline-block', width: 8, height: 8, borderRadius: '50%', 
                        background: u.isActive ? 'var(--green)' : 'var(--red)',
                        marginRight: 6
                      }} />
                      <span style={{ fontSize: 11, color: u.isActive ? 'var(--text2)' : 'var(--red)' }}>
                        {u.isActive ? 'ACTIVE' : 'SUSPENDED'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => handleToggleActive(u._id)}
                          style={{ 
                            padding: '6px 10px', background: 'var(--surface2)', border: '1px solid var(--line)', 
                            borderRadius: 6, fontSize: 10, fontWeight: 700, color: 'var(--text)', cursor: 'pointer' 
                          }}
                        >
                          {u.isActive ? 'SUSPEND' : 'ACTIVATE'}
                        </button>
                        <button 
                          onClick={() => handleDelete(u._id)}
                          style={{ 
                            padding: '6px 10px', background: 'rgba(255,59,92,0.1)', border: '1px solid var(--red)', 
                            borderRadius: 6, fontSize: 10, fontWeight: 700, color: 'var(--red)', cursor: 'pointer' 
                          }}
                        >
                          DELETE
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
