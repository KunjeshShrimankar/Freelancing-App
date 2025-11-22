import React, { useEffect, useState } from "react";
import { Card, Row, Col, Container, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

const BrowseFreelancers = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFreelancers = async () => {
      setLoading(true);
      setError("");
      try {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        const token = tokens ? tokens.access : null;
        const res = await axios.get(
          "http://localhost:8000/api/freelancers/applied_to_me/",
          token ? { headers: { Authorization: `Bearer ${token}` } } : {}
        );
        setFreelancers(res.data);
      } catch (err) {
        setError("Failed to load freelancers");
      } finally {
        setLoading(false);
      }
    };
    fetchFreelancers();
  }, []);

  return (
    <Container className="py-5">
      <h1 className="mb-4 fw-bold text-primary">Browse Freelancers</h1>
      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="g-4">
        {freelancers.map((freelancer) => (
          <Col key={freelancer.id} md={6} lg={4} xl={3}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body className="text-center">
                <div className="mb-3">
                  <img
                    src={freelancer.profile_picture || "https://ui-avatars.com/api/?name=" + encodeURIComponent(freelancer.first_name + ' ' + freelancer.last_name)}
                    alt={freelancer.first_name + " " + freelancer.last_name}
                    className="rounded-circle shadow"
                    style={{ width: 80, height: 80, objectFit: "cover" }}
                  />
                </div>
                <h5 className="fw-bold mb-1">
                  {freelancer.first_name} {freelancer.last_name}
                </h5>
                <div className="text-muted mb-2" style={{ fontSize: 14 }}>{freelancer.email}</div>
                <div className="mb-2">
                  <span className="badge bg-success">Freelancer</span>
                </div>
                <p className="text-muted small mb-0" style={{ minHeight: 40 }}>
                  {freelancer.bio || "No bio provided."}
                </p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {!loading && freelancers.length === 0 && !error && (
        <div className="text-center text-muted py-5">No freelancers found.</div>
      )}
    </Container>
  );
};

export default BrowseFreelancers;