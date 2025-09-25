const Details = ({ feedback }: { feedback: any }) => {
    if (!feedback) {
        return (
            <div className="bg-white rounded-2xl shadow-md w-full p-4">
                <p className="text-gray-500">No details available</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-md w-full p-6">
            <h3 className="text-2xl font-bold mb-6">Detailed Analysis</h3>

            {/* Strengths */}
            {feedback.strengths && feedback.strengths.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-lg font-semibold text-green-600 mb-3">✅ Strengths</h4>
                    <ul className="list-disc list-inside space-y-2">
                        {feedback.strengths.map((strength: string, index: number) => (
                            <li key={index} className="text-gray-700">{strength}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Weaknesses */}
            {feedback.weaknesses && feedback.weaknesses.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-lg font-semibold text-red-600 mb-3">❌ Areas for Improvement</h4>
                    <ul className="list-disc list-inside space-y-2">
                        {feedback.weaknesses.map((weakness: string, index: number) => (
                            <li key={index} className="text-gray-700">{weakness}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Key Concerns */}
            {feedback.key_concerns && feedback.key_concerns.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-lg font-semibold text-orange-600 mb-3">⚠️ Key Concerns</h4>
                    <ul className="list-disc list-inside space-y-2">
                        {feedback.key_concerns.map((concern: string, index: number) => (
                            <li key={index} className="text-gray-700">{concern}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Missing Keywords */}
            {feedback.missing_keywords && feedback.missing_keywords.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-lg font-semibold text-blue-600 mb-3">🔍 Missing Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                        {feedback.missing_keywords.map((keyword: string, index: number) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                                {keyword}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommendations */}
            {feedback.recommendations && feedback.recommendations.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-lg font-semibold text-purple-600 mb-3">💡 Recommendations</h4>
                    <ul className="list-disc list-inside space-y-2">
                        {feedback.recommendations.map((recommendation: string, index: number) => (
                            <li key={index} className="text-gray-700">{recommendation}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Details;