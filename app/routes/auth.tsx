import React, {useEffect} from 'react'
import {usePuterStore} from "~/lib/puter";
import {useLocation, useNavigate} from "react-router";

export const meta = () => [
    {title: 'ResumeID | Auth'},
    {name: 'description', content: 'Log into your account'}
]

const Auth = () => {
    const {isLoading, auth} = usePuterStore();
    const navigate = useNavigate();

    useEffect(() => {
        if(auth.isAuthenticated){
            alert("🎉 You are now ready to upload!");
            navigate('/');
        }
    }, [auth.isAuthenticated, navigate]);

    return (
        <main className="bg-[url('/image/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center h-full">
            <div className="gradient-border shadow-lg">
                <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1>Welcome To AiAna</h1>
                        <h2>Sign in to get a job</h2>
                    </div>
                    <div>
                        {isLoading ? (
                            <button className="auth-button animate-pulse" disabled>
                                <p>Signing you in...</p>
                            </button>
                        ) : (
                            <>
                                {auth.isAuthenticated ? (
                                    <div className="text-center">
                                        <p className="mb-4 text-green-600">✅ You are already signed in!</p>
                                        <p className="text-sm text-gray-600">
                                            Use the "Sign out" button in the navigation bar to log out.
                                        </p>
                                    </div>
                                ) : (
                                    <button className="auth-button" onClick={auth.signIn}>
                                        Sign in
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    )
}

export default Auth;