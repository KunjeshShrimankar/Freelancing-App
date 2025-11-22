"use client"

import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"
import { Navbar, Nav, NavDropdown, Badge, Container, Button } from "react-bootstrap"
import { useClientDashboardModal } from "../pages/ClientDashboardModalContext";

function NavigationBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation();
  const { setShowCreateModal } = useClientDashboardModal?.() || {};

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const getRoleColor = (role) => {
    const colors = {
      admin: "danger",
      client: "primary",
      freelancer: "success",
    }
    return colors[role] || "secondary"
  }

  const getUserInitials = () => {
    if (user?.first_name) {
      return user.first_name[0] + (user.last_name?.[0] || "")
    }
    return user?.email?.[0] || "U"
  }

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm border-bottom sticky-top">
      <Container fluid>
        <Navbar.Brand 
          href="#" 
          className="fw-bold fs-3 text-primary d-flex align-items-center"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
        >
          <i className="fas fa-handshake me-2"></i>
          FreelanceHub
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              href="#"
              className="fw-medium px-3 py-2 mx-1 rounded-pill nav-link-hover"
              onClick={(e) => {
                e.preventDefault();
                if (location.pathname === '/') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  navigate('/');
                }
              }}
            >
              <i className="fas fa-home me-1"></i>
              Home
            </Nav.Link>
            {/* Only show Features, About, Testimonials on home page, not in dashboards */}
            {!user || (user && !['/client', '/freelancer', '/admin'].includes(location.pathname)) ? (
              <>
                <Nav.Link 
                  href="#"
                  className="fw-medium px-3 py-2 mx-1 rounded-pill nav-link-hover"
                  onClick={(e) => {
                    e.preventDefault();
                    if (location.pathname === '/') {
                      const element = document.getElementById('features');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    } else {
                      navigate('/#features');
                    }
                  }}
                >
                  <i className="fas fa-star me-1"></i>
                  Features
                </Nav.Link>
                <Nav.Link 
                  href="#"
                  className="fw-medium px-3 py-2 mx-1 rounded-pill nav-link-hover"
                  onClick={(e) => {
                    e.preventDefault();
                    if (location.pathname === '/') {
                      const element = document.getElementById('about');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    } else {
                      navigate('/#about');
                    }
                  }}
                >
                  <i className="fas fa-info-circle me-1"></i>
                  About
                </Nav.Link>
                <Nav.Link 
                  href="#"
                  className="fw-medium px-3 py-2 mx-1 rounded-pill nav-link-hover"
                  onClick={(e) => {
                    e.preventDefault();
                    if (location.pathname === '/') {
                      const element = document.getElementById('testimonials');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    } else {
                      navigate('/#testimonials');
                    }
                  }}
                >
                  <i className="fas fa-quote-left me-1"></i>
                  Testimonials
                </Nav.Link>
              </>
            ) : null}
            {user && user.role !== 'freelancer' && (
              <>
                <Nav.Link as={Link} to="/freelancers" className="fw-medium px-3 py-2 mx-1 rounded-pill nav-link-hover">
                  <i className="fas fa-users me-1"></i>
                  Browse Freelancers
                </Nav.Link>
                {/* Post a Job: open modal only for clients on /client */}
                {user.role === 'client' && location.pathname === '/client' ? (
                  <Nav.Link
                    href="#"
                    className="fw-medium px-3 py-2 mx-1 rounded-pill nav-link-hover"
                    onClick={e => {
                      e.preventDefault();
                      if (setShowCreateModal) setShowCreateModal(true);
                    }}
                  >
                    <i className="fas fa-plus-circle me-1"></i>
                    Post a Job
                  </Nav.Link>
                ) : (
                  <Nav.Link href="#" className="fw-medium px-3 py-2 mx-1 rounded-pill nav-link-hover">
                    <i className="fas fa-plus-circle me-1"></i>
                    Post a Job
                  </Nav.Link>
                )}
              </>
            )}
          </Nav>
          <Nav className="ms-auto align-items-center">
            {!user ? (
              <>
                <Nav.Link as={Link} to="/login" className="fw-medium px-3 py-2 mx-1 text-primary nav-link-hover">
                  <i className="fas fa-sign-in-alt me-1"></i>
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/signup" className="ms-2">
                  <Button variant="primary" size="sm" className="fw-medium px-4 py-2 rounded-pill shadow-sm btn-hover">
                    <i className="fas fa-user-plus me-1"></i>
                    Sign Up
                  </Button>
                </Nav.Link>
              </>
            ) : (
              <>
                {/* Dashboard Links */}
                {user.role === "client" && (
                  <Nav.Link as={Link} to="/client" className="me-3">
                    <i className="fas fa-tachometer-alt me-2"></i>
                    Dashboard
                  </Nav.Link>
                )}
                {user.role === "freelancer" && (
                  <Nav.Link as={Link} to="/freelancer" className="me-3">
                    <i className="fas fa-tachometer-alt me-2"></i>
                    Dashboard
                  </Nav.Link>
                )}
                {user.role === "admin" && (
                  <Nav.Link as={Link} to="/admin" className="me-3">
                    <i className="fas fa-cog me-2"></i>
                    Admin Panel
                  </Nav.Link>
                )}

                {/* User Dropdown */}
                <NavDropdown
                  title={
                    <span className="d-flex align-items-center">
                      <div
                        className={`bg-${getRoleColor(user.role)} text-white rounded-circle d-flex align-items-center justify-content-center me-2`}
                        style={{ width: "32px", height: "32px", fontSize: "14px" }}
                      >
                        {getUserInitials()}
                      </div>
                      <span className="d-none d-md-inline">
                        {user.first_name} {user.last_name}
                      </span>
                    </span>
                  }
                  id="user-dropdown"
                  align="end"
                >
                  <div className="px-3 py-2 border-bottom">
                    <div className="fw-medium">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-muted small">{user.email}</div>
                    <Badge bg={getRoleColor(user.role)} className="mt-1">
                      {user.role}
                    </Badge>
                  </div>
                  <NavDropdown.Item onClick={handleLogout} className="text-danger">
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavigationBar
