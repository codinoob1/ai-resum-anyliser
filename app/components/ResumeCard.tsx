import Navbar from "~/components/Navbar";
import { Link } from "react-router";
import { resumes } from "../../Constantss";
import ScoreCircle from "~/components/ScoreCircle";

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: Resume }) => {
    return (
        <Link
            to={`/resume/${id}`}
            className="block bg-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
        >
            <div className="p-4 flex justify-between items-start">
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <h2 className="text-black font-bold break-words text-lg">
                        {companyName}
                    </h2>
                    <h3 className="text-gray-700 font-semibold break-words">
                        {jobTitle}
                    </h3>
                </div>
                <div className="flex shrink-0 ml-4">
                    <ScoreCircle score={feedback.overallScore} />
                </div>
            </div>

            <div className="relative overflow-hidden">
                <div className="w-full h-full">
                    <img
                        src={imagePath}
                        alt="Resume preview"
                        className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
                    />
                </div>
            </div>
        </Link>

    );
};

export default ResumeCard;