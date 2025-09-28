import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import {Link} from "react-router";

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

interface Feedback {
    overallScore: number;
    toneAndStyle: {
        score: number;
        feedback: string;
    };
    content: {
        score: number;
        feedback: string;
    };
    structure: {
        score: number;
        feedback: string;
    };
    skills: {
        score: number;
        feedback: string;
    };
    ATS: {
        score: number;
        suggestions: Array<{type: "good" | "improve"; tip: string;}>;
    };
}

interface ResumeCardProps {
    resume: Resume;
}

const Category = ({ title, score }: { title: string, score: number }) => {
    const textColor = score > 70 ? 'text-green-600'
        : score > 49
            ? 'text-yellow-600' : 'text-red-600';

    return (
        <div className="resume-summary">
            <div className="category">
                <div className="flex flex-row gap-2 items-center justify-center">
                    <p className="text-lg">{title}</p>
                    <ScoreBadge score={score} />
                </div>
                <p className="text-lg">
                    <span className={textColor}>{score}</span>/100
                </p>
            </div>
        </div>
    )
}

const ResumeCard = ({ resume }: ResumeCardProps) => {
    const [resumeImageURL, setResumeImageURL] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const {fs} = usePuterStore();

    // Transform feedback data if needed
    const transformFeedbackData = (rawFeedback: any): Feedback | null => {
        if (!rawFeedback) return null;

        // If feedback is already in correct format, return as-is
        if (rawFeedback.overallScore !== undefined) {
            return rawFeedback;
        }

        // Transform from raw API format
        const extractScore = (scoreString: string | number) => {
            if (typeof scoreString === 'number') return scoreString;
            if (typeof scoreString === 'string') {
                const match = scoreString.match(/(\d+)/);
                return match ? parseInt(match[1]) : 0;
            }
            return 0;
        };

        return {
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
                suggestions: (rawFeedback.recommendations || []).map((rec: string) => ({
                    type: "improve" as const,
                    tip: rec
                }))
            }
        };
    };

    const transformedFeedback = transformFeedbackData(resume.feedback);

    useEffect(() => {
        const loadResumeImage = async () => {
            try {
                setIsLoading(true);
                if (!resume.imagePath) {
                    setIsLoading(false);
                    return;
                }

                const blob = await fs.read(resume.imagePath);
                if (!blob) {
                    console.log('Could not load resume image for:', resume.id);
                    setIsLoading(false);
                    return;
                }

                const url = URL.createObjectURL(blob);
                setResumeImageURL(url);
            } catch (error) {
                console.error('Error loading resume image:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadResumeImage();

        // Cleanup URL when component unmounts
        return () => {
            if (resumeImageURL) {
                URL.revokeObjectURL(resumeImageURL);
            }
        };
    }, [resume.imagePath, fs]);

    // Safety check - show basic card if no feedback
    if (!transformedFeedback) {
        return (
            <div className="bg-white rounded-2xl shadow-md w-full p-6 border">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold">{resume.fileName || 'Untitled Resume'}</h3>
                            <p className="text-sm text-gray-500">
                                {resume.jobTitle || 'No job title specified'}
                            </p>
                            <p className="text-xs text-gray-400">
                                {resume.createdAt ? new Date(resume.createdAt).toLocaleDateString() : 'Date unknown'}
                            </p>
                        </div>
                        <Link
                            to={`/resume/${resume.id}`}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            View Details
                        </Link>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-yellow-700">Analysis pending or incomplete</p>
                    </div>
                </div>
            </div>
        );
    }

    // Extract scores safely with fallbacks
    const overallScore = transformedFeedback.overallScore || 0;
    const toneScore = transformedFeedback.toneAndStyle?.score || 0;
    const contentScore = transformedFeedback.content?.score || 0;
    const structureScore = transformedFeedback.structure?.score || 0;
    const skillsScore = transformedFeedback.skills?.score || 0;

    return (
        <div className="bg-white rounded-2xl shadow-md w-full border hover:shadow-lg transition-shadow">
            <div className="flex flex-row">
                {/* Left side - Resume preview */}
                <div className="w-1/3 p-4">
                    {isLoading ? (
                        <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse"></div>
                    ) : resumeImageURL ? (
                        <Link to={`/resume/${resume.id}`}>
                            <img
                                src={resumeImageURL}
                                alt="Resume preview"
                                className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                            />
                        </Link>
                    ) : (
                        <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                            <p className="text-gray-500 text-sm">No preview available</p>
                        </div>
                    )}
                </div>

                {/* Right side - Resume details and scores */}
                <div className="w-2/3 p-4">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-bold">{resume.fileName || 'Untitled Resume'}</h3>
                            <p className="text-sm text-gray-600">
                                {resume.jobTitle || 'No job title specified'}
                            </p>
                            <p className="text-xs text-gray-400">
                                {resume.createdAt ? new Date(resume.createdAt).toLocaleDateString() : 'Date unknown'}
                            </p>
                        </div>
                        <Link
                            to={`/resume/${resume.id}`}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            View Full Analysis
                        </Link>
                    </div>

                    <div className="flex flex-row items-center gap-6 mb-4">
                        <ScoreGauge score={overallScore} />
                        <div className="flex flex-col gap-1">
                            <h4 className="text-lg font-semibold">Overall Score</h4>
                            <p className="text-sm text-gray-500">
                                Based on AI analysis
                            </p>
                        </div>
                    </div>

                    {/* Compact categories */}
                    <div className="grid grid-cols-2 gap-3">
                        <Category title="Tone & Style" score={toneScore} />
                        <Category title="Content" score={contentScore} />
                        <Category title="Structure" score={structureScore} />
                        <Category title="Skills" score={skillsScore} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeCard;