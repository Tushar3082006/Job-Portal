import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/react'
import './index.css'
import App from './App.jsx'
import { shadesOfPurple } from '@clerk/ui/themes'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if(!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable key")
}

createRoot(document.getElementById('root')).render(
   <StrictMode>
    <ClerkProvider 
    publishableKey={PUBLISHABLE_KEY}
    afterSignOutUrl='/'
    appearance={
      {
        theme: shadesOfPurple
      }
    }
    >
      <App />
    </ClerkProvider>
  </StrictMode>,
)
