"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../auth/AuthContext"
import {
  Card,
  Button,
  Badge,
  Alert,
  Table,
  Tabs,
  Tab,
  ProgressBar,
  Container,
  Row,
  Col,
  Modal,
  Spinner,
} from "react-bootstrap"

const AdminPanel = () => {
  const [users, setUsers] = useState([])
  const [projects, setProjects] = useState([])
  const [applications, setApplications] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const { axiosAuth } = useAuth()

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      const tokens = JSON.parse(localStorage.getItem("tokens"))
      const token = tokens ? tokens.access : null
      const headers = { Authorization: `Bearer ${token}` }

      const [usersRes, projectsRes, applicationsRes, statsRes] = await Promise.all([
        axiosAuth.get("http://localhost:8000/api/users/users/", { headers }),
        axiosAuth.get("http://localhost:8000/api/projects/", { headers }),
        axiosAuth.get("http://localhost:8000/api/applications/", { headers }),
        axiosAuth.get("http://localhost:8000/api/stats/admin/", { headers }),
      ])

      setUsers(usersRes.data)
      setProjects(projectsRes.data)
      setApplications(applicationsRes.data)
      setStats(statsRes.data)
    } catch (err) {
      setError("Failed to load admin data")
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (userId, action) => {
    try {
      const tokens = JSON.parse(localStorage.getItem("tokens"))
      const token = tokens ? tokens.access : null
      await axiosAuth.patch(
        `http://localhost:8000/api/admin/users/${userId}/`,
        {
          is_active: action === "activate",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      fetchAdminData()
    } catch (err) {
      setError("Failed to update user status")
    }
  }

  const handleProjectAction = async (projectId, action) => {
    try {
      const tokens = JSON.parse(localStorage.getItem("tokens"))
      const token = tokens ? tokens.access : null
      await axiosAuth.patch(
        `http://localhost:8000/api/admin/projects/${projectId}/`,
        {
          status: action === "approve" ? "open" : "cancelled",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      fetchAdminData()
    } catch (err) {
      setError("Failed to update project status")
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      active: "success",
      inactive: "danger",
      open: "success",
      in_progress: "warning",
      completed: "primary",
      cancelled: "danger",
      pending: "secondary",
      accepted: "success",
      rejected: "danger",
    }
    return <Badge bg={variants[status] || "secondary"}>{status.replace("_", " ").toUpperCase()}</Badge>
  }

  const getRoleBadge = (role) => {
    const variants = {
      admin: "danger",
      client: "primary",
      freelancer: "success",
    }
    return <Badge bg={variants[role] || "secondary"}>{role.toUpperCase()}</Badge>
  }

  const getUserInitials = (user) => {
    return user.first_name?.[0] || user.email?.[0] || "U"
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    )
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="display-5 fw-bold text-dark mb-2">Admin Panel</h1>
          <p className="text-muted">Manage users, projects, and platform analytics</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" size="sm">
            <i className="fas fa-cog me-2"></i>
            Settings
          </Button>
          <Button variant="outline-primary" size="sm">
            <i className="fas fa-chart-line me-2"></i>
            Reports
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="d-flex align-items-center mb-4">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={6} lg={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-25 rounded-circle p-3 me-3">
                  <i className="fas fa-users text-primary fs-4"></i>
                </div>
                <div>
                  <p className="text-muted mb-1 fw-medium small">Total Users</p>
                  <h3 className="mb-1 fw-bold text-primary">{stats.total_users || 0}</h3>
                  <small className="text-success">+{stats.new_users_this_month || 0} this month</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center">
                <div className="bg-success bg-opacity-25 rounded-circle p-3 me-3">
                  <i className="fas fa-folder-open text-success fs-4"></i>
                </div>
                <div>
                  <p className="text-muted mb-1 fw-medium small">Total Projects</p>
                  <h3 className="mb-1 fw-bold text-success">{stats.total_projects || 0}</h3>
                  <small className="text-success">+{stats.new_projects_this_month || 0} this month</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center">
                <div className="bg-warning bg-opacity-25 rounded-circle p-3 me-3">
                  <i className="fas fa-dollar-sign text-warning fs-4"></i>
                </div>
                <div>
                  <p className="text-muted mb-1 fw-medium small">Total Transactions</p>
                  <h3 className="mb-1 fw-bold text-warning">${stats.total_transactions || 0}</h3>
                  <small className="text-success">+{stats.transactions_this_month || 0} this month</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center">
                <div className="bg-danger bg-opacity-25 rounded-circle p-3 me-3">
                  <i className="fas fa-exclamation-triangle text-danger fs-4"></i>
                </div>
                <div>
                  <p className="text-muted mb-1 fw-medium small">Pending Approvals</p>
                  <h3 className="mb-1 fw-bold text-danger">{stats.pending_approvals || 0}</h3>
                  <small className="text-warning">Requires attention</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Remove static/hardcoded Overview tab and Quick Stats. Only show real data from API. */}

      {/* Navigation Tabs */}
      <Card className="shadow border-0">
        <Card.Header className="bg-light border-bottom-0">
          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="border-bottom-0">
            <Tab eventKey="overview" title="Overview" />
            <Tab eventKey="users" title="Users" />
            <Tab eventKey="projects" title="Projects" />
            <Tab eventKey="applications" title="Applications" />
            <Tab eventKey="analytics" title="Analytics" />
          </Tabs>
        </Card.Header>

        <Card.Body className="p-4">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <Row>
              <Col lg={8}>
                <h5 className="fw-semibold mb-4">Recent Activity</h5>
                <div className="d-flex flex-column gap-3">
                  <Card className="border">
                    <Card.Body className="p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-medium mb-0">New User Registration</h6>
                        <small className="text-muted">2 hours ago</small>
                      </div>
                      <p className="text-muted mb-0">John Doe registered as a freelancer</p>
                    </Card.Body>
                  </Card>
                  <Card className="border">
                    <Card.Body className="p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-medium mb-0">Project Posted</h6>
                        <small className="text-muted">4 hours ago</small>
                      </div>
                      <p className="text-muted mb-0">Web Development project posted by Client XYZ</p>
                    </Card.Body>
                  </Card>
                  <Card className="border">
                    <Card.Body className="p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-medium mb-0">Application Submitted</h6>
                        <small className="text-muted">6 hours ago</small>
                      </div>
                      <p className="text-muted mb-0">Freelancer ABC applied to Project 123</p>
                    </Card.Body>
                  </Card>
                </div>
              </Col>
              <Col lg={4}>
                <h5 className="fw-semibold mb-4">Quick Stats</h5>
                <div className="d-flex flex-column gap-3">
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-medium text-muted small">User Growth</span>
                      <span className="fw-semibold text-success small">75%</span>
                    </div>
                    <ProgressBar variant="success" now={75} style={{ height: "8px" }} />
                  </div>
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-medium text-muted small">Project Completion</span>
                      <span className="fw-semibold text-primary small">60%</span>
                    </div>
                    <ProgressBar variant="primary" now={60} style={{ height: "8px" }} />
                  </div>
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-medium text-muted small">Revenue Growth</span>
                      <span className="fw-semibold text-warning small">85%</span>
                    </div>
                    <ProgressBar variant="warning" now={85} style={{ height: "8px" }} />
                  </div>
                </div>
              </Col>
            </Row>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-semibold mb-0">User Management</h5>
                <div className="d-flex gap-2">
                  <Button variant="outline-primary" size="sm">
                    <i className="fas fa-download me-2"></i>
                    Export Users
                  </Button>
                  <Button variant="outline-success" size="sm">
                    <i className="fas fa-user-plus me-2"></i>
                    Add User
                  </Button>
                </div>
              </div>
              <Card className="border-0 shadow-sm">
                <Table responsive className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="fw-semibold">User</th>
                      <th className="fw-semibold">Email</th>
                      <th className="fw-semibold">Role</th>
                      <th className="fw-semibold">Status</th>
                      <th className="fw-semibold">Joined</th>
                      <th className="fw-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div
                              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                              style={{ width: "32px", height: "32px", fontSize: "14px" }}
                            >
                              {getUserInitials(user)}
                            </div>
                            <div>
                              <div className="fw-medium">
                                {user.first_name} {user.last_name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-muted">{user.email}</td>
                        <td>{getRoleBadge(user.role)}</td>
                        <td>{getStatusBadge(user.is_active ? "active" : "inactive")}</td>
                        <td className="text-muted">{new Date(user.date_joined).toLocaleDateString()}</td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user)
                                setShowUserModal(true)
                              }}
                            >
                              <i className="fas fa-eye"></i>
                            </Button>
                            {user.is_active ? (
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleUserAction(user.id, "deactivate")}
                              >
                                <i className="fas fa-times"></i>
                              </Button>
                            ) : (
                              <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() => handleUserAction(user.id, "activate")}
                              >
                                <i className="fas fa-check"></i>
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card>
            </>
          )}

          {/* Projects Tab */}
          {activeTab === "projects" && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-semibold mb-0">Project Management</h5>
                <Button variant="outline-primary" size="sm">
                  <i className="fas fa-download me-2"></i>
                  Export Projects
                </Button>
              </div>
              <Card className="border-0 shadow-sm">
                <Table responsive className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="fw-semibold">Project</th>
                      <th className="fw-semibold">Client</th>
                      <th className="fw-semibold">Budget</th>
                      <th className="fw-semibold">Status</th>
                      <th className="fw-semibold">Applications</th>
                      <th className="fw-semibold">Created</th>
                      <th className="fw-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.id}>
                        <td>
                          <div>
                            <div className="fw-medium">{project.title}</div>
                            <small className="text-muted">{project.description.substring(0, 50)}...</small>
                          </div>
                        </td>
                        <td className="text-muted">
                          {project.client.first_name} {project.client.last_name}
                        </td>
                        <td className="fw-semibold text-success">${project.budget}</td>
                        <td>{getStatusBadge(project.status)}</td>
                        <td>
                          <Badge bg="secondary">{project.application_count || 0}</Badge>
                        </td>
                        <td className="text-muted">{new Date(project.created_at).toLocaleDateString()}</td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => {
                                setSelectedProject(project)
                                setShowProjectModal(true)
                              }}
                            >
                              <i className="fas fa-eye"></i>
                            </Button>
                            {project.status === "pending" && (
                              <>
                                <Button
                                  variant="outline-success"
                                  size="sm"
                                  onClick={() => handleProjectAction(project.id, "approve")}
                                >
                                  <i className="fas fa-check"></i>
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleProjectAction(project.id, "reject")}
                                >
                                  <i className="fas fa-times"></i>
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card>
            </>
          )}

          {/* Applications Tab */}
          {activeTab === "applications" && (
            <>
              <h5 className="fw-semibold mb-4">Recent Applications</h5>
              <Card className="border-0 shadow-sm">
                <Table responsive className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="fw-semibold">Freelancer</th>
                      <th className="fw-semibold">Project</th>
                      <th className="fw-semibold">Proposed Budget</th>
                      <th className="fw-semibold">Status</th>
                      <th className="fw-semibold">Applied</th>
                      <th className="fw-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.slice(0, 10).map((app) => (
                      <tr key={app.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div
                              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                              style={{ width: "32px", height: "32px", fontSize: "14px" }}
                            >
                              {app.freelancer.first_name[0]}
                            </div>
                            <div>
                              <div className="fw-medium">
                                {app.freelancer.first_name} {app.freelancer.last_name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-muted">{app.project.title}</td>
                        <td className="fw-semibold text-success">${app.proposed_budget}</td>
                        <td>{getStatusBadge(app.status)}</td>
                        <td className="text-muted">{new Date(app.created_at).toLocaleDateString()}</td>
                        <td>
                          <Button variant="outline-primary" size="sm">
                            <i className="fas fa-eye"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card>
            </>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <Card className="border h-100">
                    <Card.Body className="text-center p-4">
                      <h5 className="fw-semibold mb-3">User Growth</h5>
                      <h2 className="fw-bold text-primary mb-2">{stats.user_growth_percentage || 0}%</h2>
                      <p className="text-muted mb-0">Monthly user growth rate</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border h-100">
                    <Card.Body className="text-center p-4">
                      <h5 className="fw-semibold mb-3">Revenue Analytics</h5>
                      <h2 className="fw-bold text-success mb-2">${stats.monthly_revenue || 0}</h2>
                      <p className="text-muted mb-0">Monthly revenue</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <div>
                <h5 className="fw-semibold mb-4">Platform Statistics</h5>
                <Row>
                  <Col md={6} lg={3} className="mb-3">
                    <Card className="border h-100">
                      <Card.Body className="text-center p-3">
                        <h4 className="fw-bold text-primary">{stats.total_clients || 0}</h4>
                        <p className="text-muted mb-0 small">Total Clients</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6} lg={3} className="mb-3">
                    <Card className="border h-100">
                      <Card.Body className="text-center p-3">
                        <h4 className="fw-bold text-success">{stats.total_freelancers || 0}</h4>
                        <p className="text-muted mb-0 small">Total Freelancers</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6} lg={3} className="mb-3">
                    <Card className="border h-100">
                      <Card.Body className="text-center p-3">
                        <h4 className="fw-bold text-warning">{stats.active_projects || 0}</h4>
                        <p className="text-muted mb-0 small">Active Projects</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6} lg={3} className="mb-3">
                    <Card className="border h-100">
                      <Card.Body className="text-center p-3">
                        <h4 className="fw-bold text-info">{stats.completed_projects || 0}</h4>
                        <p className="text-muted mb-0 small">Completed Projects</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
            </>
          )}
        </Card.Body>
      </Card>

      {/* User Details Modal */}
      <Modal show={showUserModal} onHide={() => setShowUserModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <Row>
              <Col md={6}>
                <h6 className="fw-semibold mb-3">Personal Information</h6>
                <div className="mb-3">
                  <strong>Name:</strong> {selectedUser.first_name} {selectedUser.last_name}
                </div>
                <div className="mb-3">
                  <i className="fas fa-envelope me-2 text-muted"></i>
                  <strong>Email:</strong> {selectedUser.email}
                </div>
                <div className="mb-3">
                  <i className="fas fa-shield-alt me-2 text-muted"></i>
                  <strong>Role:</strong> {getRoleBadge(selectedUser.role)}
                </div>
                <div className="mb-3">
                  <strong>Status:</strong> {getStatusBadge(selectedUser.is_active ? "active" : "inactive")}
                </div>
              </Col>
              <Col md={6}>
                <h6 className="fw-semibold mb-3">Account Information</h6>
                <div className="mb-3">
                  <i className="fas fa-calendar me-2 text-muted"></i>
                  <strong>Joined:</strong> {new Date(selectedUser.date_joined).toLocaleDateString()}
                </div>
                <div className="mb-3">
                  <strong>Last Login:</strong>{" "}
                  {selectedUser.last_login ? new Date(selectedUser.last_login).toLocaleDateString() : "Never"}
                </div>
                <div className="mb-3">
                  <i className="fas fa-phone me-2 text-muted"></i>
                  <strong>Phone:</strong> {selectedUser.phone || "Not provided"}
                </div>
                <div className="mb-3">
                  <i className="fas fa-map-marker-alt me-2 text-muted"></i>
                  <strong>Location:</strong> {selectedUser.location || "Not provided"}
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
      </Modal>

      {/* Project Details Modal */}
      <Modal show={showProjectModal} onHide={() => setShowProjectModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Project Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProject && (
            <Row>
              <Col md={8}>
                <h6 className="fw-semibold mb-3">Project Information</h6>
                <div className="mb-3">
                  <strong>Title:</strong>
                  <p className="text-muted mt-1">{selectedProject.title}</p>
                </div>
                <div className="mb-3">
                  <strong>Description:</strong>
                  <p className="text-muted mt-1">{selectedProject.description}</p>
                </div>
                <div className="mb-3">
                  <strong>Skills Required:</strong>
                  <p className="text-muted mt-1">{selectedProject.skills_required}</p>
                </div>
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong>Budget:</strong>
                      <p className="text-success fw-semibold mt-1">${selectedProject.budget}</p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong>Deadline:</strong>
                      <p className="text-muted mt-1">{new Date(selectedProject.deadline).toLocaleDateString()}</p>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col md={4}>
                <Card className="bg-light">
                  <Card.Body>
                    <h6 className="fw-semibold mb-3">Client Information</h6>
                    <div className="mb-2">
                      <strong>Name:</strong>
                      <p className="text-muted mb-1">
                        {selectedProject.client.first_name} {selectedProject.client.last_name}
                      </p>
                    </div>
                    <div className="mb-2">
                      <strong>Email:</strong>
                      <p className="text-muted mb-1">{selectedProject.client.email}</p>
                    </div>
                    <div className="mb-2">
                      <strong>Status:</strong>
                      <div className="mt-1">{getStatusBadge(selectedProject.status)}</div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  )
}

export default AdminPanel
