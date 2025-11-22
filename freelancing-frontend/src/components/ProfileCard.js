"use client"

import { useState } from "react"
import { Card, Button, Badge } from "react-bootstrap"

const ProfileCard = ({ user, onEdit, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const getRoleBadge = (role) => {
    const variants = {
      admin: "danger",
      client: "primary",
      freelancer: "success",
    }
    return variants[role] || "secondary"
  }

  const getUserInitials = () => {
    if (user?.first_name) {
      return user.first_name[0] + (user.last_name?.[0] || "")
    }
    return user?.email?.[0] || "U"
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (!user) {
    return (
      <Card className={`shadow border-0 ${className}`}>
        <Card.Body className="text-center py-5">
          <div
            className="bg-light rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
            style={{ width: "80px", height: "80px" }}
          >
            <i className="fas fa-user text-muted" style={{ fontSize: "2rem" }}></i>
          </div>
          <h6 className="fw-medium mb-2">No Profile Data</h6>
          <p className="text-muted">User information not available</p>
        </Card.Body>
      </Card>
    )
  }

  return (
    <Card className={`shadow border-0 ${className}`}>
      <Card.Header className="bg-gradient bg-primary bg-opacity-10 border-bottom">
        <div className="d-flex align-items-center">
          <div className="bg-primary bg-opacity-25 rounded-circle p-2 me-3">
            <i className="fas fa-user text-primary"></i>
          </div>
          <h5 className="mb-0 fw-semibold">Profile Information</h5>
        </div>
      </Card.Header>

      <Card.Body className="p-4">
        <div className="text-center mb-4">
          <div
            className={`bg-${getRoleBadge(user.role)} text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center fw-bold`}
            style={{ width: "80px", height: "80px", fontSize: "1.5rem" }}
          >
            {getUserInitials()}
          </div>
          <h5 className="fw-bold mb-1">
            {user.first_name} {user.last_name}
          </h5>
          <p className="text-muted mb-2">{user.email}</p>
          <Badge bg={getRoleBadge(user.role)} className="mb-3">
            {user.role?.toUpperCase()}
          </Badge>
        </div>

        <div className="row g-3">
          <div className="col-12">
            <div className="d-flex align-items-center mb-2">
              <i className="fas fa-envelope text-muted me-2"></i>
              <span className="fw-medium me-2">Email:</span>
              <span className="text-muted">{user.email}</span>
            </div>
          </div>

          {user.phone && (
            <div className="col-12">
              <div className="d-flex align-items-center mb-2">
                <i className="fas fa-phone text-muted me-2"></i>
                <span className="fw-medium me-2">Phone:</span>
                <span className="text-muted">{user.phone}</span>
              </div>
            </div>
          )}

          {user.location && (
            <div className="col-12">
              <div className="d-flex align-items-center mb-2">
                <i className="fas fa-map-marker-alt text-muted me-2"></i>
                <span className="fw-medium me-2">Location:</span>
                <span className="text-muted">{user.location}</span>
              </div>
            </div>
          )}

          <div className="col-12">
            <div className="d-flex align-items-center mb-2">
              <i className="fas fa-calendar text-muted me-2"></i>
              <span className="fw-medium me-2">Joined:</span>
              <span className="text-muted">{formatDate(user.date_joined)}</span>
            </div>
          </div>

          {user.last_login && (
            <div className="col-12">
              <div className="d-flex align-items-center mb-2">
                <i className="fas fa-clock text-muted me-2"></i>
                <span className="fw-medium me-2">Last Login:</span>
                <span className="text-muted">{formatDate(user.last_login)}</span>
              </div>
            </div>
          )}

          <div className="col-12">
            <div className="d-flex align-items-center mb-2">
              <i className="fas fa-shield-alt text-muted me-2"></i>
              <span className="fw-medium me-2">Status:</span>
              <span className="text-muted">
                {user.is_active ? (
                  <Badge bg="success" className="small">
                    Active
                  </Badge>
                ) : (
                  <Badge bg="danger" className="small">
                    Inactive
                  </Badge>
                )}
              </span>
            </div>
          </div>

          {isExpanded && (
            <>
              {user.bio && (
                <div className="col-12">
                  <div className="mb-2">
                    <i className="fas fa-user-edit text-muted me-2"></i>
                    <span className="fw-medium me-2">Bio:</span>
                    <p className="text-muted mt-2 mb-0">{user.bio}</p>
                  </div>
                </div>
              )}

              {user.skills && (
                <div className="col-12">
                  <div className="mb-2">
                    <i className="fas fa-tools text-muted me-2"></i>
                    <span className="fw-medium me-2">Skills:</span>
                    <p className="text-muted mt-2 mb-0">{user.skills}</p>
                  </div>
                </div>
              )}

              {user.website && (
                <div className="col-12">
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-globe text-muted me-2"></i>
                    <span className="fw-medium me-2">Website:</span>
                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-primary">
                      {user.website}
                    </a>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="d-flex gap-2 mt-4">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-grow-1"
          >
            <i className={`fas ${isExpanded ? "fa-chevron-up" : "fa-chevron-down"} me-2`}></i>
            {isExpanded ? "Show Less" : "Show More"}
          </Button>
          {onEdit && (
            <Button variant="primary" size="sm" onClick={onEdit}>
              <i className="fas fa-edit me-2"></i>
              Edit Profile
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}

export default ProfileCard
