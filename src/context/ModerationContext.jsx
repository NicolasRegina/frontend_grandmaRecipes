import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'

const ModerationContext = createContext()

export const ModerationProvider = ({ children }) => {
  const [counts, setCounts] = useState({
    pendingGroups: 0,
    pendingRecipes: 0,
    loading: true
  })
  const { user } = useAuth()

  const fetchCounts = useCallback(async () => {
    if (!user || user.role !== 'admin') {
      setCounts({ pendingGroups: 0, pendingRecipes: 0, loading: false })
      return
    }

    try {
      const token = localStorage.getItem('token')
      
      // Obtener grupos pendientes
      const groupsResponse = await fetch('/api/groups/moderation/pending', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      // Obtener recetas pendientes
      const recipesResponse = await fetch('/api/recipes/moderation/pending', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      const groupsData = groupsResponse.ok ? await groupsResponse.json() : []
      const recipesData = recipesResponse.ok ? await recipesResponse.json() : []

      setCounts({
        pendingGroups: groupsData.length || 0,
        pendingRecipes: recipesData.length || 0,
        loading: false
      })
    } catch (error) {
      console.error('Error fetching moderation counts:', error)
      setCounts({ pendingGroups: 0, pendingRecipes: 0, loading: false })
    }
  }, [user])

  useEffect(() => {
    fetchCounts()
    
    // Actualizar cada 5 minutos
    const interval = setInterval(fetchCounts, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [fetchCounts])

  // Función para refrescar manualmente los contadores
  const refresh = useCallback(() => {
    fetchCounts()
  }, [fetchCounts])

  const value = {
    ...counts,
    refresh
  }

  return (
    <ModerationContext.Provider value={value}>
      {children}
    </ModerationContext.Provider>
  )
}

// Hook personalizado para usar el contexto
export const useModerationCounts = () => {
  const context = useContext(ModerationContext)
  if (!context) {
    throw new Error('useModerationCounts must be used within a ModerationProvider')
  }
  return context
}
