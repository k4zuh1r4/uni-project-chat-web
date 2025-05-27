'use client'
import React, { useEffect, useState } from 'react'
import { MessageNavbar } from '@/components/messageNavbar'
import { useThemeSelect } from '@/utils/themeSelect'
import { THEMES } from '@/themes'
import { Settings, Check, Moon, Sun, Circle } from 'lucide-react'

export default function SettingsPage() {
    const { theme, setTheme } = useThemeSelect()
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme])
    const themeIcons = {
        'luxury': <Moon className="w-5 h-5" />,
        'lemonade': <Sun className="w-5 h-5" />,
        'black': <Circle className="w-5 h-5" />
    }
    const themeColors = {
        'luxury': {
            bg: '#1f1a24',
            text: '#c3bfd0',
            accent: '#ebae34'
        },
        'lemonade': {
            bg: '#f9ffc2',
            text: '#333333',
            accent: '#96dc19'
        },
        'black': {
            bg: '#000000',
            text: '#ffffff',
            accent: '#444444'
        }
    }

    return (
        <>
            <MessageNavbar />
            <div className="min-h-[calc(100vh-64px)] bg-base-200 p-4">
                <div className="max-w-3xl mx-auto bg-base-100 rounded-lg shadow-lg overflow-hidden">
                    <div className="p-5 border-b border-base-300">
                        <div className="flex items-center gap-3">
                            <Settings className="w-6 h-6" />
                            <h1 className="text-2xl font-bold">Settings</h1>
                        </div>
                    </div>

                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Appearance</h2>
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Theme</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {THEMES.map((themeName) => (
                                    <button
                                        key={themeName}
                                        onClick={() => setTheme(themeName)}
                                        className={`relative p-4 border-2 rounded-lg transition-all ${theme === themeName
                                            ? 'ring-2 ring-primary border-primary'
                                            : 'border-base-300 hover:border-primary'
                                            }`}
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <div
                                                className="w-16 h-16 rounded-full flex items-center justify-center"
                                                style={{
                                                    backgroundColor: themeColors[themeName].bg,
                                                    color: themeColors[themeName].text,
                                                    border: `2px solid ${themeColors[themeName].accent}`
                                                }}
                                            >
                                                {themeIcons[themeName]}
                                            </div>
                                            <span className="capitalize font-medium">{themeName}</span>
                                        </div>

                                        {theme === themeName && (
                                            <div className="absolute top-2 right-2 bg-primary text-primary-content rounded-full p-1">
                                                <Check className="w-4 h-4" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}