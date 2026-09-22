import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { AppProviders } from './app/providers'
import { startResetOnReturn } from './app/resetOnReturn'
import { router } from './app/router'
import { dismissSplash } from './app/splash'
import './styles/index.css'

startResetOnReturn()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
)

dismissSplash()
