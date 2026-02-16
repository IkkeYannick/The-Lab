
const Documentation = () => {
    return (
        <div className=" container mx-auto p-4 min-h-screen">
            <div className="container mx-auto p-4 bg-secondary rounded shadow-md border border-gray-200">
            <h1 className="text-3xl font-bold mb-4">Documentation</h1>
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">Overview</h2>
                <p className="text-gray-300">
                    Welcome to TechSync Connect! This website is designed to help you connect with expert technicians and manage your technical support needs efficiently.
                </p>
            </section>
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">Features</h2>
                <ul className="list-disc list-inside text-gray-300">
                    <li><strong>Everyone:</strong></li>
                    <li>View the documentation</li>
                    <li>View the home page </li>
                    <li>View a list of master technicians</li>
                    <li><strong>Only for FieldTechnicians:</strong></li>
                    <li>Request help</li>
                    <li><strong>Only for MasterTechnicians:</strong></li>
                    <li>Manage technician profiles</li>
                    <li>Upload and manage technical drawings</li>
                    <li>Access your dashboard for an overview of your activities</li>
                </ul>
            </section>
                <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">Navigation</h2>
                <p className="text-gray-300">
                    Use the navigation bar at the top of the page to access different sections of the website:
                </p>
                <ul className="list-disc list-inside text-gray-300">
                    <li><strong>Home:</strong> The main landing page</li>
                    <li><strong>Experts:</strong> View and contact expert technicians</li>
                    <li><strong>Call:</strong> Request help from field technicians</li>
                    <li><strong>Documentation:</strong> Access this documentation page</li>
                    <li><strong>Manage Technicians:</strong> (Master Technicians only) Manage technician profiles</li>
                    <li><strong>Need Help!:</strong> (Field Technicians only) Request immediate assistance</li>
                </ul>
            </section>
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">Authentication</h2>
                <p className="text-gray-300">
                    You can log in using your Google account or a unique code provided by your administrator. Once logged in, you will have access to additional features based on your role (master technician or field technician).
                </p>
            </section>
        </div>
        </div>
    );
}

export default Documentation;