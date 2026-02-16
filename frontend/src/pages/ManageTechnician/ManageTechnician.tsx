import { useState } from "react";
import { useFieldTechnician } from "../../hooks/useFieldTechnician.ts";
import {useMasterTechnician} from "../../hooks/useMasterTechnician.ts";

const ManageTechnician = () => {
    const {fieldTechnicians, addFieldTechnician, loading, error, removeFieldTechnician} = useFieldTechnician();
    const {masterTechnicians, addMasterTechnician} = useMasterTechnician();

    // Separate state for different technician types
    const [fieldName, setFieldName] = useState("");
    const [fieldEmail, setFieldEmail] = useState("");
    const [masterName, setMasterName] = useState("");
    const [masterEmail, setMasterEmail] = useState("");

    // Search state
    const [fieldTechnicianSearch, setFieldTechnicianSearch] = useState("");
    const [masterTechnicianSearch, setMasterTechnicianSearch] = useState("");

    const handleAddFieldTechnician = async (e: React.FormEvent) => {
        e.preventDefault();
        await addFieldTechnician(fieldName, fieldEmail);
        setFieldName("");
        setFieldEmail("");
    };

    const handleAddMasterTechnician = async (e: React.FormEvent) => {
        e.preventDefault();
        await addMasterTechnician(masterName, masterEmail);
        setMasterName("");
        setMasterEmail("");
    };

    const handleRemoveTechnician = async (id: string | undefined) => {
        if (!id) return;
        await removeFieldTechnician(id);
    };

    // Filter technicians based on search input
    const filteredFieldTechnicians = fieldTechnicians.filter(technician =>
        technician.name.toLowerCase().includes(fieldTechnicianSearch.toLowerCase()) ||
        technician.email.toLowerCase().includes(fieldTechnicianSearch.toLowerCase())
    );

    const filteredMasterTechnicians = masterTechnicians.filter(technician =>
        technician.name.toLowerCase().includes(masterTechnicianSearch.toLowerCase()) ||
        technician.email.toLowerCase().includes(masterTechnicianSearch.toLowerCase())
    );

    // Status indicator component
    const StatusBadge = ({ status, type }: { status: boolean, type: 'help' | 'availability' }) => {
        if (type === 'help') {
            return status ? (
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                    Needs Help
                </span>
            ) : (
                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                    No Help Needed
                </span>
            );
        }

        return status ? (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                Available
            </span>
        ) : (
            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
                Busy
            </span>
        );
    };

    return (
        <div className="flex p-4 space-x-4 w-full justify-center items-start h-screen bg-primary">
            {/* Field Technicians Section */}
            <div className="w-1/2 p-4 bg-secondary rounded-lg shadow-md flex flex-col h-full">
                <h1 className="text-2xl font-bold mb-4 text-white">Manage Field Technicians</h1>
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-white mb-2">Add Field Technician</h2>
                    <div className="mb-2">
                        <label className="block text-sm font-medium text-white">Name</label>
                        <input
                            type="text"
                            value={fieldName}
                            onChange={(e) => setFieldName(e.target.value)}
                            required
                            className="text-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium text-white">Email</label>
                        <input
                            type="email"
                            value={fieldEmail}
                            onChange={(e) => setFieldEmail(e.target.value)}
                            required
                            className="text-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleAddFieldTechnician}
                        className="bg-blue-500 p-2 rounded-md text-white"
                    >
                        Add Field Technician
                    </button>
                </div>

                {/* Field Technicians List */}
                <div className="flex-grow overflow-hidden flex flex-col">
                    <div className="mb-2">
                        <input
                            type="text"
                            placeholder="Search field technicians..."
                            value={fieldTechnicianSearch}
                            onChange={(e) => setFieldTechnicianSearch(e.target.value)}
                            className="text-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="overflow-y-auto flex-grow pr-2">
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : filteredFieldTechnicians.length !== 0 ? (
                            <ul className="space-y-2">
                                {filteredFieldTechnicians.map((technician) => (
                                    <li key={technician.email} className="p-4 border rounded-md shadow-sm bg-primary relative">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-lg font-medium text-white">{technician.name}</p>
                                                <p className="text-sm text-gray-300 mb-2">{technician.email}</p>
                                                <StatusBadge status={technician.needsHelp} type="help" />
                                            </div>
                                            <button
                                                onClick={() => handleRemoveTechnician(technician.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No field technicians available.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Master Technicians Section */}
            <div className="w-1/2 p-4 bg-secondary rounded-lg shadow-md flex flex-col h-full">
                <h1 className="text-2xl font-bold mb-4 text-white">Manage Master Technicians</h1>
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-white mb-2">Add Master Technician</h2>
                    <div className="mb-2">
                        <label className="block text-sm font-medium text-white">Name</label>
                        <input
                            type="text"
                            value={masterName}
                            onChange={(e) => setMasterName(e.target.value)}
                            required
                            className="text-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium text-white">Email</label>
                        <input
                            type="email"
                            value={masterEmail}
                            onChange={(e) => setMasterEmail(e.target.value)}
                            required
                            className="text-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleAddMasterTechnician}
                        className="bg-blue-500 p-2 rounded-md text-white"
                    >
                        Add Master Technician
                    </button>
                </div>

                {/* Master Technicians List */}
                <div className="flex-grow overflow-hidden flex flex-col">
                    <div className="mb-2">
                        <input
                            type="text"
                            placeholder="Search master technicians..."
                            value={masterTechnicianSearch}
                            onChange={(e) => setMasterTechnicianSearch(e.target.value)}
                            className="text-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="overflow-y-auto flex-grow pr-2">
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : filteredMasterTechnicians.length !== 0 ? (
                            <ul className="space-y-2">
                                {filteredMasterTechnicians.map((technician) => (
                                    <li key={technician.email} className="p-4 border rounded-md shadow-sm bg-primary relative">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-lg font-medium text-white">{technician.name}</p>
                                                <p className="text-sm text-gray-300 mb-2">{technician.email}</p>
                                                <StatusBadge status={technician.isAvailable} type="availability" />
                                            </div>
                                            <button
                                                onClick={() => handleRemoveTechnician(technician.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No master technicians available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageTechnician;