import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

function ProtectedRoute({ children, allowedRole }) {
  const location = useLocation()
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('userRole')

  if (!token) {
    return <Navigate to='/login' replace state={{ from: location.pathname + location.search }} />
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to='/' replace />
  }

  return children
}

export default ProtectedRoute