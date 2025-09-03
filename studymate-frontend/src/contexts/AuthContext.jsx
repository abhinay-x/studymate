import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on app load
    const savedUser = localStorage.getItem('studymate-user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('studymate-user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    setLoading(true)
    try {
      // Mock login - replace with actual API call
      const mockUser = {
        id: '1',
        name: credentials.name || 'John Doe',
        email: credentials.email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(credentials.name || 'John Doe')}&background=3b82f6&color=fff`,
        university: credentials.university || 'Stanford University',
        level: 5,
        xp: 2450,
        joinedAt: new Date().toISOString()
      }
      
      setUser(mockUser)
      localStorage.setItem('studymate-user', JSON.stringify(mockUser))
      return { success: true, user: mockUser }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const signup = async (userData) => {
    setLoading(true)
    try {
      // Mock signup - replace with actual API call
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=3b82f6&color=fff`,
        university: userData.university || '',
        level: 1,
        xp: 0,
        joinedAt: new Date().toISOString()
      }
      
      setUser(newUser)
      localStorage.setItem('studymate-user', JSON.stringify(newUser))
      return { success: true, user: newUser }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('studymate-user')
  }

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('studymate-user', JSON.stringify(updatedUser))
  }

  const value = {
    user,
    login,
    signin: login, // Add signin alias for compatibility
    signup,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
