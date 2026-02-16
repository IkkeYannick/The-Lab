import {useMasterTechnician} from "../../hooks/useMasterTechnician.ts";

const Experts = () => {
    const {masterTechnicians} = useMasterTechnician();

    return (
        <div className="container mx-auto p-4 min-h-screen">
            <h2 className="text-2xl font-bold mb-4">Our Experts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {masterTechnicians.map((technician) => (
                    <div key={technician.id} className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-600">{technician.name}</h3>
                        <p className="text-gray-500">Contact: {technician.email}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Experts;