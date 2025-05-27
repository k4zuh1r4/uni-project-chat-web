import { create } from 'zustand'
import { THEMES } from '@/themes'

const getInitialTheme = () => {
    const defaultTheme = 'luxury'
    if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('chat-theme')
        return savedTheme || defaultTheme
    }

    return defaultTheme
}

export const useThemeSelect = create((set) => ({
    theme: getInitialTheme(),
    setTheme: (theme) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('chat-theme', theme)
        }
        set({ theme })
    },
    themes: THEMES,
}))