import { Link } from "react-router";

export function HomePage() {
    return (
        <div className="flex flex-col items-center justify-baseline bg-primary text-light p-8">
            <h1 className="text-4xl font-bold mb-6 mt-10">Welcome to TechSync-Connect</h1>
            <p className="text-lg text-center max-w-2xl mb-6">
                Technical support teams often waste time and resources on unnecessary service calls for minor issues.
                TechSync Connect solves this problem with an augmented reality (AR)-enabled remote support system. Using
                AR glasses, field technicians can stream live video to desk technicians, who provide real-time guidance,
                reducing delays and increasing efficiency.
            </p>

            <Link 
                to={'/Article'} 
                className="px-6 py-3 bg-secondary text-light rounded-lg hover:bg-opacity-80 transition-colors duration-300 ease-in-out mb-10 shadow-md flex items-center space-x-2"
            >
                <span>Read our article</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 6l5 5-5 5M7 6l5 5-5 5"/>
                </svg>
            </Link>

            <div className="flex space-x-6 mb-6">
                <div className="flex flex-col items-center">
                    <a href="https://www.linkedin.com/in/josse-dresselaers-9436a5254/" target="_blank"
                       rel="noopener noreferrer">
                        <img src="/assets/josse.png" alt="Josse Dresselaers" className="rounded-full mb-2 w-[250px]"/>
                    </a>
                    <a href="https://www.linkedin.com/in/josse-dresselaers-9436a5254/" className="text-accent">Josse
                        Dresselaers</a>
                </div>
                <div className="flex flex-col items-center">
                    <a href="https://www.linkedin.com/in/jarno-fret/" target="_blank" rel="noopener noreferrer">
                        <img src="/assets/jarno2.png" alt="Jarno Fret" className="rounded-full mb-2 w-[235px]"/>
                    </a>
                    <a href="https://www.linkedin.com/in/jarno-fret/" className="text-accent">Jarno Fret</a>
                </div>
                <div className="flex flex-col items-center">
                    <a href="https://www.linkedin.com/in/yannick-vandenbulcke-700556248/" target="_blank"
                       rel="noopener noreferrer">
                        <img src="/assets/yannick.png" alt="Yannick Vandenbulcke" className="rounded-full mb-2 w-[250px]"/>
                    </a>
                    <a href="https://www.linkedin.com/in/yannick-vandenbulcke-700556248/" className="text-accent">Yannick
                        Vandenbulcke</a>
                </div>
            </div>

           <div className="w-full max-w-[800px] mx-auto aspect-video bg-gray-700 mb-10">
    <iframe
        className="w-full h-full"
        src="https://www.youtube.com/embed/T2fFd3U2w2E"
        title="YouTube video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
    ></iframe>
</div>
 
        </div>
    );
}