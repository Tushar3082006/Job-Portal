import { useUser } from '@clerk/react'
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const Onboarding = () => {

  const { user, isLoaded, isSignedIn } = useUser();

console.log("Loaded:", isLoaded);
console.log("Signed in:", isSignedIn);
console.log("USER:", user);
console.log("UNSAFE METADATA:", user?.unsafeMetadata);

  const navigate = useNavigate()

  const handleRoleSelection = async (role) => {
    try {
      await user.updateMetadata({
          unsafeMetadata: {
            role: role,
          },
      });

      navigate(role === "recruiter" ? "/post-job" : "/jobs");
    } catch (err) {
      console.error("Error updating role:", err);
    }
  }

  useEffect(() => {
    if (user?.unsafeMetadata?.role) {
      navigate(user.unsafeMetadata.role === 'recruiter'? '/post-job': '/jobs')
    }
  }, [user, navigate])

  if(!isLoaded){
    return <BarLoader className='mb-4' width='100%' color="#36d7b7"/>
  }

  return (
    <div className='flex flex-col items-center justify-center mt-32'>
      <h2 className='gradient-title font-extrabold text-7xl sm:text-8xl tracking-tighter'>
        I am a .....
      </h2> 

      <div className='mt-10 grid grid-cols-2 gap-4 w-full md:px-40'>
        
        <Button 
          variant='blue' 
          className='h-36 text-2xl'
          onClick={() => handleRoleSelection("candidate")}
        >
          Candidate
        </Button>
        <Button 
          variant='destructive' 
          className='h-36 text-2xl'
          onClick={() => handleRoleSelection("recruiter")}
        >
          Recruiter
        </Button>

      </div>
    </div>
  )
}

export default Onboarding
