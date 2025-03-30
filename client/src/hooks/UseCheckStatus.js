import React, { useEffect } from 'react'
import { toast } from 'react-toastify'

const UseCheckStatus = () => {
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const recipeStatus = localStorage.getItem("recipeStatus")
      if (recipeStatus === 'ready') {
        toast.success("Your recipe is ready! Go to the create page to view it.")
        clearInterval(checkInterval)
      }
    }, 5000);

    return () => {
      clearInterval(checkInterval)
    }
  }, [])

  
}

export default UseCheckStatus
