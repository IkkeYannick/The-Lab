import { useEffect, useState } from "react";
import { Link } from "react-router";

const TechnicalDrawingsPage = () => {
    const [drawings, setDrawings] = useState<{ name: string; url: string }[]>([]);
    const [searchTerm, setSearchTerm] = useState(""); // 🔍 Search state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const BACKEND_URL = "https://gcs-signed-url-416379081464.europe-west1.run.app";

    useEffect(() => {
        fetch(`${BACKEND_URL}/getDrawings`)
            .then((res) => res.json())
            .then((data) => {
                setDrawings(data);
                setLoading(false);
            })
            .catch((err) => {
                setError("Error fetching technical drawings. Please try again." + err);
                setLoading(false);
            });
    }, []);

    const handleDelete = (fileName: string) => {
        fetch(`${BACKEND_URL}/deleteFile`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileName }),
        })
            .then(() => {
                setDrawings((prevDrawings) => prevDrawings.filter((drawing) => drawing.name !== fileName));
            })
            .catch((err) => {
                setError("Error deleting file. Please try again." + err);
            });
    };

    const filteredDrawings = drawings.filter(drawing =>
        drawing.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Technical Drawings</h2>
                <Link to="/" className="text-blue-500 hover:underline">← Back to Home</Link>
                <input
                    type="text"
                    placeholder="Search for a PDF..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md mt-4 bg-gray-100 text-gray-800 placeholder-gray-500"
                />

                {loading ? (
                    <p className="text-gray-500 mt-4">Loading technical drawings...</p>
                ) : error ? (
                    <p className="text-red-500 mt-4">{error}</p>
                ) : filteredDrawings.length === 0 ? (
                    <p className="text-gray-500 mt-4">No matching technical drawings found.</p>
                ) : (
                    <ul className="space-y-4 mt-4">
                        {filteredDrawings.map((drawing) => (
                            <li key={drawing.name} className="border p-4 rounded-md shadow-sm">
                                <p className="text-sm text-gray-600">{drawing.name}</p>
                                <div className="flex justify-between items-center mt-2">
                                    <a href={drawing.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                        Open Drawing
                                    </a>
                                    <button onClick={() => handleDelete(drawing.name)} className="text-red-500 hover:underline">
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default TechnicalDrawingsPage;
