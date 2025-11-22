"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"
import { validationRules, validateForm } from "../components/FormValidation"
import axios from "axios"
import { Card, Button, Alert, ProgressBar, Form, InputGroup, Row, Col, Spinner } from "react-bootstrap"

const Signup = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "client",
    phone: "",
    location: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [generalError, setGeneralError] = useState("")
  const [generalSuccess, setGeneralSuccess] = useState("")
  const { login } = useAuth()
  const navigate = useNavigate()

  const validationSchema = {
    first_name: [validationRules.required, validationRules.minLength(2)],
    last_name: [validationRules.required, validationRules.minLength(2)],
    email: [validationRules.required, validationRules.email],
    password: [validationRules.required, validationRules.password],
    confirm_password: [validationRules.required],
    role: [validationRules.required],
    phone: [validationRules.phone],
    location: [validationRules.minLength(2)],
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }

    if (generalError) setGeneralError("")
    if (generalSuccess) setGeneralSuccess("")
  }

  const validateFormData = () => {
    const newErrors = validateForm(formData, validationSchema)

    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateFormData()) {
      return
    }

    setLoading(true)
    setGeneralError("")
    setGeneralSuccess("")

    try {
      const response = await axios.post("http://localhost:8000/api/users/register/", {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        password_confirm: formData.confirm_password,
        role: formData.role,
        phone_number: formData.phone,
        address: formData.location,
      })

      setGeneralSuccess("Account created successfully! Redirecting to login...")

      setTimeout(async () => {
        try {
          const loginResponse = await axios.post("http://localhost:8000/api/users/login/", {
            email: formData.email,
            password: formData.password,
          })

          if (loginResponse.data.access) {
            await login(loginResponse.data.access, loginResponse.data.refresh)

            const userRole = formData.role
            switch (userRole) {
              case "admin":
                navigate("/admin")
                break
              case "freelancer":
                navigate("/freelancer")
                break
              case "client":
              default:
                navigate("/client")
                break
            }
          }
        } catch (loginErr) {
          navigate("/login")
        }
      }, 2000)
    } catch (err) {
      const errorMessage =
        err.response?.data?.email?.[0] ||
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Registration failed. Please try again."
      setGeneralError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleBlur = (fieldName) => {
    if (validationSchema[fieldName]) {
      const fieldError = validationSchema[fieldName].find((rule) => rule(formData[fieldName]))
      setErrors((prev) => ({
        ...prev,
        [fieldName]: fieldError ? fieldError(formData[fieldName]) : "",
      }))
    }
  }

  // Password strength calculation
  const getPasswordStrength = () => {
    const password = formData.password
    if (!password) return { score: 0, label: "", color: "" }

    let score = 0
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }

    score = Object.values(checks).filter(Boolean).length

    if (score <= 2) return { score, label: "Weak", color: "danger" }
    if (score <= 3) return { score, label: "Fair", color: "warning" }
    if (score <= 4) return { score, label: "Good", color: "primary" }
    return { score, label: "Strong", color: "success" }
  }

  const passwordStrength = getPasswordStrength()

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-6">
            <Card className="shadow-lg border-0">
              <Card.Header className="text-center bg-white border-0 pb-4">
                <div
                  className="mx-auto bg-primary rounded-circle d-flex align-items-center justify-content-center mb-4"
                  style={{ width: "64px", height: "64px" }}
                >
                  <i className="fas fa-user-plus text-white fs-4"></i>
                </div>
                <h2 className="fw-bold text-dark mb-2">Create Account</h2>
                <p className="text-muted">Join our freelancing platform</p>
              </Card.Header>

              <Card.Body className="p-4">
                {generalError && (
                  <Alert variant="danger" className="d-flex align-items-center">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {generalError}
                  </Alert>
                )}

                {generalSuccess && (
                  <Alert variant="success" className="d-flex align-items-center">
                    <i className="fas fa-check-circle me-2"></i>
                    {generalSuccess}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <Form.Label htmlFor="first_name" className="fw-medium">
                          First Name
                        </Form.Label>
                        <Form.Control
                          id="first_name"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          onBlur={() => handleBlur("first_name")}
                          placeholder="Enter your first name"
                          disabled={loading}
                          isInvalid={!!errors.first_name}
                          className="py-2"
                        />
                        {errors.first_name && (
                          <Form.Control.Feedback type="invalid" className="d-flex align-items-center">
                            <i className="fas fa-exclamation-circle me-1"></i>
                            {errors.first_name}
                          </Form.Control.Feedback>
                        )}
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className="mb-3">
                        <Form.Label htmlFor="last_name" className="fw-medium">
                          Last Name
                        </Form.Label>
                        <Form.Control
                          id="last_name"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          onBlur={() => handleBlur("last_name")}
                          placeholder="Enter your last name"
                          disabled={loading}
                          isInvalid={!!errors.last_name}
                          className="py-2"
                        />
                        {errors.last_name && (
                          <Form.Control.Feedback type="invalid" className="d-flex align-items-center">
                            <i className="fas fa-exclamation-circle me-1"></i>
                            {errors.last_name}
                          </Form.Control.Feedback>
                        )}
                      </div>
                    </Col>
                  </Row>

                  <div className="mb-3">
                    <Form.Label htmlFor="email" className="fw-medium">
                      Email Address
                    </Form.Label>
                    <Form.Control
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur("email")}
                      placeholder="Enter your email"
                      disabled={loading}
                      isInvalid={!!errors.email}
                      className="py-2"
                    />
                    {errors.email && (
                      <Form.Control.Feedback type="invalid" className="d-flex align-items-center">
                        <i className="fas fa-exclamation-circle me-1"></i>
                        {errors.email}
                      </Form.Control.Feedback>
                    )}
                  </div>

                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <Form.Label htmlFor="phone" className="fw-medium">
                          Phone Number
                        </Form.Label>
                        <Form.Control
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          onBlur={() => handleBlur("phone")}
                          placeholder="Enter your phone number"
                          disabled={loading}
                          isInvalid={!!errors.phone}
                          className="py-2"
                        />
                        {errors.phone && (
                          <Form.Control.Feedback type="invalid" className="d-flex align-items-center">
                            <i className="fas fa-exclamation-circle me-1"></i>
                            {errors.phone}
                          </Form.Control.Feedback>
                        )}
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className="mb-3">
                        <Form.Label htmlFor="location" className="fw-medium">
                          Location
                        </Form.Label>
                        <Form.Control
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          onBlur={() => handleBlur("location")}
                          placeholder="Enter your location"
                          disabled={loading}
                          isInvalid={!!errors.location}
                          className="py-2"
                        />
                        {errors.location && (
                          <Form.Control.Feedback type="invalid" className="d-flex align-items-center">
                            <i className="fas fa-exclamation-circle me-1"></i>
                            {errors.location}
                          </Form.Control.Feedback>
                        )}
                      </div>
                    </Col>
                  </Row>

                  <div className="mb-3">
                    <Form.Label htmlFor="role" className="fw-medium">
                      Account Type
                    </Form.Label>
                    <Form.Select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      isInvalid={!!errors.role}
                      className="py-2"
                    >
                      <option value="">Select account type</option>
                      <option value="client">Client - I want to hire freelancers</option>
                      <option value="freelancer">Freelancer - I want to find work</option>
                      <option value="admin">Admin - I want to manage the platform</option>
                    </Form.Select>
                    {errors.role && (
                      <Form.Control.Feedback type="invalid" className="d-flex align-items-center">
                        <i className="fas fa-exclamation-circle me-1"></i>
                        {errors.role}
                      </Form.Control.Feedback>
                    )}
                  </div>

                  <div className="mb-3">
                    <Form.Label htmlFor="password" className="fw-medium">
                      Password
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={() => handleBlur("password")}
                        placeholder="Create a strong password"
                        disabled={loading}
                        isInvalid={!!errors.password}
                        className="py-2"
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                      </Button>
                    </InputGroup>
                    {errors.password && (
                      <div className="invalid-feedback d-flex align-items-center">
                        <i className="fas fa-exclamation-circle me-1"></i>
                        {errors.password}
                      </div>
                    )}

                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="mt-2">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small className="text-muted">Password Strength:</small>
                          <small className={`fw-medium text-${passwordStrength.color}`}>{passwordStrength.label}</small>
                        </div>
                        <ProgressBar
                          variant={passwordStrength.color}
                          now={(passwordStrength.score / 5) * 100}
                          style={{ height: "6px" }}
                        />
                        <div className="d-flex flex-wrap gap-2 mt-2">
                          {[
                            { check: passwordStrength.score >= 1, label: "8+ characters" },
                            { check: passwordStrength.score >= 2, label: "Uppercase" },
                            { check: passwordStrength.score >= 3, label: "Lowercase" },
                            { check: passwordStrength.score >= 4, label: "Number" },
                            { check: passwordStrength.score >= 5, label: "Special char" },
                          ].map((item, index) => (
                            <small
                              key={index}
                              className={`d-flex align-items-center ${item.check ? "text-success" : "text-muted"}`}
                            >
                              <i className={`fas ${item.check ? "fa-check" : "fa-times"} me-1`}></i>
                              {item.label}
                            </small>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <Form.Label htmlFor="confirm_password" className="fw-medium">
                      Confirm Password
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        id="confirm_password"
                        name="confirm_password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirm_password}
                        onChange={handleChange}
                        onBlur={() => handleBlur("confirm_password")}
                        placeholder="Confirm your password"
                        disabled={loading}
                        isInvalid={!!errors.confirm_password}
                        className="py-2"
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={loading}
                      >
                        <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                      </Button>
                    </InputGroup>
                    {errors.confirm_password && (
                      <div className="invalid-feedback d-flex align-items-center">
                        <i className="fas fa-exclamation-circle me-1"></i>
                        {errors.confirm_password}
                      </div>
                    )}
                  </div>

                  <Button type="submit" disabled={loading} className="w-100 py-2 fw-medium" variant="primary">
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </Form>

                <div className="text-center pt-4 mt-4 border-top">
                  <p className="text-muted mb-0">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary text-decoration-none fw-medium">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
