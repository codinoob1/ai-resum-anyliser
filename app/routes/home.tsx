// @ts-ignore
import type { Route } from "../.react-router/types/app/routes/+types";
import Navbar from "~/components/Navbar";
import { resumes } from "../../Constantss";
import ResumeCard from "~/components/ResumeCard";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter"; // kept, in case used later

// ✅ Meta info is simplified & cleaned
export function meta({}: Route.MetaArgs) {
    return [
        { title: "AI-Analyzer", description: "AI-powered resume analyzer" },
        { name: "description", content: "Track your application & get resume feedback" },
    ];
}

export default function Home() {
    // ✅ useEffect + useNavigate placeholders removed since unused (kept import if you plan to use them)

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <section className="p-8 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-4">
                        Track Your Application & Resume Rating
                    </h1>
                    <h2 className="text-xl text-gray-600 mb-8">
                        Review your submission and check AI-powered feedback
                    </h2>
                </div>
            </section>

            {/* Resume Cards */}
            {resumes?.length > 0 && (
                <div className="grid grid-cols-1 gap-6 p-8 md:grid-cols-2 lg:grid-cols-3">
                    {resumes.map((resume) => (
                        <ResumeCard key={resume.id} resume={resume} />
                    ))}
                </div>
            )}
        </main>
    );
}
