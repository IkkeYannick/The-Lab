import { useEffect, useState } from "react";
import {Link} from "react-router";

const RecordingsPage = () => {
    const [recordings, setRecordings] = useState<{ name: string; url: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const BACKEND_URL = "https://gcs-signed-url-416379081464.europe-west1.run.app";

    useEffect(() => {
        fetch(`${BACKEND_URL}/getRecordings`)
            .then((res) => res.json())
            .then((data) => {
                setRecordings(data);
                setLoading(false);
            })
            .catch((err) => {
                setError("Error fetching recordings. Please try again." +err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="p-6 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recordings</h2>
                <Link to="/" className="text-blue-500 hover:underline">← Back to Home</Link>

                {loading ? (
                    <p className="text-gray-500">Loading recordings...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : recordings.length === 0 ? (
                    <p className="text-gray-500">No recordings found.</p>
                ) : (
                    <ul className="space-y-4 mt-4">
                        {recordings.map((recording) => (
                            <li key={recording.name} className="border p-4 rounded-md shadow-sm">
                                <p className="text-sm text-gray-600">{recording.name}</p>
                                <video controls className="w-full mt-2 rounded-md">
                                    <source src={recording.url} type="video/webm" />
                                    Your browser does not support the video tag.
                                </video>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default RecordingsPage;
