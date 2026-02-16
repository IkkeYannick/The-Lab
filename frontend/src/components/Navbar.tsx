import {Link} from "react-router";
import {useContext, useState} from "react";
import FireBaseSecurityContext from "../firebase/FireBaseSecurityContext.ts";

export function Navbar() {
    const {loggedInUser, googleLogin, handleLogout, userRole} = useContext(FireBaseSecurityContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <nav className='bg-secondary w-full px-4 py-8 flex items-center justify-between'>
            <h1 className="text-xl font-bold">TechSync Connect</h1>
            <div className='hidden md:flex space-x-4'>
                <Link to={'/'} className="bg-primary text-white px-4 py-2 rounded">Home</Link>
                <Link to={'/Documentation'} className="bg-primary text-white px-4 py-2 rounded">Documentation</Link>
                <Link to={'/Experts'} className="bg-primary text-white px-4 py-2 rounded">Experts</Link>
                {userRole === 'masterTechnician' && <>
                    <Link to={'/ManageTechnician'} className="bg-primary text-white px-4 py-2 rounded">Manage</Link> <Link
                    to={'/Dashboard'} className="bg-primary text-white px-4 py-2 rounded">Dashboard</Link>
                    <Link to={'/Recordings'} className="bg-primary text-white px-4 py-2 rounded">Recordings</Link>
                    <Link to={'/TechnicalDrawings'} className="bg-primary text-white px-4 py-2 rounded">Drawings</Link>
                </>}
                {userRole === 'fieldTechnician' || userRole === 'masterTechnician' &&
                    <Link to={'/FieldCallPage'} className="bg-primary text-white px-4 py-2 rounded">Help!</Link>}
            </div>
            <button className="md:hidden" onClick={toggleSidebar}>☰</button>
            {loggedInUser ? (
                <div className='hidden md:flex space-x-4'>
                    <Link to={'/'} className="bg-primary text-white px-4 py-2 rounded">{loggedInUser}</Link>
                    <button onClick={handleLogout} className="bg-primary text-white px-4 py-2 rounded">Logout</button>
                </div>
            ) : (
                <div className='hidden md:flex space-x-4'>
                    <button onClick={googleLogin} className="bg-primary text-white px-4 py-2 rounded">Login</button>
                </div>
            )}
            <div
                className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-40 transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
                <div className="flex flex-col p-4 space-y-4 bg-secondary h-full">
                    <button onClick={toggleSidebar} className="self-end">✕</button>
                    <Link to={'/'} className="bg-primary text-white px-4 py-2 rounded">Home</Link>
                    <Link to={'/Documentation'} className="bg-primary text-white px-4 py-2 rounded">Documentation</Link>
                    <Link to={'/Experts'} className="bg-primary text-white px-4 py-2 rounded">Experts</Link>
                    {userRole === 'masterTechnician' && <>
                        <Link to={'/ManageTechnician'} className="bg-primary text-white px-4 py-2 rounded">Manage Technicians</Link> <Link
                        to={'/Dashboard'} className="bg-primary text-white px-4 py-2 rounded">Dashboard</Link>
                        <Link to={'/Recordings'} className="bg-primary text-white px-4 py-2 rounded">Recordings</Link>
                        <Link to={'/TechnicalDrawings'} className="bg-primary text-white px-4 py-2 rounded">Technical Drawings</Link>
                    </>}
                    {userRole === 'fieldTechnician' || userRole === 'masterTechnician' &&
                        <Link to={'/FieldCallPage'} className="bg-primary text-white px-4 py-2 rounded">Need Help!</Link>}
                    {loggedInUser ? (
                        <>
                            <Link to={'/'} onClick={toggleSidebar} className="bg-primary text-white px-4 py-2 rounded">{loggedInUser}</Link>
                            <button onClick={() => {
                                handleLogout();
                                toggleSidebar();
                            }} className="bg-primary text-white px-4 py-2 rounded">Logout
                            </button>
                        </>
                    ) : (
                        <button onClick={() => {
                            googleLogin();
                            toggleSidebar();
                        }} className="bg-primary text-white px-4 py-2 rounded">Login</button>
                    )}
                </div>
            </div>
        </nav>
    );
}