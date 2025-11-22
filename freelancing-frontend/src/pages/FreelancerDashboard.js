"use client"

import { useState, useEffect } from "react"
import {
  Card,
  Row,
  Col,
  Button,
  Badge,
  Modal,
  Form,
  Alert,
  InputGroup,
  Table,
  Spinner,
  Toast,
  ToastContainer,
  Container,
} from "react-bootstrap"
import { useAuth } from "../auth/AuthContext"

const FreelancerDashboard = () => {
  const [projects, setProjects] = useState([])
  const [myApplications, setMyApplications] = useState([])
  const [stats, setStats] = useState({})
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterBudget, setFilterBudget] = useState("all")
  const [filterSkills, setFilterSkills] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState("success")
  const [generatingAI, setGeneratingAI] = useState(false)
  const [acceptedApplications, setAcceptedApplications] = useState([])

  const [application, setApplication] = useState({
    proposed_budget: "",
    cover_letter: "",
    estimated_duration: "",
  })

  const [formErrors, setFormErrors] = useState({})
  const { axiosAuth } = useAuth()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const tokens = JSON.parse(localStorage.getItem("tokens"))
      const token = tokens ? tokens.access : null
      const headers = { Authorization: `Bearer ${token}` }

      const [projectsRes, applicationsRes, statsRes] = await Promise.all([
        axiosAuth.get("http://localhost:8000/api/projects/search/", { headers }),
        axiosAuth.get("http://localhost:8000/api/applications/", { headers }),
        axiosAuth.get("http://localhost:8000/api/stats/freelancer/", { headers }),
      ])

      setProjects(projectsRes.data.results || projectsRes.data)
      setMyApplications(Array.isArray(applicationsRes.data) ? applicationsRes.data : applicationsRes.data.results || [])
      
      console.log("Freelancer projects:", projectsRes.data.results || projectsRes.data)
      console.log("Freelancer applications:", Array.isArray(applicationsRes.data) ? applicationsRes.data : applicationsRes.data.results || [])
      setStats(statsRes.data)
      
      // Check for newly accepted applications and show notifications
      const newAcceptedApps = Array.isArray(applicationsRes.data) ? applicationsRes.data : applicationsRes.data.results || []
      const acceptedApps = newAcceptedApps.filter(app => app.status === 'accepted')
      
      // Show notification for newly accepted applications
      acceptedApps.forEach(app => {
        const wasPreviouslyAccepted = acceptedApplications.find(prevApp => 
          prevApp.id === app.id && prevApp.status === 'accepted'
        )
        if (!wasPreviouslyAccepted) {
          displayToast(`🎉 Congratulations! Your application for "${app.project.title}" has been accepted!`, "success")
        }
      })
      setAcceptedApplications(acceptedApps)
    } catch (err) {
      setError("Failed to load dashboard data")
      displayToast("Failed to load dashboard data", "danger")
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!application.proposed_budget || application.proposed_budget <= 0) {
      errors.proposed_budget = "Please enter a valid proposed budget"
    }

    if (!application.cover_letter || application.cover_letter.trim().length === 0) {
      errors.cover_letter = "Cover letter is required"
    }

    if (!application.estimated_duration || application.estimated_duration <= 0) {
      errors.estimated_duration = "Please enter a valid estimated duration"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleApply = async (projectId) => {
    if (!validateForm()) {
      displayToast("Please fix the form errors before submitting", "warning")
      return
    }

    try {
      const tokens = JSON.parse(localStorage.getItem("tokens"))
      const token = tokens ? tokens.access : null
      await axiosAuth.post(
        "http://localhost:8000/api/applications/",
        {
          project_id: projectId,
          message: application.cover_letter,
          quote_amount: application.proposed_budget,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      setShowProjectModal(false)
      setApplication({ proposed_budget: "", cover_letter: "", estimated_duration: "" })
      setFormErrors({})
      fetchDashboardData()
      displayToast("Application submitted successfully!", "success")
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to submit application"
      displayToast(errorMsg, "danger")
    }
  }

  const generateAIProposal = async () => {
    if (!selectedProject) return

    setGeneratingAI(true)
    try {
      const tokens = JSON.parse(localStorage.getItem("tokens"))
      const token = tokens ? tokens.access : null
      const response = await axiosAuth.post(
        "http://localhost:8000/api/ai/generate-proposal/",
        {
          project_id: selectedProject.id,
          project_title: selectedProject.title,
          project_description: selectedProject.description,
          skills_required: selectedProject.skills_required,
          budget: selectedProject.budget,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      const aiProposal = response.data.proposal
      setApplication((prev) => ({
        ...prev,
        cover_letter: aiProposal,
        proposed_budget: selectedProject.budget,
        estimated_duration: "14",
      }))
      displayToast("AI proposal generated successfully!", "success")
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to generate AI proposal"
      displayToast(errorMsg, "danger")
    } finally {
      setGeneratingAI(false)
    }
  }

  const handleViewProject = (project) => {
    setSelectedProject(project)
    setShowProjectModal(true)
    setApplication({ proposed_budget: "", cover_letter: "", estimated_duration: "" })
    setFormErrors({})
  }

  const displayToast = (message, type = "success") => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  const handleStatusUpdate = async (projectId, newStatus) => {
    try {
      const tokens = JSON.parse(localStorage.getItem("tokens"))
      const token = tokens ? tokens.access : null
      
      console.log("Updating project status:", { projectId, newStatus, token })
      
      const response = await axiosAuth.post(
        "http://localhost:8000/api/projects/update-project-status/",
        {
          project_id: projectId,
          status: newStatus
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      
      console.log("Status update response:", response.data)
      displayToast(`Project status updated to ${newStatus}`, "success")
      fetchDashboardData() // Refresh data
    } catch (err) {
      console.error("Status update error:", err)
      let errorMsg = "Failed to update project status"
      if (err.response && err.response.data) {
        if (typeof err.response.data === "string") {
          errorMsg = err.response.data
        } else if (err.response.data.detail) {
          errorMsg = err.response.data.detail
        } else {
          errorMsg = JSON.stringify(err.response.data)
        }
      }
      displayToast(errorMsg, "danger")
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      open: "success",
      in_progress: "warning",
      completed: "info",
      cancelled: "danger",
      pending: "secondary",
      accepted: "success",
      rejected: "danger",
    }
    return <Badge bg={variants[status] || "secondary"}>{status.replace("_", " ").toUpperCase()}</Badge>
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      (project.title && project.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (project.skills_required && project.skills_required.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = filterStatus === "all" || project.status === filterStatus

    const matchesBudget =
      filterBudget === "all" ||
      (filterBudget === "low" && project.budget <= 500) ||
      (filterBudget === "medium" && project.budget > 500 && project.budget <= 2000) ||
      (filterBudget === "high" && project.budget > 2000)

    const matchesSkills =
      !filterSkills ||
      (project.skills_required && project.skills_required.toLowerCase().includes(filterSkills.toLowerCase()))

    return matchesSearch && matchesStatus && matchesBudget && matchesSkills
  })

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.created_at) - new Date(a.created_at)
      case "oldest":
        return new Date(a.created_at) - new Date(b.created_at)
      case "budget_high":
        return b.budget - a.budget
      case "budget_low":
        return a.budget - b.budget
      default:
        return 0
    }
  })

  const clearFilters = () => {
    setSearchTerm("")
    setFilterStatus("all")
    setFilterBudget("all")
    setFilterSkills("")
    setSortBy("newest")
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    )
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="display-6 fw-bold mb-2">Freelancer Dashboard</h2>
          <p className="text-muted">Find and apply to exciting projects</p>
        </div>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Enhanced Search and Filter Section */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row>
            <Col lg={4} className="mb-3">
              <Form.Group>
                <Form.Label className="fw-medium">Search Projects</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-search"></i>
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search by title, description, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col lg={2} className="mb-3">
              <Form.Group>
                <Form.Label className="fw-medium">Status</Form.Label>
                <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col lg={2} className="mb-3">
              <Form.Group>
                <Form.Label className="fw-medium">Budget Range</Form.Label>
                <Form.Select value={filterBudget} onChange={(e) => setFilterBudget(e.target.value)}>
                  <option value="all">All Budgets</option>
                  <option value="low">Low (₹0-₹40,000)</option>
                  <option value="medium">Medium (₹40,001-₹1,60,000)</option>
                  <option value="high">High (₹1,60,000+)</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col lg={2} className="mb-3">
              <Form.Group>
                <Form.Label className="fw-medium">Skills</Form.Label>
                <Form.Control
                  placeholder="Filter by skills..."
                  value={filterSkills}
                  onChange={(e) => setFilterSkills(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col lg={2} className="mb-3">
              <Form.Group>
                <Form.Label className="fw-medium">Sort By</Form.Label>
                <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="budget_high">Highest Budget</option>
                  <option value="budget_low">Lowest Budget</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <div className="mt-3">
            <small className="text-muted">
              Showing {sortedProjects.length} of {projects.length} projects
              {searchTerm && ` matching "${searchTerm}"`}
            </small>
          </div>
        </Card.Body>
      </Card>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={6} lg={3} className="mb-3">
          <Card className="text-center h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
              <i className="fas fa-money-bill-wave text-success mb-3" style={{ fontSize: "2rem" }}></i>
              <h4 className="text-success fw-bold">₹{stats.total_earnings || 0}</h4>
              <p className="text-muted mb-0">Total Earnings</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <Card className="text-center h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
              <i className="fas fa-briefcase text-primary mb-3" style={{ fontSize: "2rem" }}></i>
              <h4 className="text-primary fw-bold">{stats.completed_projects || 0}</h4>
              <p className="text-muted mb-0">Completed Projects</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <Card className="text-center h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
              <i className="fas fa-clock text-warning mb-3" style={{ fontSize: "2rem" }}></i>
              <h4 className="text-warning fw-bold">{stats.active_projects || 0}</h4>
              <p className="text-muted mb-0">Active Projects</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <Card className="text-center h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
              <i className="fas fa-star text-info mb-3" style={{ fontSize: "2rem" }}></i>
              <h4 className="text-info fw-bold">{stats.total_applications || 0}</h4>
              <p className="text-muted mb-0">Applications Sent</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>



      <Row>
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0 fw-semibold">Available Projects ({sortedProjects.length})</h5>
            </Card.Header>
            <Card.Body className="p-0">
              {sortedProjects.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-search text-muted mb-3" style={{ fontSize: "3rem" }}></i>
                  <h6 className="text-muted">No projects found</h6>
                  <p className="text-muted">Try adjusting your search criteria or filters</p>
                  <Button variant="outline-primary" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                </div>
              ) : (
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
                    {sortedProjects.map((project) => (
                      <tr key={project.id}>
                        <td>
                          <div>
                            <div className="fw-medium">{project.title}</div>
                            <small className="text-muted">{project.description.substring(0, 50)}...</small>
                          </div>
                        </td>
                        <td className="fw-semibold text-success">₹{project.budget}</td>
                        <td>{getStatusBadge(project.status)}</td>
                        <td>
                          <Badge bg="secondary">{project.application_count || 0}</Badge>
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
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0 fw-semibold">My Applications</h5>
            </Card.Header>
            <Card.Body>
              {myApplications.length === 0 ? (
                <div className="text-center py-3">
                  <i className="fas fa-paper-plane text-muted mb-2" style={{ fontSize: "1.5rem" }}></i>
                  <p className="text-muted mb-0">No applications yet</p>
                </div>
              ) : (
                myApplications.slice(0, 5).map((app) => (
                  <div key={app.id} className="d-flex align-items-center mb-3 p-3 bg-light rounded">
                    <div className="flex-shrink-0">
                      <div
                        className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                        style={{ width: 40, height: 40 }}
                      >
                        {app.project.title[0]}
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="mb-1 fw-medium">{app.project.title}</h6>
                      <small className="text-muted d-block">₹{app.quote_amount || app.proposed_budget}</small>
                      <div className="d-flex align-items-center gap-2 mt-1">
                        {app.status === "accepted" ? (
                          <Badge bg="success">Accepted</Badge>
                        ) : app.status === "rejected" ? (
                          <Badge bg="danger">Rejected</Badge>
                        ) : app.status === "pending" ? (
                          <Badge bg="secondary">Pending</Badge>
                        ) : (
                          <Badge bg="secondary">{app.status}</Badge>
                        )}
                        
                        {/* Status Update Buttons for Accepted Applications */}
                        {app.status === "accepted" && (
                          <div className="ms-auto">
                            {console.log("Project status:", app.project.status, "Project ID:", app.project.id)}
                            {app.project.status === "open" && (
                              <Button
                                size="sm"
                                variant="warning"
                                onClick={() => handleStatusUpdate(app.project.id, "in_progress")}
                                className="me-1"
                              >
                                <i className="fas fa-play me-1"></i>
                                Start Work
                              </Button>
                            )}
                            {app.project.status === "in_progress" && (
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() => handleStatusUpdate(app.project.id, "completed")}
                              >
                                <i className="fas fa-check me-1"></i>
                                Mark Complete
                              </Button>
                            )}
                            {app.project.status === "completed" && (
                              <Badge bg="success">Completed</Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Enhanced Project Details Modal */}
      <Modal show={showProjectModal} onHide={() => setShowProjectModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedProject?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProject && (
            <div>
              <Row>
                <Col md={8}>
                  <h6 className="fw-semibold mb-3">Description</h6>
                  <p className="mb-4">{selectedProject.description}</p>

                  <h6 className="fw-semibold mb-3">Skills Required</h6>
                  <p className="mb-4">{selectedProject.skills_required || 'No specific skills mentioned'}</p>

                  <h6 className="fw-semibold mb-3">Project Details</h6>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <strong>Budget:</strong> <span className="text-success">₹{selectedProject.budget}</span>
                    </li>
                    <li className="mb-2">
                      <strong>Deadline:</strong> {new Date(selectedProject.deadline).toLocaleDateString()}
                    </li>
                    <li className="mb-2">
                      <strong>Posted:</strong> {new Date(selectedProject.created_at).toLocaleDateString()}
                    </li>
                    <li className="mb-2">
                      <strong>Status:</strong> {getStatusBadge(selectedProject.status)}
                    </li>
                  </ul>
                </Col>
                <Col md={4}>
                  <Card className="bg-light">
                    <Card.Body>
                      <h6 className="fw-semibold mb-3">Client Information</h6>
                      <p className="mb-2">
                        <strong>Name:</strong> {selectedProject.client.first_name} {selectedProject.client.last_name}
                      </p>
                      <p className="mb-2">
                        <strong>Email:</strong> {selectedProject.client.email}
                      </p>
                      <p className="mb-0">
                        <strong>Projects Posted:</strong> {selectedProject.client.project_count || 0}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <hr />

              <h6 className="fw-semibold mb-3">Submit Application</h6>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-medium">Application Form</span>
                <Button variant="outline-primary" size="sm" onClick={generateAIProposal} disabled={generatingAI}>
                  {generatingAI ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-magic me-2"></i>
                      Generate with AI
                    </>
                  )}
                </Button>
              </div>

              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">Proposed Budget (₹)</Form.Label>
                      <Form.Control
                        type="number"
                        value={application.proposed_budget}
                        onChange={(e) => setApplication({ ...application, proposed_budget: e.target.value })}
                        placeholder="Enter your proposed budget in INR"
                        isInvalid={!!formErrors.proposed_budget}
                      />
                      <Form.Control.Feedback type="invalid">{formErrors.proposed_budget}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">Estimated Duration (days)</Form.Label>
                      <Form.Control
                        type="number"
                        value={application.estimated_duration}
                        onChange={(e) => setApplication({ ...application, estimated_duration: e.target.value })}
                        placeholder="Estimated days to complete"
                        isInvalid={!!formErrors.estimated_duration}
                      />
                      <Form.Control.Feedback type="invalid">{formErrors.estimated_duration}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium">Cover Letter</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    value={application.cover_letter}
                    onChange={(e) => setApplication({ ...application, cover_letter: e.target.value })}
                    placeholder="Explain why you're the best fit for this project..."
                    isInvalid={!!formErrors.cover_letter}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.cover_letter}</Form.Control.Feedback>
                </Form.Group>
              </Form>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProjectModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => handleApply(selectedProject.id)}
            disabled={Object.keys(formErrors).length > 0}
          >
            <i className="fas fa-paper-plane me-2"></i>
            Submit Application
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={5000} autohide>
          <Toast.Header>
            <strong className="me-auto">
              {toastType === "success" && <i className="fas fa-check text-success me-2"></i>}
              {toastType === "danger" && <i className="fas fa-times text-danger me-2"></i>}
              {toastType === "warning" && <i className="fas fa-exclamation-triangle text-warning me-2"></i>}
              Notification
            </strong>
          </Toast.Header>
          <Toast.Body className={toastType === "danger" ? "text-danger" : ""}>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  )
}

export default FreelancerDashboard
