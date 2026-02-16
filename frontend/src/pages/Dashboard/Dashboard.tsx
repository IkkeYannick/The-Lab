import React, {useEffect, useState} from 'react';
import {useFieldTechnician} from "../../hooks/useFieldTechnician";
import {useMasterTechnician} from '../../hooks/useMasterTechnician';
import useCalls from "../../hooks/useCalls";
import {Activity, Calendar, CheckCircle, Clock, PhoneCall, UserCheck} from "lucide-react";
import {Link} from "react-router";

// Add type definitions for better code quality
interface Technician {
    name: string;
    email: string;
    status?: 'available' | 'busy' | 'offline';
    activeCalls?: number;
}

interface Call {
    id: string;
    callId: string;
    technician: string;
    status: string;
    startTime?: string;
    duration?: number;
    date: any;
    priority?: 'low' | 'medium' | 'high';
}

const Dashboard: React.FC = () => {
    const {fieldTechnicians, loading: fieldLoading, error: fieldError} = useFieldTechnician();
    const {masterTechnicians, loading: masterLoading, error: masterError} = useMasterTechnician();
    const {
        loading,
        error,
        fetchWaitingCalls,
        waitingCalls,
        allCalls,
        callsToday,
        fetchCallsToday,
        fetchAllCalls
    } = useCalls();

    // Add states for dashboard metrics
    const [totalActiveCalls, setTotalActiveCalls] = useState<number>(0);
    const [avgWaitTime, setAvgWaitTime] = useState<number>(0);
    const [availableTechs, setAvailableTechs] = useState<number>(0);

    useEffect(() => {
        // Initial fetch
        fetchWaitingCalls();
        fetchAllCalls();
        fetchCallsToday();
        const intervalId = setInterval(() => {
            fetchWaitingCalls();
            fetchAllCalls();
        }, 5000); // Fetch every 5 seconds

        return () => clearInterval(intervalId); // Cleanup interval on unmount
    }, []);

    useEffect(() => {
        // Calculate dashboard metrics when data changes
        if (allCalls) {
            setTotalActiveCalls(allCalls.filter(call => call.status === 'ongoing').length);
            setAvailableTechs(masterTechnicians?.filter(tech => tech.isAvailable).length || 0);

            // Simulate average wait time calculation
            const waitTimes = allCalls.map(call => (call.duration || 0) / 60000); // Convert milliseconds to minutes
            const avgTime = waitTimes.length > 0
                ? waitTimes.reduce((sum, time) => sum + time, 0) / waitTimes.length
                : 0;
            setAvgWaitTime(Math.round(avgTime));
        }

    }, [allCalls, fieldTechnicians, masterTechnicians]);

    // Helper function to get status color
    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'available':
                return 'text-green-500';
            case 'busy':
                return 'text-amber-500';
            case 'offline':
                return 'text-gray-400';
            default:
                return 'text-gray-500';
        }
    };

    // Helper function to get priority badge
    const getPriorityBadge = (priority?: string) => {
        switch (priority) {
            case 'high':
                return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">High</span>;
            case 'medium':
                return <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">Medium</span>;
            case 'low':
                return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Low</span>;
            default:
                return null;
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen bg-secondary rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-6 ">
                <h1 className="text-3xl font-bold text-gray-200">Service Dashboard</h1>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{new Date().toLocaleString()}</span>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        Refresh
                    </button>
                </div>
            </div>

            {/* Dashboard Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-primary rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 mr-4">
                            <PhoneCall className="h-6 w-6 text-blue-600"/>
                        </div>
                        <div>
                            <p className="text-gray-300 text-sm">Active Calls</p>
                            <p className="text-2xl font-bold text-white">{totalActiveCalls}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-primary rounded-lg shadow-md p-6 border-l-4 border-green-500">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 mr-4">
                            <UserCheck className="h-6 w-6 text-green-600"/>
                        </div>
                        <div>
                            <p className="text-gray-300 text-sm">Available Master Technicians</p>
                            <p className="text-2xl font-bold text-white">{availableTechs}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-primary rounded-lg shadow-md p-6 border-l-4 border-amber-500">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-amber-100 mr-4">
                            <Clock className="h-6 w-6 text-amber-600"/>
                        </div>
                        <div>
                            <p className="text-gray-300 text-sm">Avg Call Duration</p>
                            <p className="text-2xl font-bold text-white">{avgWaitTime} min</p>
                        </div>
                    </div>
                </div>

                <div className="bg-primary rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100 mr-4">
                            <CheckCircle className="h-6 w-6 text-purple-600"/>
                        </div>
                        <div>
                            <p className="text-gray-300 text-sm">Completed in the last 24h</p>
                            <p className="text-2xl font-bold text-white">{callsToday}</p>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Technicians Panel */}
                    <div className="bg-primary rounded-lg shadow-md overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b">
                            <div className="flex items-center">
                                <UserCheck className="h-5 w-5 text-blue-600 mr-2"/>
                                <h2 className="text-xl font-semibold text-gray-200">Technicians</h2>
                            </div>
                            <div className="text-sm text-gray-500">
                                Total: {(fieldTechnicians?.length || 0) + (masterTechnicians?.length || 0)}
                            </div>
                        </div>

                        {fieldLoading && masterLoading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            </div>
                        ) : fieldError && masterError ? (
                            <div className="p-4 text-red-500">{fieldError}</div>
                        ) : (fieldTechnicians?.length || 0) + (masterTechnicians?.length || 0) > 0 ? (
                            <div className="overflow-y-auto h-96 scrollbar-thin ">
                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {masterTechnicians?.map((technician: Technician) => (
                                        <div key={technician.email}
                                             className="bg-secondary p-4 border rounded-md shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center">
                                                        <p className="text-lg font-medium text-gray-200">{technician.name}</p>
                                                        <span
                                                            className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Master</span>
                                                    </div>
                                                    <p className="text-sm text-gray-200">{technician.email}</p>
                                                </div>
                                                <span className={`text-sm ${getStatusColor(technician.status)}`}> Master Tech </span>
                                            </div>
                                            <div className="mt-2 flex items-center text-sm">
                                                <Activity className="h-4 w-4 mr-1 text-blue-500"/>
                                                <span className={"text-gray-400"}>{technician.activeCalls || 0} active calls</span>
                                            </div>
                                        </div>
                                    ))}
                                    {fieldTechnicians?.map((technician: Technician) => (
                                        <div key={technician.email}
                                             className="bg-secondary p-4 border rounded-md shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-lg font-medium text-gray-200">{technician.name}</p>
                                                    <p className="text-sm text-gray-400">{technician.email}</p>
                                                </div>
                                                <span className={`text-sm ${getStatusColor(technician.status)}`}>
                          Field Tech
                        </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <UserCheck className="h-12 w-12 mx-auto text-gray-400 mb-4"/>
                                <p>No technicians available at the moment.</p>
                            </div>
                        )}
                    </div>

                    {/* Waiting Calls Panel */}
                    <div className="bg-primary rounded-lg shadow-md overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b">
                            <div className="flex items-center">
                                <PhoneCall className="h-5 w-5 text-red-600 mr-2"/>
                                <h2 className="text-xl font-semibold text-gray-200">Waiting Calls</h2>
                            </div>
                            <div className="text-sm text-gray-500">
                                Total: {waitingCalls?.length || 0}
                            </div>
                        </div>

                        {waitingCalls?.length > 0 ? (
                            <div className=" overflow-y-auto h-96 scrollbar-thin">
                                <div className="p-4 space-y-4">
                                    {waitingCalls.map((call: Call) => (
                                        <div key={call.id}
                                             className="bg-secondary p-4 border rounded-md shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex justify-between">
                                                <div>
                                                    <p className="text-lg font-medium text-gray-300">Call #{call.id}</p>
                                                    <p className="text-sm text-gray-500">Field
                                                        Tech: {call.technician}</p>
                                                </div>
                                                <div>{getPriorityBadge(call.priority)}</div>
                                            </div>
                                            <div className="mt-2 flex items-center text-sm">
                                                <Clock className="h-4 w-4 mr-1 text-gray-500"/>
                                                <span
                                                    className={"text-gray-500"}> Started: {call.date ? call.date.toDate().toLocaleString() : 'Unknown'}</span>
                                            </div>
                                            <div className="mt-2 flex justify-end space-x-2">
                                                <Link to={`/MasterCallPage/${call.id}`}
                                                      className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors">
                                                    View Call
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <PhoneCall className="h-12 w-12 mx-auto text-gray-400 mb-4"/>
                                <p>No waiting calls at the moment.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Recent Activity Timeline */}
            <div className="mt-6 bg-primary rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b">
                    <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-indigo-600 mr-2"/>
                        <h2 className="text-xl font-semibold text-gray-200">Recent Activity</h2>
                    </div>
                </div>
                <div className="p-4">
                    <div className="relative">
                        <ul className="space-y-4">
                            {allCalls.slice(-5).map((call, index) => (
                                <li key={index} className="ml-6 relative pb-4">
                                    <div
                                        className="absolute -left-6 mt-1.5 h-3 w-3 rounded-full bg-blue-500 border-2 border-white"></div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between">
                                        <div>
                                            <p className="font-medium text-gray-200">
                                                {call.status === 'ongoing' ? 'Call Ongoing' : call.status === 'Hangup' ? 'Call Hangup' : 'Call Completed'}
                                            </p>
                                            <p className="text-sm text-gray-500">Call from {call.technician}
                                            </p>
                                        </div>
                                        <time className="text-xs text-gray-400 mt-1 sm:mt-0">
                                            {`${Math.floor(index * 17)} mins ago`}
                                        </time>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;