import { Card } from "react-bootstrap"

const StatsCard = ({
  title,
  value,
  icon,
  color = "primary",
  subtitle = "",
  trend = null,
  trendValue = "",
  className = "",
}) => {
  const getColorClasses = (color) => {
    const colors = {
      primary: {
        icon: "text-primary bg-primary bg-opacity-25",
        value: "text-primary",
        trend: "text-primary",
      },
      success: {
        icon: "text-success bg-success bg-opacity-25",
        value: "text-success",
        trend: "text-success",
      },
      warning: {
        icon: "text-warning bg-warning bg-opacity-25",
        value: "text-warning",
        trend: "text-warning",
      },
      danger: {
        icon: "text-danger bg-danger bg-opacity-25",
        value: "text-danger",
        trend: "text-danger",
      },
      info: {
        icon: "text-info bg-info bg-opacity-25",
        value: "text-info",
        trend: "text-info",
      },
      secondary: {
        icon: "text-secondary bg-secondary bg-opacity-25",
        value: "text-secondary",
        trend: "text-secondary",
      },
    }
    return colors[color] || colors.primary
  }

  const getTrendIcon = (trend) => {
    if (trend === "up") return <i className="fas fa-arrow-up"></i>
    if (trend === "down") return <i className="fas fa-arrow-down"></i>
    return null
  }

  const getTrendColor = (trend) => {
    if (trend === "up") return "text-success bg-success bg-opacity-10"
    if (trend === "down") return "text-danger bg-danger bg-opacity-10"
    return "text-muted bg-light"
  }

  const colorClasses = getColorClasses(color)

  return (
    <Card className={`h-100 border-0 shadow-sm ${className}`} style={{ transition: "all 0.3s ease" }}>
      <Card.Body className="p-4">
        <div className="d-flex align-items-center justify-content-between">
          <div className="flex-grow-1">
            <div className="d-flex align-items-center">
              {icon && (
                <div className={`rounded-circle p-3 me-3 ${colorClasses.icon}`}>
                  <i className={`${icon} fs-4`}></i>
                </div>
              )}
              <div>
                <p className="text-muted mb-1 fw-medium small">{title}</p>
                <h3 className={`mb-1 fw-bold ${colorClasses.value}`}>{value}</h3>
                {subtitle && <p className="text-muted mb-0 small">{subtitle}</p>}
              </div>
            </div>
          </div>

          {trend && trendValue && (
            <div className={`d-flex align-items-center px-2 py-1 rounded-pill small fw-medium ${getTrendColor(trend)}`}>
              {getTrendIcon(trend)}
              <span className="ms-1">{trendValue}</span>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}

export default StatsCard
