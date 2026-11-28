import React from 'react';
import { Button } from './components/ui/button'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './layout/app-layout';
import LandingPage from './pages/landingPage';
import Onboarding from './pages/onboarding';
import JobListing from './pages/job-listing';
import JobPage from './pages/job';
import PostJob from './pages/PostJob';
import SavedJobs from './pages/SavedJobs';
import MyJobs from './pages/MyJobs';
import { ThemeProvider } from './components/theme-provider';
import ProtectedRoute from './components/ProtectedRoute';

const router = createBrowserRouter([
  {
    element: <AppLayout/>,
    children: [
      {
        path: '/',
        element: <LandingPage/>
      },
      {
        path: '/onboarding',
        element: (
          <ProtectedRoute>
            <Onboarding/>
          </ProtectedRoute>
        )
      },
      {
        path: '/jobs',
        element: (
          <ProtectedRoute>
            <JobListing/>
          </ProtectedRoute>
        )
      },
      {
        path: '/job/:id',
        element: (
          <ProtectedRoute>
            <JobPage/>
          </ProtectedRoute>
        )
      },
      {
        path: '/post-job',
        element: (
          <ProtectedRoute>
            <PostJob/>
          </ProtectedRoute>
        )
      },
      {
        path: '/saved-jobs',
        element: (
          <ProtectedRoute>
            <SavedJobs/>
          </ProtectedRoute>
        )
      },
      {
        path: '/my-jobs',
        element: (
          <ProtectedRoute>
            <MyJobs/>
          </ProtectedRoute>
        )
      },
    ]
  }
])

const App = () => {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme' >
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
