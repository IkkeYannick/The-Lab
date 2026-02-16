import React, {useEffect} from 'react';
import CallCard from '../../components/CallCard';
import useCalls from "../../hooks/useCalls.ts";


const HelpTechnicianPage: React.FC = () => {

    const {loading, error, waitingCalls, fetchWaitingCalls} = useCalls();

    useEffect(() => {
        fetchWaitingCalls(); // Initial fetch
        const intervalId = setInterval(fetchWaitingCalls, 5000); // Fetch every 5 seconds

        return () => clearInterval(intervalId); // Cleanup interval on unmount
    }, []);

    return (
        <div className="p-4 space-y-4 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Waiting Calls</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : waitingCalls.length > 0 ? (
                <ul className="space-y-2">
                    {waitingCalls.map(call => (
                        <CallCard key={call.id} call={call}/>
                    ))}
                </ul>
            ) : (
                <p>No waiting calls available.</p>
            )}
        </div>
    );
};

export default HelpTechnicianPage;