// @ts-ignore
import type {Route} from "../.react-router/types/app/routes/+types";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router";
import {usePuterStore} from "~/lib/puter";

// Define types inline
interface Resume {
    id: string;
    name?: string;
    fileName?: string;
    uploadDate?: string;
    feedback?: any;
    resumePath?: string;
    imagePath?: string;
    jobTitle?: string;
    jobDescription?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface KVItem {
    key: string;
    value: string;
    createdAt?: string;
    updatedAt?: string;
}

// ✅ Meta info is simplified & cleaned
export function meta({}: Route.MetaArgs) {
    return [
        {title: "AI-Analyzer", description: "AI-powered resume analyzer"},
        {name: "description", content: "Track your application & get resume feedback"},
    ];
}

export default function Home() {
    const {auth, kv} = usePuterStore();
    const navigate = useNavigate();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loadingResumes, setLoadingResumes] = useState(false);

    useEffect(() => {
        const loadResumes = async () => {
            try {
                setLoadingResumes(true);

                const resumeItems = (await kv.list('resume:*', true)) as KVItem[];
                console.log('Loaded resume items:', resumeItems);

                if (!resumeItems) {
                    setResumes([]);
                    return;
                }

                const parsedResumes: Resume[] = resumeItems
                    .map((resumeItem) => {
                        try {
                            const parsed = JSON.parse(resumeItem.value) as Resume;
                            // Ensure the resume has an ID (use key if not present)
                            if (!parsed.id) {
                                parsed.id = resumeItem.key.replace('resume:', '');
                            }
                            return parsed;
                        } catch (parseError) {
                            console.error('Error parsing resume:', parseError);
                            return null;
                        }
                    })
                    .filter((resume): resume is Resume => resume !== null);

                console.log('Parsed resumes:', parsedResumes);
                setResumes(parsedResumes);
            } catch (error) {
                console.error('Error loading resumes:', error);
                setResumes([]);
            } finally {
                setLoadingResumes(false);
            }
        };

        loadResumes();
    }, [kv]);

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar/>

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Track Your Applications & Resume Ratings</h1>
                    {!loadingResumes && resumes.length === 0 ? (
                        <h2>No resumes found. Upload your first resume to get feedback.</h2>
                    ) : (
                        <h2>Review your submissions and check AI-powered feedback.</h2>
                    )}
                </div>

                {loadingResumes && (
                    <div className="flex flex-col items-center justify-center">
                        <img src="/images/resume-scan-2.gif" className="w-[200px]" />
                    </div>
                )}

                {!loadingResumes && resumes.length > 0 && (
                    <div className="resumes-section">
                        {resumes.map((resume) => (
                            <ResumeCard key={resume.id} resume={resume} />
                        ))}
                    </div>
                )}

                {!loadingResumes && resumes.length === 0 && (
                    <div className="flex flex-col items-center justify-center mt-10 gap-4">
                        <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
                            Upload Resume
                        </Link>
                    </div>
                )}
            </section>
        </main>
    );
}