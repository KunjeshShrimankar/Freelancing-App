"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../auth/AuthContext"
import { Card, Row, Col, Button, Badge, Modal, Form, Alert, Table, Container, Spinner, Toast, ToastContainer } from "react-bootstrap"
import { useClientDashboardModal } from "./ClientDashboardModalContext";

const ClientDashboard = () => {
  const { showCreateModal, setShowCreateModal } = useClientDashboardModal();
  const [projects, setProjects] = useState([])
  const [applications, setApplications] = useState([])
  const [stats, setStats] = useState({})
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState("success")
  const [previousProjectStatuses, setPreviousProjectStatuses] = useState({})

  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    budget: "",
    skills_required: "",
    deadline: "",
  })

  const { axiosAuth } = useAuth()

  useEffect(() => {
    fetchDashboardData()
    
    // Set up auto-refresh every 30 seconds to check for status updates
    const interval = setInterval(() => {
      fetchDashboardData()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      const tokens = JSON.parse(localStorage.getItem("tokens"))
      const token = tokens ? tokens.access : null
      const headers = { Authorization: `Bearer ${token}` }

      const [projectsRes, applicationsRes, statsRes] = await Promise.all([
        axiosAuth.get("http://localhost:8000/api/projects/", { headers }),
        axiosAuth.get("http://localhost:8000/api/applications/", { headers }),
        axiosAuth.get("http://localhost:8000/api/stats/client/", { headers }),
      ])

                        setProjects(Array.isArray(projectsRes.data) ? projectsRes.data : projectsRes.data.results || [])
                  setApplications(Array.isArray(applicationsRes.data) ? applicationsRes.data : applicationsRes.data.results || [])
                  setStats(statsRes.data)
                  
                  console.log("Client stats received:", statsRes.data)
                  console.log("Projects received:", Array.isArray(projectsRes.data) ? projectsRes.data : projectsRes.data.results || [])
                  
                  // Check for project status changes and show notifications
                  const currentProjects = Array.isArray(projectsRes.data) ? projectsRes.data : projectsRes.data.results || []
                  currentProjects.forEach(project => {
                    const previousStatus = previousProjectStatuses[project.id]
                    if (previousStatus && previousStatus !== project.status) {
                      const statusMessages = {
                        'in_progress': '🚀 A freelancer has started working on your project!',
                        'completed': '✅ Your project has been marked as completed!'
                      }
                      if (statusMessages[project.status]) {
                        displayToast(`${statusMessages[project.status]} "${project.title}"`, "success")
                      }
                    }
                  })
                  
                  // Update previous statuses
                  const newStatuses = {}
                  currentProjects.forEach(project => {
                    newStatuses[project.id] = project.status
                  })
                  setPreviousProjectStatuses(newStatuses)
    } catch (err) {
      let errorMsg = "Failed to load dashboard data"
      if (err.response && err.response.data) {
        if (typeof err.response.data === "string") {
          errorMsg = err.response.data
        } else if (err.response.data.detail) {
          errorMsg = err.response.data.detail
        } else {
          errorMsg = JSON.stringify(err.response.data)
        }
      }
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (e) => {
    e.preventDefault()
    try {
      const tokens = JSON.parse(localStorage.getItem("tokens"))
      const token = tokens ? tokens.access : null
      let deadlineFormatted = newProject.deadline
      if (deadlineFormatted instanceof Date) {
        deadlineFormatted = deadlineFormatted.toISOString().split("T")[0]
      }
      const payload = {
        title: newProject.title,
        description: newProject.description,
        budget: newProject.budget,
        skills_required: newProject.skills_required,
        deadline: deadlineFormatted,
      }
      await axiosAuth.post("http://localhost:8000/api/projects/", payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setShowCreateModal(false)
      setNewProject({ title: "", description: "", budget: "", skills_required: "", deadline: "" })
      fetchDashboardData()
    } catch (err) {
      let errorMsg = "Failed to create project"
      if (err.response && err.response.data) {
        if (typeof err.response.data === "string") {
          errorMsg = err.response.data
        } else if (err.response.data.detail) {
          errorMsg = err.response.data.detail
        } else {
          errorMsg = JSON.stringify(err.response.data)
        }
      }
      setError(errorMsg)
    }
  }

  const handleViewProject = (project) => {
    setSelectedProject(project)
    setShowProjectModal(true)
  }

  const getStatusBadge = (status) => {
    const variants = {
      open: "success",
      in_progress: "warning",
      completed: "primary",
      cancelled: "danger",
    }
    return <Badge bg={variants[status] || "secondary"}>{status.replace("_", " ").toUpperCase()}</Badge>
  }

  const handleApplicationAction = async (appId, newStatus) => {
    try {
      const tokens = JSON.parse(localStorage.getItem("tokens"))
      const token = tokens ? tokens.access : null
      await axiosAuth.patch(
        `http://localhost:8000/api/applications/${appId}/`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      fetchDashboardData()
    } catch (err) {
      let errorMsg = "Failed to update application status"
      if (err.response && err.response.data) {
        if (typeof err.response.data === "string") {
          errorMsg = err.response.data
        } else if (err.response.data.detail) {
          errorMsg = err.response.data.detail
        } else {
          errorMsg = JSON.stringify(err.response.data)
        }
      }
      setError(errorMsg)
    }
  }

  const getUserInitials = (user) => {
    return user.first_name?.[0] || user.email?.[0] || "U"
  }

  const displayToast = (message, type = "success") => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
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
          <h1 className="display-5 fw-bold text-dark mb-2">Client Dashboard</h1>
          <p className="text-muted">Manage your projects and applications</p>
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
                  <p className="text-muted mb-1 fw-medium small">Total Projects</p>
                  <h3 className="mb-0 fw-bold text-primary">{stats.total_projects || 0}</h3>
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
                  <i className="fas fa-rupee-sign text-success fs-4"></i>
                </div>
                <div>
                  <p className="text-muted mb-1 fw-medium small">Total Budget</p>
                  <h3 className="mb-0 fw-bold text-success">₹{stats.total_budget || 0}</h3>
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
                  <i className="fas fa-clock text-warning fs-4"></i>
                </div>
                <div>
                  <p className="text-muted mb-1 fw-medium small">Active Projects</p>
                  <h3 className="mb-0 fw-bold text-warning">{stats.active_projects || 0}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center">
                <div className="bg-info bg-opacity-25 rounded-circle p-3 me-3">
                  <i className="fas fa-check-circle text-info fs-4"></i>
                </div>
                <div>
                  <p className="text-muted mb-1 fw-medium small">Completed</p>
                  <h3 className="mb-0 fw-bold text-info">{stats.completed_projects || 0}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Recent Projects */}
        <Col lg={8}>
          <Card className="shadow border-0">
            <Card.Header className="bg-light border-bottom">
              <h5 className="mb-0 fw-semibold">Recent Projects</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="fw-semibold">Project</th>
                    <th className="fw-semibold">Budget</th>
                    <th className="fw-semibold">Status</th>
                    <th className="fw-semibold">Applications</th>
                    <th className="fw-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.slice(0, 5).map((project) => (
                    <tr key={project.id}>
                      <td>
                        <div>
                          <div className="fw-medium">{project.title}</div>
                          <small className="text-muted">{project.description.substring(0, 50)}...</small>
                        </div>
                      </td>
                      <td className="fw-semibold text-success">₹{project.budget}</td>
                      <td>
                        <div className="d-flex flex-column">
                          {getStatusBadge(project.status)}
                          {project.status === 'in_progress' && (
                            <small className="text-warning mt-1">
                              <i className="fas fa-clock me-1"></i>
                              In Progress
                            </small>
                          )}
                          {project.status === 'completed' && (
                            <small className="text-success mt-1">
                              <i className="fas fa-check-circle me-1"></i>
                              Completed
                            </small>
                          )}
                        </div>
                      </td>
                      <td>
                        <Badge bg="secondary">
                          {applications.filter((app) => app.project.id === project.id).length}
                        </Badge>
                      </td>
                      <td>
                        <Button variant="outline-primary" size="sm" onClick={() => handleViewProject(project)}>
                          <i className="fas fa-eye"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Applications */}
        <Col lg={4}>
          <Card className="shadow border-0">
            <Card.Header className="bg-light border-bottom">
              <h5 className="mb-0 fw-semibold">Recent Applications</h5>
            </Card.Header>
            <Card.Body className="p-3">
              <div className="d-flex flex-column gap-3">
                {applications.slice(0, 3).map((app) => (
                  <div key={app.id} className="d-flex align-items-center p-3 bg-light rounded">
                    <div
                      className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3 fw-bold"
                      style={{ width: "40px", height: "40px", fontSize: "14px" }}
                    >
                      {getUserInitials(app.user)}
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <div className="fw-medium">
                        {app.user.first_name} {app.user.last_name}
                      </div>
                      <small className="text-muted d-block text-truncate">{app.project.title}</small>
                      <Badge bg="success" className="mt-1">
                        ₹{app.quote_amount}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Create Project Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateProject}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Project Title</Form.Label>
              <Form.Control
                type="text"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                placeholder="Enter project title"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Budget (₹)</Form.Label>
              <Form.Control
                type="number"
                value={newProject.budget}
                onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                placeholder="Enter project budget in INR"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                placeholder="Describe your project requirements"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Skills Required</Form.Label>
              <Form.Control
                type="text"
                value={newProject.skills_required}
                onChange={(e) => setNewProject({ ...newProject, skills_required: e.target.value })}
                placeholder="e.g., Python, React, UI/UX"
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium">Deadline</Form.Label>
              <Form.Control
                type="date"
                value={newProject.deadline}
                onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Create Project
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Project Details Modal */}
      <Modal show={showProjectModal} onHide={() => setShowProjectModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedProject?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {selectedProject && (
            <div>
              <Row>
                <Col md={8}>
                  <div className="mb-4">
                    <h6 className="fw-semibold mb-2">Description</h6>
                    <p className="text-muted">{selectedProject.description}</p>
                  </div>
                  <div className="mb-4">
                    <h6 className="fw-semibold mb-2">Skills Required</h6>
                    <p className="text-muted">{selectedProject.skills_required}</p>
                  </div>
                </Col>
                <Col md={4}>
                  <Card className="bg-light">
                    <Card.Body>
                      <h6 className="fw-semibold mb-3">Project Details</h6>
                      <div className="mb-2">
                        <i className="fas fa-rupee-sign text-success me-2"></i>
                        <span className="fw-medium">Budget:</span>
                        <span className="ms-2 text-success fw-semibold">₹{selectedProject.budget}</span>
                      </div>
                      <div className="mb-2">
                        <i className="fas fa-briefcase text-primary me-2"></i>
                        <span className="fw-medium">Status:</span>
                        <span className="ms-2">{getStatusBadge(selectedProject.status)}</span>
                        {selectedProject.status === 'in_progress' && (
                          <div className="mt-1">
                            <small className="text-warning">
                              <i className="fas fa-clock me-1"></i>
                              Freelancer is currently working on this project
                            </small>
                          </div>
                        )}
                        {selectedProject.status === 'completed' && (
                          <div className="mt-1">
                            <small className="text-success">
                              <i className="fas fa-check-circle me-1"></i>
                              Project has been completed by freelancer
                            </small>
                          </div>
                        )}
                      </div>
                      <div className="mb-2">
                        <i className="fas fa-calendar text-info me-2"></i>
                        <span className="fw-medium">Created:</span>
                        <span className="ms-2">{new Date(selectedProject.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="mb-2">
                        <i className="fas fa-clock text-warning me-2"></i>
                        <span className="fw-medium">Deadline:</span>
                        <span className="ms-2">{new Date(selectedProject.deadline).toLocaleDateString()}</span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <div className="mt-4">
                <h6 className="fw-semibold mb-3">
                  Applications ({applications.filter((app) => app.project.id === selectedProject.id).length})
                </h6>
                <div className="d-flex flex-column gap-3">
                  {applications
                    .filter((app) => app.project.id === selectedProject.id)
                    .map((app) => (
                      <Card key={app.id} className="border">
                        <Card.Body className="p-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div
                                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3 fw-bold"
                                style={{ width: "40px", height: "40px", fontSize: "14px" }}
                              >
                                {getUserInitials(app.user)}
                              </div>
                              <div>
                                <div className="fw-medium">
                                  {app.user.first_name} {app.user.last_name}
                                </div>
                                <small className="text-muted">{app.user.email}</small>
                                <div className="text-success fw-medium small">Proposed Budget: ₹{app.quote_amount}</div>
                              </div>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              {app.status === "accepted" ? (
                                <div className="d-flex flex-column align-items-end">
                                  <Badge bg="success">Accepted</Badge>
                                  {selectedProject.status === 'in_progress' && (
                                    <small className="text-warning mt-1">
                                      <i className="fas fa-clock me-1"></i>
                                      Working on project
                                    </small>
                                  )}
                                  {selectedProject.status === 'completed' && (
                                    <small className="text-success mt-1">
                                      <i className="fas fa-check-circle me-1"></i>
                                      Project completed
                                    </small>
                                  )}
                                </div>
                              ) : app.status === "rejected" ? (
                                <Badge bg="danger">Rejected</Badge>
                              ) : app.status === "pending" ? (
                                <div className="d-flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="success"
                                    onClick={() => handleApplicationAction(app.id, "accepted")}
                                  >
                                    Accept
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={() => handleApplicationAction(app.id, "rejected")}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              ) : (
                                <Badge bg="secondary">{app.status}</Badge>
                              )}
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    ))}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={5000} autohide>
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
            <small>Just now</small>
          </Toast.Header>
          <Toast.Body className={toastType === "success" ? "text-success" : "text-danger"}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  )
}

export default ClientDashboard
