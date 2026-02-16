import React from 'react';
import {Timestamp} from 'firebase/firestore';
import {Link} from "react-router";

interface CallCardProps {
    call: {
        id: string;
        status: string;
        callId: string;
        date: Timestamp;
        technician: string;
    };
}

const CallCard: React.FC<CallCardProps> = ({call}) => {
    const formatWaitingTime = (date: Timestamp) => {
        const now = new Date();
        const callDate = date.toDate();
        const diffMs = now.getTime() - callDate.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHrs = Math.floor(diffMins / 60);
        const mins = diffMins % 60;
        return `${diffHrs} hours and ${mins} minutes`;
    };

    return (
        <div className="p-4 border rounded-md shadow-sm flex flex-col space-y-2 bg-white">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-lg font-medium text-black">Caller email: {call.technician}</p>
                    {call.date ? (
                        <p className="text-sm text-gray-500">
                            Date: {call.date.toDate().toLocaleString()}
                        </p>
                    ) : null}
                    <p className="text-sm text-gray-500">Status: {call.status}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500 mb-2">Waiting for: {formatWaitingTime(call.date)}</p>
                    <Link to={`/MasterCallPage/${call.id}`}
                          className="btn primary bg-blue-500 text-white py-2 px-4 rounded-lg">
                        View Call
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CallCard;