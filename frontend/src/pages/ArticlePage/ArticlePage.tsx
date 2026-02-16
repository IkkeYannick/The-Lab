export function ArticlePage() {
    return (
            
            <div className="max-w-4xl mx-auto p-8 bg-secondary shadow-lg rounded-lg mt-6">
                <h2 className="text-4xl font-bold mb-4">TechSync-Connect: Troubleshooting made easy with AR communication</h2>
                <div className="prose prose-invert">
                <h3 className="text-2xl font-semibold mt-6 mb-1">The problem:</h3>
                <p>Technical support teams often face inefficiencies due to unnecessary service calls for minor or easily resolvable issues. In many cases, a field technician is dispatched to a site only to find that the problem could have been solved remotely with proper guidance. This not only wastes valuable time and resources but also delays critical repairs, increasing operational costs and reducing overall efficiency.</p>

                <p>Companies struggle with these inefficiencies, and technicians often find themselves frustrated with routine service requests that could have been handled more efficiently. A lack of real-time collaboration tools makes it difficult for field technicians to receive immediate guidance from more experienced colleagues, further complicating problem resolution.</p>

                <h3 className="text-2xl font-semibold mt-6 mb-1">Our Solution: TechSync Connect</h3>
                <p>To tackle this challenge, we developed TechSync Connect, an augmented reality (AR)-enabled remote support system that enhances troubleshooting efficiency. With this system, a field technician can wear AR glasses that stream live video to a desk technician, who can then provide real-time assistance. This allows the desk technician to overlay instructions, share documents, and guide the field technician through complex repairs without requiring an on-site visit.</p>

                <p>This project was developed in collaboration with engineering students from Universiteit Antwerpen, as part of the Vlajo Challenge which is a competition focused on innovation and entrepreneurial thinking. Their insights helped shape the system's technical and practical aspects, ensuring its alignment with real-world industry needs.</p>

                <p>By leveraging WebRTC for low-latency video communication, Firebase Firestore for real-time data management, and Google Cloud Storage for secure document handling, TechSync Connect offers a scalable and efficient solution for modern technical support teams.</p>

                <p>This article explores our development journey, discussing our research process, the technologies chosen, the challenges faced, and the lessons learned.</p>

                <h4 className="text-3xl font-semibold mt-6 mb-1">Technology Selection and Framework Research</h4>
                <h3 className="text-2xl font-semibold mt-4 mb-2">Route to our solution:</h3>
                <p className="mb-4">In this section, we detail the step-by-step development process that led to the creation of TechSync Connect, outlining stages of research, development, and implementation. Each stage presented its own set of challenges, which were addressed through continuous learning and adaptation of emerging technologies.</p>

                <h4 className="text-xl font-semibold mt-5 mb-1">Technology Selection and Framework Research</h4>
                <p>To begin developing the solution, we first had to research the technologies that would enable the envisioned system.</p>

                <p>We explored multiple AR frameworks such as WebXR, Meta Spatial SDK, and OpenXR. After evaluating them, we decided to use the Meta Spatial SDK, as it was specifically designed to integrate seamlessly with Unity, which was the preferred platform for AR development.</p>

                <p>For real-time communication, we selected WebRTC as the solution for peer-to-peer video calls, given its low latency and support for direct device communication.</p>

                <h4 className="text-xl font-semibold mt-5 mb-1">Developing the Calling Application Using WebRTC</h4>
                <p>With the technologies selected, we started by developing the core feature of the application: a real-time video calling system using WebRTC.</p>

                <p>Our main task was to create a stable video stream between the field technician's AR glasses and the desk technician's interface. We focused on ensuring high-quality, low-latency communication to make troubleshooting as efficient as possible.</p>

                <p>Additionally, we integrated call recording functionality to enable both technicians to review video calls after troubleshooting, which would also serve as a valuable reference.</p>

                <h4 className="text-xl font-semibold mt-5 mb-1">Building the Login System</h4>
                <p>With usage of firebase authorization we can keep our database and authorization on the same environment, only having to load in a single configuration. Using firebase auth we also allowed google login so people can login easier.</p>

                <h4 className="text-xl font-semibold mt-5 mb-1">Enabling PDF Upload Functionality</h4>
                <p>One key feature of the solution was the ability for technicians to upload and share PDFs and other troubleshooting documents. This was essential to ensure that the field technician could easily access manuals, schematics, and other helpful materials during the support session.</p>

                <p>We integrated Google Cloud Storage for secure file handling and storage, ensuring that all documents were easily accessible for both technicians and were securely stored for later use.</p>

                <h4 className="text-xl font-semibold mt-5 mb-1">Deployment and Cloud Infrastructure Setup</h4>
                <p>Cloudflare pages to deploy our React based website. Google cloud storage to upload recordings and pdf's. Google cloud Run to run the backend connection with the cloud storage.</p>

                <h3 className="text-3xl font-semibold mt-6">Research made:</h3>
                <h4 className="text-2xl font-semibold mt-4 mb-3">How OpenXR and OculusVR work together in unity</h4>

                <div className="mb-2">
                <img 
                    src="/assets/unnamed.jpg" 
                    className="w-full h-[500px] object-cover rounded-lg mb-2"
                />
                </div> 
                <p>To start developing for Meta's AR headset (Meta Quest 3), we first had to understand how various AR/VR frameworks work together. However, a recent update changed the landscape quite a bit.</p>

                <p>Meta is transitioning from its proprietary OculusVR framework (OVR) to OpenXR, an open-source XR framework. The main reason for this shift is to enable developers to create a single application that can run across multiple AR/VR devices, ensuring broader compatibility.</p>

                <p>As shown in the graph below, Meta's OVR utilities serve as tools to simplify development. By leveraging prefabs from the OVRPlugin, developers can use these OVR packages and prefabs to seamlessly interact with the OpenXR framework. This integration streamlines the development process while maintaining support for Meta's ecosystem.</p>

                <h4 className="text-2xl font-semibold mt-6 mb-3">WebRTC vs. Azure Communication Services (ACS) for Real-Time Communication</h4>
                <div className="mb-2">
                <img 
                    src="/assets/unnamed2.png" 
                    className="w-full h-[500px] object-cover rounded-lg mb-2"
                />
                </div> 
                <p>For TechSync Connect, we needed a low-latency, high-quality real-time video communication solution. After evaluating multiple options, we considered Azure Communication Services (ACS) but ultimately chose WebRTC due to its superior performance for our use case.</p>

                <p>WebRTC operates on a peer-to-peer (P2P) model, enabling direct device-to-device streaming, which minimizes latency. In contrast, ACS routes calls through Microsoft's cloud, introducing additional delay. WebRTC is free and open-source, while ACS has usage-based costs. Since we aimed for scalability without unnecessary expenses, WebRTC was the more practical choice.</p>

                <p>This image visually shows the advantage of WebRTC in terms of real-time communication. WebSockets rely on a central server to relay messages between clients, making them great for chat applications or real-time updates but not ideal for high-bandwidth streaming like video calls.</p>

                <p>WebRTC, on the other hand, establishes a direct peer-to-peer connection between devices, bypassing the need for a server for media transmission. This makes it faster and more efficient for real-time audio and video communication, reducing latency and bandwidth usage.</p>

                <h4 className="text-2xl font-semibold mt-6 mb-3">Comparison: Firebase Firestore vs. PostgreSQL for TechSync Connect</h4>
                <div className="mb-2">
                <img 
                    src="/assets/unnamed.png" 
                    className="w-full h-[600px] object-cover rounded-lg mb-2"
                />
                </div>
                <p>For TechSync Connect, we needed a scalable, real-time database to support WebRTC-based troubleshooting. After evaluating Firestore and PostgreSQL, we chose Firestore due to its real-time sync and cloud integration.</p>

                <p>Real-Time Data Handling: Firestore's native real-time synchronization perfectly complements WebRTC, ensuring instant updates for technicians. PostgreSQL, lacking built-in real-time features, would require extra tools like WebSockets.</p>

                <p>Ease of Integration: Firestore integrates eflessly with Firebase Authentication, Google Cloud Storage, and our WebRTC setup, reducing development effort. PostgreSQL, while powerful, needs additional configuration for cloud and authentication.</p>

                <p>While PostgreSQL is excellent for structured data and complex queries, Firestore's real-time sync, scalability, and WebRTC compatibility made it the better choice for our application.</p>

                <h3 className="text-2xl font-semibold mt-6">Challenges</h3>
                <h4 className="text-xl font-semibold mt-4">Initial Uncertainty and Project Scope</h4>
                <p>During the first week of development, we faced ambiguity regarding certain project aspects, requiring multiple meetings with the project proposers for clarification. This delayed progress but ultimately helped us refine our approach.</p>

                <h4 className="text-xl font-semibold mt-4">Learning New Technologies</h4>
                <p>A major hurdle was our lack of experience with augmented reality. Selecting the right tools and frameworks required extensive research into AR platforms, best practices, and implementation strategies before we could make meaningful progress. Additionally, WebRTC, which was crucial for real-time communication, was unfamiliar to the team. Understanding its architecture, setting up peer-to-peer connections, and troubleshooting network issues presented a steep learning curve.</p>

                <h4 className="text-xl font-semibold mt-4">Integration with AR Glasses</h4>
                <p>Connecting the AR glasses to our application posed significant technical challenges. We had to address device compatibility, establish stable real-time data transfer, and ensure synchronization between the AR display and our app's functionality. This required in-depth research and extensive testing.</p>

                <h4 className="text-xl font-semibold mt-4">Deployment Complexities</h4>
                <p>Deploying the web application was another challenge, as only one team member had prior experience. Configuring API calls beyond local development environments, managing environment variables, and handling file uploads required additional effort. Initially, we attempted to use Cloudflare Workers for managing signed URLs but ultimately found Google Cloud Run more effective for deploying containerized applications.</p>

                <p>Despite these setbacks, we relied on self-learning, online resources, and continuous experimentation to bridge the knowledge gap. Overcoming these challenges strengthened our technical skills and provided valuable insights for future development.</p>

                <h3 className="text-2xl font-semibold mt-6">Conclusion</h3>
                <p>The development of TechSync Connect was a highly rewarding journey that introduced us to a range of cutting-edge technologies. From exploring augmented reality with the Meta Spatial SDK to mastering WebRTC for real-time communication, the project pushed us to expand our technical knowledge and skills. Integrating AR glasses and ensuring seamless communication between field and desk technicians presented unique challenges, but the results were very satisfying.</p>

                <p>Our work with Firebase Firestore, cloud services, and real-time data handling highlighted the importance of choosing the right tools for scalability and efficiency. This project not only solved a real-world problem but also provided invaluable insights into emerging technologies, showcasing the transformative potential of AR in practical applications.</p>

                <h3 className="text-2xl font-semibold mt-8 mb-4">References:</h3>
                <p className="mb-2">
                    Apizee. (n.d.). What is WebRTC? Apizee. Retrieved March 24, 2025, from{' '}
                    <a 
                        href="https://www.apizee.com/what-is-webrtc.php" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-400 hover:text-blue-300 underline"
                    >
                        https://www.apizee.com/what-is-webrtc.php
                    </a>
                </p>

                <p>
                    ​Meta. (2024, April 22). A More Open Ecosystem For Developers. Meta Horizon OS Developers. Retrieved March 25, 2025, from{' '}
                    <a 
                        href="https://developers.meta.com/horizon/blog/a-more-open-ecosystem-for-developers/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-400 hover:text-blue-300 underline"
                    >
                        https://developers.meta.com/horizon/blog/a-more-open-ecosystem-for-developers/
                    </a>
                </p>
                 </div> 
        </div>
    );
}


