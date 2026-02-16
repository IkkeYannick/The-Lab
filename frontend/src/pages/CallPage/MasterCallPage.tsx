import React, {useState, useRef} from 'react';
import {useWebRTC} from '../../hooks/useWebRTC';
import {useParams} from 'react-router';
import usePins from '../../hooks/usePins.ts';
import useRecording from "../../hooks/useRecording.ts";
import CanvasDrawingRenderer from "../../hooks/CanvasDrawingRenderer.tsx";
import {PhoneMissed, Mic, MicOff, Video, Square, Phone} from 'lucide-react';

const MasterCallPage = () => {
    const {callId} = useParams<{ callId: string }>();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const {
        pins,
        boxes,
        handleItemDeletion,
        handleMouseDown,
        handleMouseUp,
        handleMouseMove
    } = usePins(callId!, canvasRef);
    const [isMuted, setIsMuted] = useState(false);
    const [recording, setRecording] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    const BACKEND_URL = "https://gcs-signed-url-416379081464.europe-west1.run.app";

    const {
        localAudioStream,
        isCallActive,
        startWebcam,
        answerCall,
        hangUp,
        masterTechVideoRef,
        masterTechAudioRef,
    } = useWebRTC();

    const {
        startRecording,
        stopRecording
    } = useRecording(
        localAudioStream,
        masterTechVideoRef as React.RefObject<HTMLVideoElement>,
        canvasRef as React.RefObject<HTMLCanvasElement>
    );

    const toggleMute = () => {
        if (localAudioStream) {
            const audioTrack = localAudioStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMuted(!audioTrack.enabled);
            }
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select a file first.");
            return;
        }

        setUploading(true);
        setMessage("");

        try {
            const prefixedFileName = `drawing-${callId}-${file.name}`;

            const response = await fetch(`${BACKEND_URL}/getSignedUrl`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({fileName: prefixedFileName, fileType: file.type}),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to get signed URL");

            await fetch(data.url, {
                method: "PUT",
                body: file,
                headers: {"Content-Type": file.type},
            });

            setMessage("File uploaded successfully!");
            setUploading(false);
            setFile(null);
        } catch (error) {
            setMessage("Error uploading file: " + error);
            setUploading(false);
        }
    };


    console.log(masterTechVideoRef)

    return (
        <div className="flex flex-col bg-secondary items-center justify-center p-6 min-h-screen bg-gray-50">
            <div className="w-full max-w-4xl bg-secondary rounded-xl shadow-lg overflow-hidden">
                {/* Video Section */}

                <div className="relative w-full bg-black rounded-lg overflow-hidden aspect-video">
                    <video
                        ref={masterTechVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    ></video>

                    <audio
                        ref={masterTechAudioRef}
                        autoPlay
                        playsInline
                        className="hidden" // Hide the element
                    />

                    <canvas
                        ref={canvasRef}
                        className="absolute top-0 left-0 w-full h-full pointer-events-auto"
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                    ></canvas>

                    <CanvasDrawingRenderer
                        canvasRef={canvasRef as React.RefObject<HTMLCanvasElement>}
                        pins={pins}
                        boxes={boxes}
                        videoRef={masterTechVideoRef as React.RefObject<HTMLVideoElement>}
                        onPinDelete={(pinId) => handleItemDeletion(pinId, 'pin')}
                        onBoxDelete={(boxId) => handleItemDeletion(boxId, 'box')}
                    />

                    {!isCallActive && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60">
                            <div className="text-center text-white p-4">
                                <h3 className="text-xl mb-4">Waiting for call connection</h3>
                                {!localAudioStream ? (
                                    <button
                                        onClick={() => startWebcam(false)}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg
                                                      flex items-center justify-center mx-auto transition-colors"
                                    >
                                        <Mic size={18} className="mr-2"/>
                                        Enable Audio
                                    </button>
                                ) : callId && (
                                    <button
                                        onClick={() => answerCall(callId)}
                                        disabled={!callId || isCallActive}
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg
                                                      flex items-center justify-center mx-auto transition-colors"
                                    >
                                        <Phone size={18} className="mr-2"/>
                                        Join Call
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="p-6 w-full max-w-4xl bg-secondary rounded-xl shadow-lg overflow-hidden mt-4">
                {/* Controls Section */}
                {isCallActive && (
                    <div className="bg-gray-100 p-4 flex justify-center gap-4">
                        <button
                            onClick={toggleMute}
                            className={`flex items-center justify-center p-3 rounded-full ${
                                isMuted ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-700'
                            } hover:opacity-80 transition-all`}
                        >
                            {isMuted ? <MicOff size={20}/> : <Mic size={20}/>}
                        </button>

                        <button
                            onClick={() => {
                                if (recording) {
                                    stopRecording().then(() => {
                                        setRecording(false);
                                        hangUp(callId!, true);
                                    });
                                } else {
                                    hangUp(callId!, true);
                                }
                            }}
                            className="flex items-center justify-center p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >
                            <PhoneMissed size={20}/>
                        </button>

                        <button
                            onClick={() => {
                                if (recording) {
                                    stopRecording().then(() => setRecording(false));
                                } else {
                                    setRecording(true);
                                    startRecording();
                                }
                            }}
                            className={`flex items-center justify-center p-3 rounded-full ${
                                recording ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
                            } hover:opacity-80 transition-all`}
                        >
                            {recording ? <Square size={20}/> : <Video size={20}/>}
                        </button>
                    </div>
                )}

                {/* Drawing Instructions */}
                <div className="p-4 text-sm text-gray-600 bg-gray-50 border-t">
                    <p className="font-medium mb-1">Drawing Tools:</p>
                    <ul className="list-disc pl-5 text-xs">
                        <li>Click to add a pin</li>
                        <li>Click and drag to create a box</li>
                        <li>Click on "×" to remove pins or boxes</li>
                    </ul>
                </div>
            </div>
            <div
                className="upload-container bg-white p-6 rounded-lg shadow-lg border border-gray-300 max-w-md mx-auto mt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                    📂 Upload Technical Drawing
                </h3>
                <div className="upload-form flex flex-col items-center space-y-4">
                    <label
                        className="w-full border border-gray-400 rounded-md p-2 text-center cursor-pointer bg-gray-100 hover:bg-gray-200 transition">
                        <span className="text-gray-700">Choose a PDF file</span>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                            accept="application/pdf"
                        />
                    </label>

                    {file && <p className="file-name text-gray-600 font-medium">📄 Selected: {file.name}</p>}

                    <button
                        className="upload-button bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition disabled:bg-gray-400"
                        onClick={handleUpload}
                        disabled={uploading}
                    >
                        {uploading ? "Uploading..." : "Upload"}
                    </button>
                </div>

                {message && <p className="message text-center mt-3 text-green-600 font-semibold">{message}</p>}
            </div>

        </div>
    );
};

export default MasterCallPage;