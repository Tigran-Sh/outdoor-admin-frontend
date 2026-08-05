import { useEffect, type ReactNode } from 'react'

import { useTheme, type ThemeMode } from '../src/app/providers/useTheme'

interface ThemeSyncProps {
  theme: ThemeMode
  children: ReactNode
}

function ThemeSync({ theme, children }: ThemeSyncProps) {
  const { setTheme } = useTheme()

  useEffect(() => {
    setTheme(theme)
  }, [theme, setTheme])

  return <>{children}</>
}

export default ThemeSync
