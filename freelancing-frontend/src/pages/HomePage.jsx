import React from 'react';
import { Link } from "react-router-dom"
import { Container, Row, Col, Button, Card, Carousel, Badge } from "react-bootstrap"

import bannerImage from '../assets/background 2.jpeg'
import { useAuth } from "../auth/AuthContext"
import homepage from '../assets/mainpage.jpeg'
import aiimage from '../assets/ai.png'
import mobileimage from '../assets/mobile.jpeg'
import oppertunity from '../assets/oppertunity.avif'
import security from '../assets/security.jpeg'
import logo from '../assets/logo.webp'


function HomePage() {
  const { user } = useAuth();
  return (
    <div className="homepage">

      {/* Fixed Hero Section with Background Image */}
      <section className="hero-section position-fixed" style={{ 
        height: '100vh', 
        width: '100%',
        top: 0,
        left: 0,
        zIndex: 1,
        overflow: 'hidden'
      }}>
        {/* Background Image with <img> tag */}
        <img
          src={bannerImage}
          alt="Hero Background"
          className="position-absolute w-100 h-100 object-fit-cover"
          style={{
            top: 0,
            left: 0,
            zIndex: 0,
          }}
        />

        {/* Dark overlay */}
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-75" style={{ zIndex: 1 }}></div>

        {/* Foreground content */}
        <Container className="position-relative h-100 d-flex align-items-center" style={{ zIndex: 2 }}>
          <Row className="align-items-center w-100">
            <Col lg={6} className="text-center text-lg-start text-white">
              <h1 className="display-2 fw-bold mb-4 text-shadow animate-slide-up">
                Find the Perfect Freelancer for Your Project
              </h1>
              <p className="lead mb-4 fs-4 text-light animate-slide-up" style={{ animationDelay: '0.2s' }}>
                Connect with talented professionals worldwide. Post jobs, find work, and grow your business with our
                trusted freelancing platform.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start mb-5 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <Button
                  as={Link}
                  to="/signup"
                  variant="primary"
                  size="lg"
                  className="fw-semibold px-5 py-3 shadow-lg btn-hover"
                  style={{ borderRadius: '50px' }}
                >
                  <i className="fas fa-briefcase me-2"></i>
                  Hire Freelancers
                </Button>
                <Button
                  as={Link}
                  to="/signup"
                  variant="outline-light"
                  size="lg"
                  className="fw-semibold px-5 py-3 shadow-lg btn-hover"
                  style={{ borderRadius: '50px' }}
                >
                  <i className="fas fa-rocket me-2"></i>
                  Start Freelancing
                </Button>
              </div>
              <div className="d-flex align-items-center justify-content-center justify-content-lg-start animate-slide-up" style={{ animationDelay: '0.6s' }}>
                <div className="d-flex align-items-center me-4 bg-white bg-opacity-10 rounded-pill px-3 py-2">
                  <div className="text-warning me-2">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <span className="small fw-medium">4.9/5 from 1000+ reviews</span>
                </div>
              </div>
            </Col>

            <Col lg={6} className="text-center mt-5 mt-lg-0">
              <div className="hero-image position-relative animate-slide-up" style={{ animationDelay: '0.8s' }}>
                <img
                  src={homepage}
                  alt="Freelancing Platform"
                  className="img-fluid rounded-4 shadow-lg"
                />
                <div className="position-absolute top-0 start-0 bg-primary text-white rounded-pill px-3 py-2 small fw-medium shadow animate-bounce">
                  <i className="fas fa-users me-1"></i>
                  500+ Active Freelancers
                </div>
                <div className="position-absolute bottom-0 end-0 bg-success text-white rounded-pill px-3 py-2 small fw-medium shadow animate-bounce" style={{ animationDelay: '1s' }}>
                  <i className="fas fa-check-circle me-1"></i>
                  1000+ Projects Completed
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Spacer to account for fixed hero section */}
      <div style={{ height: '100vh' }}></div>

      {/* Scrollable Content Section */}
      <div className="scrollable-content" style={{ position: 'relative', zIndex: 10, backgroundColor: '#f8f9fa' }}>
        
        {/* Features Section - This will scroll over the hero */}
        <section id="features" className="features-section py-5 bg-light shadow-lg" style={{ 
          borderTopLeftRadius: '20px', 
          borderTopRightRadius: '20px',
          marginTop: '-20px'
        }}>
          <Container>
            <Row className="text-center mb-5">
              <Col>
                <h2 className="display-4 fw-bold text-dark mb-4 animate-fade-in">Why Choose Our Platform?</h2>
                <p className="lead text-muted fs-5 animate-fade-in" style={{ animationDelay: '0.2s' }}>Everything you need to succeed in the world of freelancing</p>
              </Col>
            </Row>

            <Row className="g-4">
              {/* Post a Job card - only for non-freelancers */}
              {(!user || user.role !== 'freelancer') && (
                <Col md={6} lg={4}>
                  <Card className="h-100 border-0 shadow-sm text-center hover-lift bg-white animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <Card.Body className="p-5">
                      <div className="mb-4">
                        <div className="feature-icon-wrapper mb-3">
                          <i className="fas fa-briefcase text-primary" style={{ fontSize: '3rem' }}></i>
                        </div>
                      </div>
                      <Card.Title className="fw-bold mb-3 fs-4">Post a Job</Card.Title>
                      <Card.Text className="text-muted fs-6">
                        Easily post your project requirements and get proposals from qualified freelancers within hours.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              )}
              {/* Browse Freelancers card - only for non-freelancers */}
              {(!user || user.role !== 'freelancer') && (
                <Col md={6} lg={4}>
                  <Card className="h-100 border-0 shadow-sm text-center hover-lift bg-white animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <Card.Body className="p-5">
                      <div className="mb-4">
                        <div className="feature-icon-wrapper mb-3">
                          <i className="fas fa-search text-primary" style={{ fontSize: '3rem' }}></i>
                        </div>
                      </div>
                      <Card.Title className="fw-bold mb-3 fs-4">Browse Talent</Card.Title>
                      <Card.Text className="text-muted fs-6">
                        Discover skilled professionals with verified profiles, portfolios, and client reviews.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              )}

              <Col md={6} lg={4}>
                <Card className="h-100 border-0 shadow-sm text-center hover-lift bg-white animate-slide-up" style={{ animationDelay: '0.3s' }}>
                  <Card.Body className="p-5">
                    <div className="mb-4">
                      <div className="feature-icon-wrapper mb-3">
                        <i className="fas fa-shield-alt text-primary" style={{ fontSize: '3rem' }}></i>
                      </div>
                    </div>
                    <Card.Title className="fw-bold mb-3 fs-4">Secure Payments</Card.Title>
                    <Card.Text className="text-muted fs-6">
                      Safe and secure payment system with milestone-based releases and dispute resolution.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6} lg={4}>
                <Card className="h-100 border-0 shadow-sm text-center hover-lift bg-white animate-slide-up" style={{ animationDelay: '0.4s' }}>
                  <Card.Body className="p-5">
                    <div className="mb-4">
                      <div className="feature-icon-wrapper mb-3">
                        <i className="fas fa-headset text-primary" style={{ fontSize: '3rem' }}></i>
                      </div>
                    </div>
                    <Card.Title className="fw-bold mb-3 fs-4">24/7 Support</Card.Title>
                    <Card.Text className="text-muted fs-6">
                      Round-the-clock customer support to help you with any questions or issues.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6} lg={4}>
                <Card className="h-100 border-0 shadow-sm text-center hover-lift bg-white animate-slide-up" style={{ animationDelay: '0.5s' }}>
                  <Card.Body className="p-5">
                    <div className="mb-4">
                      <div className="feature-icon-wrapper mb-3">
                        <i className="fas fa-chart-line text-primary" style={{ fontSize: '3rem' }}></i>
                      </div>
                    </div>
                    <Card.Title className="fw-bold mb-3 fs-4">Analytics</Card.Title>
                    <Card.Text className="text-muted fs-6">
                      Track your project progress and performance with detailed analytics and reports.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6} lg={4}>
                <Card className="h-100 border-0 shadow-sm text-center hover-lift bg-white animate-slide-up" style={{ animationDelay: '0.6s' }}>
                  <Card.Body className="p-5">
                    <div className="mb-4">
                      <div className="feature-icon-wrapper mb-3">
                        <i className="fas fa-mobile-alt text-primary" style={{ fontSize: '3rem' }}></i>
                      </div>
                    </div>
                    <Card.Title className="fw-bold mb-3 fs-4">Mobile App</Card.Title>
                    <Card.Text className="text-muted fs-6">
                      Stay connected on the go with our mobile app for iOS and Android devices.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Latest News Section */}
        <section
          className="news-section py-5 position-relative"
          // style={{
          //   backgroundImage: "url('https://picsum.photos/1920/600?random=9')",
          //   backgroundSize: "cover",
          //   backgroundPosition: "center",
          // }}
        >
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-primary opacity-90"></div>
          <Container className="position-relative" style={{ zIndex: 2 }}>
            <Row className="text-center mb-5">
              <Col>
                <h2 className="display-4 fw-bold text-white mb-4">Latest News & Updates</h2>
                <p className="lead text-light fs-5">
                  Stay updated with the latest platform features and industry insights
                </p>
              </Col>
            </Row>

            <Row className="g-4">
              <Col md={6} lg={4}>
                <Card className="h-100 border-0 shadow-lg hover-lift">
                  <img
                    src={aiimage}
                    alt="AI Matching System"
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-3">
                      <Badge bg="primary" className="me-2 px-3 py-2">
                        News
                      </Badge>
                      <small className="text-muted fw-medium">august 7, 2025</small>
                    </div>
                    <Card.Title className="fw-bold mb-3 fs-5">New AI-Powered Matching System</Card.Title>
                    <Card.Text className="text-muted">
                      We've launched an advanced AI system that matches clients with the perfect freelancers based on
                      project requirements and past performance.
                    </Card.Text>
                    <Button variant="primary" size="sm" className="fw-medium btn-hover">
                      Read More <i className="fas fa-arrow-right ms-1"></i>
                    </Button>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6} lg={4}>
                <Card className="h-100 border-0 shadow-lg hover-lift">
                  <img
                    src={mobileimage}
                    alt="Mobile App Update"
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-3">
                      <Badge bg="success" className="me-2 px-3 py-2">
                        Update
                      </Badge>
                      <small className="text-muted fw-medium">December 10, 2025</small>
                    </div>
                    <Card.Title className="fw-bold mb-3 fs-5">Mobile App 2.0 Released</Card.Title>
                    <Card.Text className="text-muted">
                      Our completely redesigned mobile app offers better performance, new features, and an improved user
                      experience for both clients and freelancers.
                    </Card.Text>
                    <Button variant="primary" size="sm" className="fw-medium btn-hover">
                      Read More <i className="fas fa-arrow-right ms-1"></i>
                    </Button>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6} lg={4}>
                <Card className="h-100 border-0 shadow-lg hover-lift">
                  <img
                    src={security}
                    alt="Security Features"
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-3">
                      <Badge bg="warning" className="me-2 px-3 py-2">
                        Security
                      </Badge>
                      <small className="text-muted fw-medium">December 5, 2025</small>
                    </div>
                    <Card.Title className="fw-bold mb-3 fs-5">Enhanced Security Features</Card.Title>
                    <Card.Text className="text-muted">
                      We've implemented additional security measures including two-factor authentication and advanced
                      fraud detection to keep your account safe.
                    </Card.Text>
                    <Button variant="primary" size="sm" className="fw-medium btn-hover">
                      Read More <i className="fas fa-arrow-right ms-1"></i>
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>

        {/* About Platform Section */}
        <section id="about" className="about-section py-5 bg-light">
          <Container>
            <Row className="align-items-center g-5">
              <Col lg={6} className="mb-4 mb-lg-0">
                <img
                  src={oppertunity}
                  alt="Team Collaboration"
                  className="img-fluid rounded-4 shadow-lg"
                />
              </Col>
              <Col lg={6}>
                <div className="ps-lg-4">
                  <h2 className="display-4 fw-bold text-dark mb-4">Connecting Talent with Opportunity</h2>
                  <p className="lead text-muted mb-4 fs-5">
                    FreelanceHub is more than just a platform – we're a community that brings together the world's best
                    freelancers and forward-thinking businesses.
                  </p>
                  <div className="mb-5">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary rounded-circle p-3 me-3 shadow-sm">
                        <i className="fas fa-check text-white fs-5"></i>
                      </div>
                      <span className="fw-medium fs-6">Verified freelancers with proven track records</span>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary rounded-circle p-3 me-3 shadow-sm">
                        <i className="fas fa-check text-white fs-5"></i>
                      </div>
                      <span className="fw-medium fs-6">Secure payment system with escrow protection</span>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary rounded-circle p-3 me-3 shadow-sm">
                        <i className="fas fa-check text-white fs-5"></i>
                      </div>
                      <span className="fw-medium fs-6">24/7 customer support and dispute resolution</span>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary rounded-circle p-3 me-3 shadow-sm">
                        <i className="fas fa-check text-white fs-5"></i>
                      </div>
                      <span className="fw-medium fs-6">Advanced project management tools</span>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="lg"
                    className="fw-semibold px-4 py-3 shadow btn-hover"
                    style={{ borderRadius: "50px" }}
                  >
                    Learn More About Us
                    <i className="fas fa-arrow-right ms-2"></i>
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className="testimonials-section py-5 position-relative"
          // style={{
          //   backgroundImage: "url('https://picsum.photos/1920/800?random=14')",
          //   backgroundSize: "cover",
          //   backgroundPosition: "center",
          // }}
        >
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-85"></div>
          <Container className="position-relative" style={{ zIndex: 2 }}>
            <Row className="text-center mb-5">
              <Col>
                <h2 className="display-4 fw-bold text-white mb-4">What Our Users Say</h2>
                <p className="lead text-light fs-5">
                  Don't just take our word for it – hear from our satisfied clients and freelancers
                </p>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col lg={10}>
                <Carousel className="testimonial-carousel" indicators={true} controls={true} interval={5000}>
                  <Carousel.Item>
                    <Card className="border-0 shadow-lg bg-white">
                      <Card.Body className="p-5 text-center">
                        <div className="mb-4">
                          <i className="fas fa-quote-left text-primary" style={{ fontSize: "3rem" }}></i>
                        </div>
                        <blockquote className="blockquote mb-4">
                          <p className="lead fs-4">
                            "FreelanceHub helped me find the perfect developer for my startup. The quality of work
                            exceeded my expectations, and the project was delivered on time and within budget."
                          </p>
                        </blockquote>
                        <div className="d-flex align-items-center justify-content-center">
                          <img
                            src={logo}
                            alt="kunjesh shrimankar"
                            className="rounded-circle me-3"
                            style={{ width: "60px", height: "60px", objectFit: "cover" }}
                          />
                          <div className="text-start">
                            <div className="fw-bold fs-5">Kunjesh shrimankar</div>
                            <div className="text-muted">CEO</div>
                            <div className="text-warning mt-1">
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                            </div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Carousel.Item>

                  <Carousel.Item>
                    <Card className="border-0 shadow-lg bg-white">
                      <Card.Body className="p-5 text-center">
                        <div className="mb-4">
                          <i className="fas fa-quote-left text-primary" style={{ fontSize: "3rem" }}></i>
                        </div>
                        <blockquote className="blockquote mb-4">
                          <p className="lead fs-4">
                            "As a freelancer, FreelanceHub has been a game-changer for my career. I've found consistent,
                            high-quality projects and built lasting relationships with amazing clients."
                          </p>
                        </blockquote>
                        <div className="d-flex align-items-center justify-content-center">
                          <img
                            src={logo}
                            alt="ram"
                            className="rounded-circle me-3"
                            style={{ width: "60px", height: "60px", objectFit: "cover" }}
                          />
                          <div className="text-start">
                            <div className="fw-bold fs-5">ram</div>
                            <div className="text-muted">Full-Stack Developer</div>
                            <div className="text-warning mt-1">
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                            </div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Carousel.Item>

                  <Carousel.Item>
                    <Card className="border-0 shadow-lg bg-white">
                      <Card.Body className="p-5 text-center">
                        <div className="mb-4">
                          <i className="fas fa-quote-left text-primary" style={{ fontSize: "3rem" }}></i>
                        </div>
                        <blockquote className="blockquote mb-4">
                          <p className="lead fs-4">
                            "The platform's security features and payment protection gave me confidence to work with
                            international clients. I've grown my business significantly thanks to FreelanceHub."
                          </p>
                        </blockquote>
                        <div className="d-flex align-items-center justify-content-center">
                          <img
                            src={logo}
                            alt="radhe"
                            className="rounded-circle me-3"
                            style={{ width: "60px", height: "60px", objectFit: "cover" }}
                          />
                          <div className="text-start">
                            <div className="fw-bold fs-5">radhe</div>
                            <div className="text-muted">Graphic Designer</div>
                            <div className="text-warning mt-1">
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                            </div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Carousel.Item>
                </Carousel>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Stats Section */}
        <section className="stats-section py-5 bg-primary text-white">
          <Container>
            <Row className="text-center g-4">
              <Col md={6} lg={3}>
                <div className="stat-item p-4">
                  <i className="fas fa-chart-line mb-3" style={{ fontSize: "4rem" }}></i>
                  <h3 className="fw-bold display-5 mb-2">1000+</h3>
                  <p className="mb-0 fs-5 text-light">Projects Completed</p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="stat-item p-4">
                  <i className="fas fa-users mb-3" style={{ fontSize: "4rem" }}></i>
                  <h3 className="fw-bold display-5 mb-2">500+</h3>
                  <p className="mb-0 fs-5 text-light">Active Freelancers</p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="stat-item p-4">
                  <i className="fas fa-handshake mb-3" style={{ fontSize: "4rem" }}></i>
                  <h3 className="fw-bold display-5 mb-2">200+</h3>
                  <p className="mb-0 fs-5 text-light">Happy Clients</p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="stat-item p-4">
                  <i className="fas fa-shield-alt mb-3" style={{ fontSize: "4rem" }}></i>
                  <h3 className="fw-bold display-5 mb-2">99%</h3>
                  <p className="mb-0 fs-5 text-light">Success Rate</p>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="cta-section py-5 bg-light">
          <Container>
            <Row className="text-center">
              <Col lg={8} className="mx-auto">
                <h2 className="display-4 fw-bold mb-4">Ready to Get Started?</h2>
                <p className="lead text-muted mb-5 fs-5">
                  Join thousands of clients and freelancers who trust our platform for their projects. Start your journey
                  today!
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mb-4">
                  <Button
                    as={Link}
                    to="/signup"
                    variant="primary"
                    size="lg"
                    className="fw-semibold px-5 py-3 shadow btn-hover"
                    style={{ borderRadius: "50px" }}
                  >
                    <i className="fas fa-user-plus me-2"></i>
                    Create Account
                  </Button>
                  <Button
                    as={Link}
                    to="/login"
                    variant="outline-primary"
                    size="lg"
                    className="fw-semibold px-5 py-3 btn-hover"
                    style={{ borderRadius: "50px" }}
                  >
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Sign In
                  </Button>
                </div>
                <div className="d-flex align-items-center justify-content-center text-muted">
                  <i className="fas fa-lock me-2"></i>
                  <span className="fw-medium">Secure • Trusted • Professional</span>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Footer */}
        <footer className="bg-dark text-white py-5">
          <Container>
            <Row className="g-4">
              <Col lg={4} className="mb-4">
                <h5 className="fw-bold mb-4 fs-4">
                  <i className="fas fa-handshake me-2"></i>
                  FreelanceHub
                </h5>
                <p className="text-light mb-4 fs-6">
                  Connecting talented freelancers with businesses worldwide. Build your career or grow your business with
                  our trusted platform.
                </p>
                <div className="d-flex gap-3">
                  <a href="#" className="text-white fs-4 hover-social">
                    <i className="fab fa-facebook"></i>
                  </a>
                  <a href="#" className="text-white fs-4 hover-social">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="text-white fs-4 hover-social">
                    <i className="fab fa-linkedin"></i>
                  </a>
                  <a href="#" className="text-white fs-4 hover-social">
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </Col>

              <Col lg={2} md={6} className="mb-4">
                <h6 className="fw-bold mb-3 fs-5">For Clients</h6>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <a href="#" className="text-light text-decoration-none hover-link">
                      Post a Job
                    </a>
                  </li>
                  <li className="mb-2">
                    <a href="#" className="text-light text-decoration-none hover-link">
                      Browse Freelancers
                    </a>
                  </li>
                  <li className="mb-2">
                    <a href="#" className="text-light text-decoration-none hover-link">
                      How it Works
                    </a>
                  </li>
                  <li className="mb-2">
                    <a href="#" className="text-light text-decoration-none hover-link">
                      Success Stories
                    </a>
                  </li>
                </ul>
              </Col>

              <Col lg={2} md={6} className="mb-4">
                <h6 className="fw-bold mb-3 fs-5">For Freelancers</h6>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <a href="#" className="text-light text-decoration-none hover-link">
                      Find Work
                    </a>
                  </li>
                  <li className="mb-2">
                    <a href="#" className="text-light text-decoration-none hover-link">
                      Create Profile
                    </a>
                  </li>
                  <li className="mb-2">
                    <a href="#" className="text-light text-decoration-none hover-link">
                      Resources
                    </a>
                  </li>
                  <li className="mb-2">
                    <a href="#" className="text-light text-decoration-none hover-link">
                      Community
                    </a>
                  </li>
                </ul>
              </Col>

              <Col lg={2} md={6} className="mb-4">
                <h6 className="fw-bold mb-3 fs-5">Company</h6>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <a href="#" className="text-light text-decoration-none hover-link">
                      About Us
                    </a>
                  </li>
                  <li className="mb-2">
                    <a href="#" className="text-light text-decoration-none hover-link">
                      Careers
                    </a>
                  </li>
                  <li className="mb-2">
                    <a href="#" className="text-light text-decoration-none hover-link">
                      Press
                    </a>
                  </li>
                  <li className="mb-2">
                    <a href="#" className="text-light text-decoration-none hover-link">
                      Blog
                    </a>
                  </li>
                </ul>
              </Col>

              <Col lg={2} md={6} className="mb-4">
                <h6 className="fw-bold mb-3 fs-5">Support</h6>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <a href="#" className="text-light text-decoration-none hover-link">
                      Help Center
                    </a>
                  </li>
                  <li className="mb-2">
                    <a href="#" className="text-light text-decoration-none hover-link">
                      Contact Us
                    </a>
                  </li>
                  <li className="mb-2">
                    <a href="#" className="text-light text-decoration-none hover-link">
                      Privacy Policy
                    </a>
                  </li>
                  <li className="mb-2">
                    <a href="#" className="text-light text-decoration-none hover-link">
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </Col>
            </Row>

            <hr className="my-4 border-secondary" />

            <Row className="align-items-center">
              <Col md={6}>
                <p className="mb-0 text-light">© 2025 FreelanceHub. All rights reserved.</p>
              </Col>
              <Col md={6} className="text-md-end">
                <div className="d-flex align-items-center justify-content-md-end gap-4">
                  <span className="text-light">
                    <i className="fas fa-envelope me-2"></i>
                    support@freelancehub.com
                  </span>
                  <span className="text-light">
                    <i className="fas fa-phone me-2"></i>
                    8200804070
                  </span>
                </div>
              </Col>
            </Row>
          </Container>
        </footer>

      </div>

      <style jsx>{`
        /* Enhanced Navbar Styles */
        .nav-link-hover {
          transition: all 0.3s ease;
          position: relative;
        }
        .nav-link-hover:hover {
          background-color: rgba(13, 110, 253, 0.1);
          color: #0d6efd !important;
          transform: translateY(-2px);
        }
        .nav-link-hover.active {
          background-color: rgba(13, 110, 253, 0.15);
          color: #0d6efd !important;
          font-weight: 600;
        }
        
        /* Button Hover Effects */
        .btn-hover {
          transition: all 0.3s ease;
        }
        .btn-hover:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        
        /* Card Hover Effects */
        .hover-lift {
          transition: all 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
        }
        
        /* Text Shadow */
        .text-shadow {
          text-shadow: 2px 2px 8px rgba(0,0,0,0.5);
        }
        
        /* Social Media Hover */
        .hover-social:hover {
          color: #007bff !important;
          transform: scale(1.2);
          transition: all 0.3s ease;
        }
        
        /* Footer Link Hover */
        .hover-link:hover {
          color: #007bff !important;
          transition: all 0.3s ease;
        }
        
        /* Testimonial Carousel */
        .testimonial-carousel .carousel-indicators button {
          background-color: #007bff;
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        .testimonial-carousel .carousel-control-prev-icon,
        .testimonial-carousel .carousel-control-next-icon {
          background-color: #007bff;
          border-radius: 50%;
          padding: 20px;
        }
        
        /* Animation Classes */
        .animate-slide-up {
          animation: slideUp 0.8s ease-out forwards;
          opacity: 0;
          transform: translateY(50px);
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
          opacity: 0;
        }
        
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        
        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
        
        /* Feature Icon Wrapper */
        .feature-icon-wrapper {
          position: relative;
          display: inline-block;
        }
        
        .feature-icon-wrapper::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, rgba(13, 110, 253, 0.1), rgba(13, 110, 253, 0.2));
          border-radius: 50%;
          z-index: -1;
        }
        
        /* Scrollable Content Shadow */
        .scrollable-content {
          box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.1);
        }
        
        /* Mobile Responsive Typography */
        @media (max-width: 768px) {
          .display-2 {
            font-size: 2.5rem;
          }
          .display-4 {
            font-size: 2rem;
          }
          .navbar-brand {
            font-size: 1.5rem !important;
          }
          
          /* Adjust hero section for mobile */
          .hero-section {
            position: relative !important;
            height: 100vh !important;
          }
          
          .scrollable-content {
            margin-top: 0 !important;
          }
        }
        
        /* Navbar Toggle Animation */
        .navbar-toggler {
          border: none;
          padding: 0.25rem 0.5rem;
        }
        .navbar-toggler:focus {
          box-shadow: none;
        }
        
        /* Smooth Scrolling for Anchor Links */
        html {
          scroll-behavior: smooth;
        }
        
        /* Add scroll margin to account for fixed navbar */
        #features, #about, #testimonials {
          scroll-margin-top: 80px;
          position: relative;
          z-index: 1;
        }
        
        /* Ensure sections are properly visible */
        .features-section, .about-section, .testimonials-section {
          position: relative;
          z-index: 10;
        }
        
        /* Ensure scrollable content appears above fixed hero */
        .scrollable-content {
          position: relative;
          z-index: 10;
        }
        
        /* Add subtle gradient overlay to hero for better text readability */
        .hero-section::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 100px;
          background: linear-gradient(to bottom, transparent, rgba(248, 249, 250, 0.3));
          z-index: 1;
        }
      `}</style>
    </div>
  )
}

export default HomePage