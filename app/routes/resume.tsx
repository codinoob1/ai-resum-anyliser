import {Link, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export const meta = () => ([
    { title: 'Resumind | Review ' },
    { name: 'description', content: 'Detailed overview of your resume' },
])

const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<any>(null);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading])

    // Transform the API response to match component expectations
    const transformFeedbackData = (rawFeedback: any) => {
        if (!rawFeedback) return null;

        // console.log('Raw feedback from API:', rawFeedback);

        // Extract numeric score from string like "30/100"
        const extractScore = (scoreString: string | number) => {
            if (typeof scoreString === 'number') return scoreString;
            if (typeof scoreString === 'string') {
                const match = scoreString.match(/(\d+)/);
                return match ? parseInt(match[1]) : 0;
            }
            return 0;
        };

        // Convert recommendations to ATS suggestions format
        const convertToATSSuggestions = (recommendations: string[]) => {
            return recommendations.map(rec => ({
                type: "improve" as const,
                tip: rec
            }));
        };

        // Transform the data to match your component structure
        const transformed = {
            overallScore: extractScore(rawFeedback.overall_score || "0"),
            toneAndStyle: {
                score: rawFeedback.overall_rating ? rawFeedback.overall_rating * 20 : 50,
                feedback: rawFeedback.summary || ""
            },
            content: {
                score: rawFeedback.job_match_percentage || 15,
                feedback: rawFeedback.strengths?.join(', ') || ""
            },
            structure: {
                score: rawFeedback.ats_compatibility ? rawFeedback.ats_compatibility * 10 : 60,
                feedback: "Resume structure and ATS compatibility"
            },
            skills: {
                score: rawFeedback.job_match_percentage || 15,
                feedback: rawFeedback.missing_keywords?.join(', ') || ""
            },
            ATS: {
                score: rawFeedback.ats_compatibility ? rawFeedback.ats_compatibility * 10 : 60,
                suggestions: convertToATSSuggestions(rawFeedback.recommendations || [])
            },
            // Keep original data for Details component
            strengths: rawFeedback.strengths || [],
            weaknesses: rawFeedback.weaknesses || [],
            recommendations: rawFeedback.recommendations || [],
            missing_keywords: rawFeedback.missing_keywords || [],
            key_concerns: rawFeedback.key_concerns || [],
            job_match_percentage: rawFeedback.job_match_percentage || 0
        };

        // console.log('Transformed feedback:', transformed);
        return transformed;
    };

    useEffect(() => {
        const loadResume = async () => {
            try {
                setIsDataLoading(true);
                const resume = await kv.get(`resume:${id}`);

                if(!resume) {
                    setIsDataLoading(false);
                    return;
                }

                const data = JSON.parse(resume);
                // console.log('Loaded resume data:', data);

                const resumeBlob = await fs.read(data.resumePath);
                if(!resumeBlob) {
                    setIsDataLoading(false);
                    return;
                }

                const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
                const resumeUrl = URL.createObjectURL(pdfBlob);
                setResumeUrl(resumeUrl);

                const imageBlob = await fs.read(data.imagePath);
                if(!imageBlob) {
                    setIsDataLoading(false);
                    return;
                }
                const imageUrl = URL.createObjectURL(imageBlob);
                setImageUrl(imageUrl);

                // Transform and set feedback
                const transformedFeedback = transformFeedbackData(data.feedback);
                //console.log('Setting transformed feedback:', transformedFeedback);
                setFeedback(transformedFeedback);

            } catch (error) {
                console.error('Error loading resume:', error);
                alert(error);
            } finally {
                setIsDataLoading(false);
            }
        }

        if (id) {
            loadResume();
        }
    }, [id]);

    // Show loading while data is being fetched
    if (isDataLoading) {
        return (
            <main className="!pt-0">
                <nav className="resume-nav">
                    <Link to="/" className="back-button">
                        <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
                        <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                    </Link>
                </nav>
                <div className="flex flex-row w-full max-lg:flex-col-reverse">
                    <section className="feedback-section bg-[url('/images/bg-small.svg') bg-cover h-[100vh] sticky top-0 items-center justify-center">
                        <div className="animate-pulse">
                            <div className="gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit bg-gray-200 rounded-2xl"></div>
                        </div>
                    </section>
                    <section className="feedback-section">
                        <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
                        <img src="/images/resume-scan-2.gif" className="w-full" />
                    </section>
                </div>
            </main>
        );
    }

    return (
        <main className="!pt-0">
            <nav className="resume-nav">
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
                    <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                </Link>
            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className="feedback-section bg-[url('/images/bg-small.svg') bg-cover h-[100vh] sticky top-0 items-center justify-center">
                    {imageUrl && resumeUrl && (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={imageUrl}
                                    className="w-full h-full object-contain rounded-2xl"
                                    title="resume"
                                />
                            </a>
                        </div>
                    )}
                </section>
                <section className="feedback-section">
                    <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
                    {feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedback={feedback} />
                            <ATS
                                score={feedback.ATS?.score || 0}
                                suggestions={feedback.ATS?.suggestions || []}
                            />
                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        <div className="text-center">
                            <img src="/images/resume-scan-2.gif" className="w-full" />
                            <p className="mt-4 text-gray-600">Loading your resume analysis...</p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}

export default Resume