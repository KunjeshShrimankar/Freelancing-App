"use client"

import { useState } from "react"
import { Card, Button, Badge } from "react-bootstrap"

const NotificationCard = ({ notifications = [], onMarkAllRead, onMarkAsRead }) => {
  const [expandedNotifications, setExpandedNotifications] = useState(new Set())

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <i className="fas fa-check-circle text-success"></i>
      case "warning":
        return <i className="fas fa-exclamation-triangle text-warning"></i>
      case "error":
        return <i className="fas fa-times-circle text-danger"></i>
      default:
        return <i className="fas fa-info-circle text-primary"></i>
    }
  }

  const getNotificationBadge = (type) => {
    const variants = {
      success: "success",
      warning: "warning",
      error: "danger",
      info: "primary",
    }
    return variants[type] || "secondary"
  }

  const getNotificationBackground = (type, isRead) => {
    if (isRead) return "bg-light"

    const backgrounds = {
      success: "bg-success bg-opacity-10 border-start border-success border-4",
      warning: "bg-warning bg-opacity-10 border-start border-warning border-4",
      error: "bg-danger bg-opacity-10 border-start border-danger border-4",
      info: "bg-primary bg-opacity-10 border-start border-primary border-4",
    }
    return backgrounds[type] || "bg-primary bg-opacity-10 border-start border-primary border-4"
  }

  const toggleExpanded = (index) => {
    const newExpanded = new Set(expandedNotifications)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedNotifications(newExpanded)
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const notificationTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  if (notifications.length === 0) {
    return (
      <Card className="shadow border-0">
        <Card.Header className="bg-gradient bg-primary bg-opacity-10 border-bottom">
          <div className="d-flex align-items-center">
            <div className="bg-primary bg-opacity-25 rounded-circle p-2 me-3">
              <i className="fas fa-bell text-primary"></i>
            </div>
            <h5 className="mb-0 fw-semibold">Notifications</h5>
          </div>
        </Card.Header>
        <Card.Body className="text-center py-5">
          <div className="d-flex flex-column align-items-center">
            <div className="bg-light rounded-circle p-4 mb-3">
              <i className="fas fa-bell-slash text-muted" style={{ fontSize: "2rem" }}></i>
            </div>
            <h6 className="fw-medium mb-2">No notifications yet</h6>
            <p className="text-muted">You're all caught up! New notifications will appear here.</p>
          </div>
        </Card.Body>
      </Card>
    )
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <Card className="shadow border-0">
      <Card.Header className="bg-gradient bg-primary bg-opacity-10 border-bottom">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <div className="bg-primary bg-opacity-25 rounded-circle p-2 me-3">
              <i className="fas fa-bell text-primary"></i>
            </div>
            <h5 className="mb-0 fw-semibold">Notifications</h5>
            {unreadCount > 0 && (
              <Badge bg="danger" className="ms-2">
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && onMarkAllRead && (
            <Button variant="outline-primary" size="sm" onClick={onMarkAllRead}>
              <i className="fas fa-check me-2"></i>
              Mark All Read
            </Button>
          )}
        </div>
      </Card.Header>
      <Card.Body className="p-0" style={{ maxHeight: "400px", overflowY: "auto" }}>
        {notifications.map((notification, index) => (
          <div
            key={index}
            className={`p-3 border-bottom ${getNotificationBackground(notification.type, notification.isRead)}`}
          >
            <div className="d-flex align-items-start">
              <div className="flex-shrink-0 mt-1 me-3">{getNotificationIcon(notification.type)}</div>
              <div className="flex-grow-1 min-w-0">
                <div className="d-flex align-items-start justify-content-between">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-1">
                      <h6 className={`mb-0 me-2 ${notification.isRead ? "text-muted" : "text-dark"}`}>
                        {notification.title}
                      </h6>
                      <Badge bg={getNotificationBadge(notification.type)} className="small">
                        {notification.type}
                      </Badge>
                    </div>
                    <p
                      className={`mb-2 ${notification.isRead ? "text-muted" : "text-dark"} ${
                        expandedNotifications.has(index) ? "" : "text-truncate"
                      }`}
                      style={{ maxHeight: expandedNotifications.has(index) ? "none" : "3rem", overflow: "hidden" }}
                    >
                      {notification.message}
                    </p>
                    <div className="d-flex align-items-center justify-content-between">
                      <small className="text-muted">{formatTimeAgo(notification.timestamp)}</small>
                      <div className="d-flex align-items-center">
                        {notification.message.length > 100 && (
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => toggleExpanded(index)}
                            className="p-0 me-2 text-primary small"
                          >
                            {expandedNotifications.has(index) ? "Show less" : "Show more"}
                          </Button>
                        )}
                        {!notification.isRead && onMarkAsRead && (
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => onMarkAsRead(index)}
                            className="p-0 text-success small"
                          >
                            <i className="fas fa-check"></i>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Card.Body>
    </Card>
  )
}

export default NotificationCard
