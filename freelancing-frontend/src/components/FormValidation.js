"use client"

import { useState } from "react"
import { Form } from "react-bootstrap"

// Validation rules
export const validationRules = {
  required: (value) => (value && value.trim().length > 0 ? null : "This field is required"),
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value) ? null : "Please enter a valid email address"
  },
  minLength: (min) => (value) => (value && value.length >= min ? null : `Must be at least ${min} characters long`),
  maxLength: (max) => (value) => (value && value.length <= max ? null : `Must be no more than ${max} characters long`),
  number: (value) => {
    const num = Number.parseFloat(value)
    return !isNaN(num) && num > 0 ? null : "Please enter a valid number"
  },
  positiveNumber: (value) => {
    const num = Number.parseFloat(value)
    return !isNaN(num) && num > 0 ? null : "Please enter a positive number"
  },
  budget: (value) => {
    const num = Number.parseFloat(value)
    return !isNaN(num) && num >= 0 ? null : "Please enter a valid budget amount"
  },
  password: (value) => {
    const minLength = value && value.length >= 8
    const hasUpperCase = /[A-Z]/.test(value)
    const hasLowerCase = /[a-z]/.test(value)
    const hasNumbers = /\d/.test(value)

    if (!minLength) return "Password must be at least 8 characters long"
    if (!hasUpperCase) return "Password must contain at least one uppercase letter"
    if (!hasLowerCase) return "Password must contain at least one lowercase letter"
    if (!hasNumbers) return "Password must contain at least one number"

    return null
  },
  phone: (value) => {
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(value.replace(/[\s\-()]/g, "")) ? null : "Please enter a valid phone number"
  },
  url: (value) => {
    try {
      new URL(value)
      return null
    } catch {
      return "Please enter a valid URL"
    }
  },
}

// Validate a single field
export const validateField = (value, rules) => {
  for (const rule of rules) {
    const error = rule(value)
    if (error) return error
  }
  return null
}

// Validate entire form
export const validateForm = (formData, validationSchema) => {
  const errors = {}

  Object.keys(validationSchema).forEach((field) => {
    const value = formData[field]
    const rules = validationSchema[field]
    const error = validateField(value, rules)
    if (error) {
      errors[field] = error
    }
  })

  return errors
}

// Custom form control with validation
export const ValidatedFormControl = ({
  name,
  value,
  onChange,
  error,
  rules = [],
  validateOnChange = true,
  label,
  placeholder,
  type = "text",
  className = "",
  ...props
}) => {
  const handleChange = (e) => {
    const newValue = e.target.value
    onChange(e)

    if (validateOnChange && rules.length > 0) {
      const fieldError = validateField(newValue, rules)
      // You can add a callback here to update parent form errors
    }
  }

  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <Form.Label htmlFor={name} className="fw-medium text-dark">
          {label}
        </Form.Label>
      )}
      <Form.Control
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        isInvalid={!!error}
        className="py-2"
        {...props}
      />
      {error && (
        <Form.Control.Feedback type="invalid" className="d-flex align-items-center">
          <i className="fas fa-exclamation-circle me-1"></i>
          {error}
        </Form.Control.Feedback>
      )}
    </div>
  )
}

// Custom textarea with validation
export const ValidatedTextArea = ({
  name,
  value,
  onChange,
  error,
  rules = [],
  validateOnChange = true,
  label,
  placeholder,
  rows = 3,
  className = "",
  ...props
}) => {
  const handleChange = (e) => {
    const newValue = e.target.value
    onChange(e)

    if (validateOnChange && rules.length > 0) {
      const fieldError = validateField(newValue, rules)
      // You can add a callback here to update parent form errors
    }
  }

  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <Form.Label htmlFor={name} className="fw-medium text-dark">
          {label}
        </Form.Label>
      )}
      <Form.Control
        as="textarea"
        id={name}
        name={name}
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={handleChange}
        isInvalid={!!error}
        className="py-2"
        style={{ resize: "vertical" }}
        {...props}
      />
      {error && (
        <Form.Control.Feedback type="invalid" className="d-flex align-items-center">
          <i className="fas fa-exclamation-circle me-1"></i>
          {error}
        </Form.Control.Feedback>
      )}
    </div>
  )
}

// Custom select with validation
export const ValidatedSelect = ({
  name,
  value,
  onChange,
  error,
  rules = [],
  validateOnChange = true,
  label,
  placeholder = "Select an option",
  options = [],
  className = "",
  ...props
}) => {
  const handleChange = (e) => {
    const newValue = e.target.value
    const event = { target: { name, value: newValue } }
    onChange(event)

    if (validateOnChange && rules.length > 0) {
      const fieldError = validateField(newValue, rules)
      // You can add a callback here to update parent form errors
    }
  }

  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <Form.Label htmlFor={name} className="fw-medium text-dark">
          {label}
        </Form.Label>
      )}
      <Form.Select
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        isInvalid={!!error}
        className="py-2"
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </Form.Select>
      {error && (
        <Form.Control.Feedback type="invalid" className="d-flex align-items-center">
          <i className="fas fa-exclamation-circle me-1"></i>
          {error}
        </Form.Control.Feedback>
      )}
    </div>
  )
}

// Form validation hook
export const useFormValidation = (initialData, validationSchema) => {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Validate field if it has been touched
    if (touched[name] && validationSchema[name]) {
      const fieldError = validateField(value, validationSchema[name])
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }))
    }
  }

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }))

    if (validationSchema[name]) {
      const fieldError = validateField(formData[name], validationSchema[name])
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }))
    }
  }

  const validateAll = () => {
    const newErrors = validateForm(formData, validationSchema)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const resetForm = () => {
    setFormData(initialData)
    setErrors({})
    setTouched({})
  }

  return {
    formData,
    errors,
    touched,
    updateField,
    handleBlur,
    validateAll,
    resetForm,
    setFormData,
  }
}

export default {
  validationRules,
  validateField,
  validateForm,
  ValidatedFormControl,
  ValidatedTextArea,
  ValidatedSelect,
  useFormValidation,
}
