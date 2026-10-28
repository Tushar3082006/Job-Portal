import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { BriefcaseBusiness, Heart, PenBox } from "lucide-react";

import { Show, SignIn, UserButton, useUser } from "@clerk/react";

const Header = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { user, isSignedIn } = useUser();

  // Check URL
  const showSignIn = searchParams.get("sign-in") === "true";

  // Login button
  const handleLogin = () => {
    setSearchParams({
      "sign-in": "true",
    });
  };

  // Close login modal
  const closeSignIn = () => {
    setSearchParams({});
  };

  // After successful login
  // remove ?sign-in=true
  useEffect(() => {
    if (isSignedIn && showSignIn) {
      setSearchParams({});
    }
  }, [isSignedIn, showSignIn, setSearchParams]);

  return (
    <>
      {/* HEADER */}

      <nav className="py-4 flex justify-between items-center">
        {/* LOGO */}
        <Link to="/">
          <img src="/logo.png" className="h-20" alt="Hirrd Logo" />
        </Link>

        {/* RIGHT SIDE */}

        <div>
          {/* LOGGED OUT */}

          <Show when="signed-out">
            <Button variant="outline" onClick={handleLogin}>
              Login
            </Button>
          </Show>

          {/* LOGGED IN */}

          <Show when="signed-in">
            <div className="flex items-center gap-4">
              {/* POST JOB */}

              {user?.unsafeMetadata?.role === "recruiter" && (
                <Link to="/post-job">
                  <Button variant="destructive" className="rounded-full">
                    <PenBox size={20} className="mr-2" />
                    Post a Job
                  </Button>
                </Link>
              )}

              {/* USER BUTTON */}

              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="My Jobs"
                    labelIcon={<BriefcaseBusiness size={15} />}
                    href="/my-jobs"
                  />

                  <UserButton.Link
                    label="Saved Jobs"
                    labelIcon={<Heart size={15} />}
                    href="/saved-jobs"
                  />
                </UserButton.MenuItems>
              </UserButton>
            </div>
          </Show>
        </div>
      </nav>

      {/* SIGN IN */}

      {showSignIn && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={closeSignIn}
        >
          {/* Prevent closing when clicking inside */}
          <div onClick={(e) => e.stopPropagation()}>
            <SignIn
              forceRedirectUrl="/onboarding"
              signUpForceRedirectUrl="/onboarding"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
