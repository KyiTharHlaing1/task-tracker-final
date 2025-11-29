import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    due_date: ''
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
      return;
    }

    try {
      const parsed = JSON.parse(userData);
      if (!parsed) throw new Error('No user data');
      setUser(parsed);
    } catch (e) {
      // bad/malformed user in localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
      return;
    }
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const tasksData = await response.json();
        setTasks(tasksData);
      } else if (response.status === 401) {
        // Token invalid, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const url = editingTask ? `/api/tasks/${editingTask.id}` : '/api/tasks';
      const method = editingTask ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowForm(false);
        setEditingTask(null);
        setFormData({
          title: '',
          description: '',
          status: 'pending',
          priority: 'medium',
          due_date: ''
        });
        fetchTasks();
      }
    } catch (error) {
      console.error('Operation failed:', error);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      due_date: task.due_date || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'Pending',
      in_progress: 'In Progress',
      completed: 'Completed'
    };
    return statusMap[status] || status;
  };

  const getPriorityText = (priority) => {
    const priorityMap = {
      low: 'Low',
      medium: 'Medium',
      high: 'High'
    };
    return priorityMap[priority] || priority;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#e17055',
      in_progress: '#fdcb6e',
      completed: '#00b894'
    };
    return colors[status] || '#636e72';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#00b894',
      medium: '#fdcb6e',
      high: '#e17055'
    };
    return colors[priority] || '#636e72';
  };

  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f6fa',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white',
        padding: '20px 30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ 
            margin: 0, 
            color: '#2d3436',
            fontSize: '28px'
          }}>
            Task Management System
          </h1>
          <p style={{ 
            margin: '5px 0 0 0', 
            color: '#636e72',
            fontSize: '16px'
          }}>
            Efficiently manage your daily tasks
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ color: '#2d3436', fontSize: '16px' }}>
            Welcome, <strong>{user.name || user.email || 'User'}</strong>
          </span>
          <button 
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              backgroundColor: '#e17055',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto'
      }}>
        {/* Tasks Section */}
        <div style={{ 
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '25px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{ 
              margin: 0, 
              color: '#2d3436',
              fontSize: '24px'
            }}>
              My Tasks
            </h2>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingTask(null);
                setFormData({
                  title: '',
                  description: '',
                  status: 'pending',
                  priority: 'medium',
                  due_date: ''
                });
              }}
              style={{
                padding: '12px 25px',
                backgroundColor: '#0984e3',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>+</span> Add New Task
            </button>
          </div>

          {loading ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              color: '#636e72'
            }}>
              <p style={{ fontSize: '18px' }}>Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              color: '#636e72',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '2px dashed #b2bec3'
            }}>
              <p style={{ fontSize: '18px', marginBottom: '15px' }}>No tasks yet</p>
              <p style={{ fontSize: '16px', color: '#0984e3' }}>Click "Add New Task" to create your first task</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {tasks.map(task => (
                <div key={task.id} style={{
                  border: '1px solid #e0e0e0',
                  padding: '25px',
                  borderRadius: '10px',
                  backgroundColor: '#f8f9fa',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    gap: '20px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        margin: '0 0 15px 0', 
                        color: '#2d3436',
                        fontSize: '20px',
                        fontWeight: '600'
                      }}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p style={{ 
                          margin: '0 0 20px 0', 
                          color: '#636e72',
                          lineHeight: '1.6',
                          fontSize: '16px'
                        }}>
                          {task.description}
                        </p>
                      )}
                      <div style={{ 
                        display: 'flex', 
                        gap: '25px', 
                        alignItems: 'center', 
                        fontSize: '15px',
                        flexWrap: 'wrap'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: '#636e72', fontWeight: '500' }}>Status:</span>
                          <span style={{
                            padding: '6px 12px',
                            backgroundColor: getStatusColor(task.status),
                            color: 'white',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: 'bold'
                          }}>
                            {getStatusText(task.status)}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: '#636e72', fontWeight: '500' }}>Priority:</span>
                          <span style={{
                            padding: '6px 12px',
                            backgroundColor: getPriorityColor(task.priority),
                            color: 'white',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: 'bold'
                          }}>
                            {getPriorityText(task.priority)}
                          </span>
                        </div>
                        {task.due_date && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#636e72', fontWeight: '500' }}>Due Date:</span>
                            <span style={{ 
                              fontWeight: 'bold',
                              color: '#2d3436'
                            }}>
                              {task.due_date}
                            </span>
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: '#636e72', fontWeight: '500' }}>Created:</span>
                          <span>{new Date(task.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      gap: '12px',
                      flexShrink: 0
                    }}>
                      <button
                        onClick={() => handleEdit(task)}
                        style={{
                          padding: '10px 16px',
                          backgroundColor: '#fdcb6e',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          minWidth: '70px'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        style={{
                          padding: '10px 16px',
                          backgroundColor: '#e17055',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          minWidth: '70px'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task Form Modal */}
      {showForm && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '35px',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '550px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{ 
              margin: '0 0 25px 0', 
              color: '#2d3436',
              fontSize: '24px',
              textAlign: 'center'
            }}>
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'bold',
                  color: '#2d3436',
                  fontSize: '16px'
                }}>
                  Task Title:
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Enter task title"
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'bold',
                  color: '#2d3436',
                  fontSize: '16px'
                }}>
                  Task Description:
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '16px',
                    height: '120px',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Enter task description (optional)"
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'bold',
                  color: '#2d3436',
                  fontSize: '16px'
                }}>
                  Status:
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'bold',
                  color: '#2d3436',
                  fontSize: '16px'
                }}>
                  Priority:
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '30px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'bold',
                  color: '#2d3436',
                  fontSize: '16px'
                }}>
                  Due Date:
                </label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <button 
                  type="submit" 
                  style={{ 
                    padding: '14px 25px', 
                    backgroundColor: '#00b894', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '6px', 
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    flex: 1
                  }}
                >
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)} 
                  style={{ 
                    padding: '14px 25px', 
                    backgroundColor: '#636e72', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '6px', 
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    flex: 1
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}