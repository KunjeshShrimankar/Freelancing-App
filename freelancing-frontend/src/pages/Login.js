"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"
import { validationRules, validateForm } from "../components/FormValidation"
import axios from "axios"
import { Card, Button, Alert, Form, InputGroup, Spinner } from "react-bootstrap"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [generalError, setGeneralError] = useState("")
  const { login } = useAuth()
  const navigate = useNavigate()

  const validationSchema = {
    email: [validationRules.required, validationRules.email],
    password: [validationRules.required],
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }

    if (generalError) {
      setGeneralError("")
    }
  }

  const validateFormData = () => {
    const newErrors = validateForm(formData, validationSchema)
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

    try {
      const response = await axios.post("http://localhost:8000/api/users/login/", formData)
      const tokens = response.data.tokens || response.data
      let user = response.data.user

      if (!user && tokens && tokens.access) {
        const profileRes = await axios.get("http://localhost:8000/api/users/profile/", {
          headers: { Authorization: `Bearer ${tokens.access}` },
        })
        user = profileRes.data
      }

      if (tokens && user) {
        await login(tokens, user)
        const userRole = user.role || "client"
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
      } else {
        setGeneralError("Login failed. User information missing.")
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Login failed. Please check your credentials and try again."
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

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <Card className="shadow-lg border-0">
              <Card.Header className="text-center bg-white border-0 pb-4">
                <div
                  className="mx-auto bg-primary rounded-circle d-flex align-items-center justify-content-center mb-4"
                  style={{ width: "64px", height: "64px" }}
                >
                  <i className="fas fa-sign-in-alt text-white fs-4"></i>
                </div>
                <h2 className="fw-bold text-dark mb-2">Welcome Back</h2>
                <p className="text-muted">Sign in to your account</p>
              </Card.Header>

              <Card.Body className="p-4">
                {generalError && (
                  <Alert variant="danger" className="d-flex align-items-center">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {generalError}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
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

                  <div className="mb-4">
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
                        placeholder="Enter your password"
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
                  </div>

                  <Button type="submit" disabled={loading} className="w-100 py-2 fw-medium" variant="primary">
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </Form>

                <div className="text-center pt-4 mt-4 border-top">
                  <p className="text-muted mb-0">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-primary text-decoration-none fw-medium">
                      Sign up here
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

export default Login
