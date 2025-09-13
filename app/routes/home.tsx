import type { Route } from "../.react-router/types/app/routes/+types";
import Navbar from "~/components/Navbar"
import { resumes } from "../../Constantss";
import {callback} from "fdir/dist/api/async";
import ResumeCard from "~/components/ResumeCard"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Ai-Anylizer", description: "Ai-Anylizer for resumea " },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
      <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
        <Navbar/>

        <section className="p-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Track Your application & Resume Rating</h1>
            <h2 className="text-xl text-gray-600 mb-8">Review your submission and check AI-power feedback</h2>
          </div>
        </section>
        {resumes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
              {resumes.map((resume) => (
                  <ResumeCard key={resume.id} resume={resume} />
              ))}
            </div>

        )}

      </main>
  );
}
