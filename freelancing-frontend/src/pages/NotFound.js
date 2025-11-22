"use client"

import { Card, Button, Container, Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom"

function NotFound() {
  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-4">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow-lg border-0">
              <Card.Body className="p-5 text-center">
                <div className="mb-4">
                  <div className="display-1 fw-bold text-primary mb-3">404</div>
                  <div
                    className="bg-gradient bg-primary mx-auto rounded-pill mb-4"
                    style={{ width: "100px", height: "4px" }}
                  ></div>
                </div>

                <h2 className="fw-bold text-dark mb-3">Page Not Found</h2>
                <p className="text-muted mb-4 lead">
                  Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the
                  wrong URL.
                </p>

                <div className="d-grid gap-2 mb-4">
                  <Link to="/" className="text-decoration-none">
                    <Button variant="primary" size="lg" className="w-100">
                      <i className="fas fa-home me-2"></i>
                      Go Home
                    </Button>
                  </Link>

                  <Button variant="outline-secondary" size="lg" onClick={() => window.history.back()} className="w-100">
                    <i className="fas fa-arrow-left me-2"></i>
                    Go Back
                  </Button>
                </div>

                <div className="pt-4 border-top">
                  <p className="text-muted mb-3 small">Need help finding something?</p>
                  <Link to="/search" className="text-decoration-none">
                    <Button variant="link" size="sm" className="text-primary">
                      <i className="fas fa-search me-2"></i>
                      Search Projects
                    </Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default NotFound
