import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import axios from "axios";
import {BrowserRouter, Route, Routes} from "react-router";
import {HomePage} from "./pages/HomePage";
import {Navbar} from "./components/Navbar";
import {Footer} from "./components/Footer";
import FieldCallPage from "./pages/CallPage/FieldCallPage.tsx";
import FireBaseSecurityContextProvider, {app} from "./firebase/FireBaseSecurityContextProvider.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import ManageTechnician from "./pages/ManageTechnician/ManageTechnician.tsx";
import HelpTechnicianPage from "./pages/HelpPage/HelpTechnicianPage.tsx";
import MasterCallPage from "./pages/CallPage/MasterCallPage.tsx";
import Experts from "./pages/filler/Experts.tsx";
import Documentation from "./pages/filler/Documentation.tsx";
import RecordingsPage from "./pages/Recordings/RecordingsPage.tsx";
import TechnicalDrawingsPage from "./pages/TechnicalDrawingsPage/TechnicalDrawingsPage.tsx";
import { ArticlePage } from "./pages/ArticlePage/ArticlePage.tsx";


axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
const queryClient = new QueryClient();
//Niet removen anders word de firebase niet geinitialiseerd.
console.log(app.name);

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <FireBaseSecurityContextProvider>
                <BrowserRouter>
                    <div className="bg-primary text-white flex flex-col full-h">
                        <Navbar/>
                        <Routes>
                            <Route path="/" element={<HomePage/>}/>
                            <Route path="/FieldCallPage" element={<FieldCallPage/>}/>
                            <Route path="/MasterCallPage/:callId" element={<MasterCallPage/>}/>
                            <Route path="/Dashboard" element={<Dashboard/>}/>
                            <Route path="/ManageTechnician" element={<ManageTechnician/>}/>
                            <Route path="/HelpTechnicianPage" element={<HelpTechnicianPage/>}/>
                            <Route path="/Recordings" element={<RecordingsPage/>}/>
                            <Route path="/Experts" element={<Experts/>}/>
                            <Route path="/Documentation" element={<Documentation/>}/>
                            <Route path="/TechnicalDrawings" element={<TechnicalDrawingsPage/>}/>
                            <Route path="/Article" element={<ArticlePage/>}/>
                        </Routes>
                        <Footer/>
                    </div>
                </BrowserRouter>
            </FireBaseSecurityContextProvider>
        </QueryClientProvider>
    );
}

export default App;
