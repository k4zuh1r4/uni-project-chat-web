'use client'
import { useThemeSelect } from '@/utils/themeSelect'
import { useEffect } from 'react'

export function ThemeProvider({ children }) {
    const { theme } = useThemeSelect()

    useEffect(() => {
        // Apply theme to document when component mounts or theme changes
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme])

    return children
}