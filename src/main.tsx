import { ConfigProvider } from 'antd-mobile'
import enUS from 'antd-mobile/es/locales/en-US'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const colorScheme = window.matchMedia('(prefers-color-scheme: dark)')
const applyColorScheme = () =>
  document.documentElement.setAttribute('data-prefers-color-scheme', colorScheme.matches ? 'dark' : 'light')
applyColorScheme()
colorScheme.addEventListener('change', applyColorScheme)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider locale={enUS}>
      <App />
    </ConfigProvider>
  </StrictMode>,
)
