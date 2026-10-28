import { useUser } from '@clerk/react'
import { Navigate, useLocation } from 'react-router-dom'
import { BarLoader } from 'react-spinners'

const ProtectedRoute = ({ children }) => {

    const { isSignedIn , user , isLoaded } = useUser()

    const { pathname } = useLocation()

    // Waiting for clerk
    if (!isLoaded) {
        return (
            <div className="flex justify-center mt-10">
                <BarLoader
                    width="100%"
                    color="#36d7b7"
                />
            </div>
        )
    }
    
    // User is not logged in
    if (!isSignedIn) {
        return <Navigate to="/?sign-in=true" replace />
    }

    // User is logged in but hasn't selected a role
    if (
        !user?.unsafeMetadata?.role &&
        pathname !== "/onboarding"
    ) {
        return <Navigate to="/onboarding" replace />
    }

    return children
}

export default ProtectedRoute
