import React, {useEffect, useState} from 'react';
import {useWebRTC} from '../../hooks/useWebRTC';
import usePins from "../../hooks/usePins";
import Pin from "../../components/Pin";
import Box from "../../components/Box";

const FieldCallPage: React.FC = () => {
    const {
        localAudioStream,
        localVideoStream,
        isCallActive,
        startWebcam,
        createCall,
        hangUp,
        fieldTechVideoRef,
        masterTechAudioRef,
        callId,
    } = useWebRTC();

    // Only pass callId to usePins when it's a valid value
    const {pins, boxes} = usePins(callId && callId !== 'new' ? callId : undefined,null);

    const [isMuted, setIsMuted] = useState(false);
    const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
    const [selectedCamera, setSelectedCamera] = useState<string>('');

    useEffect(() => {
        // Get list of available cameras when component mounts
        const getCameras = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                setAvailableCameras(videoDevices);

                // Set the first camera as default if available
                if (videoDevices.length > 0) {
                    setSelectedCamera(videoDevices[0].deviceId);
                }
            } catch (error) {
                console.error('Error getting cameras:', error);
            }
        };

        getCameras();
    }, []);

    useEffect(() => {
        if (localAudioStream && localVideoStream) {
            console.log("Local stream available, enabling 'Create Call' button");
        }
    }, [localAudioStream, localVideoStream]);

    const toggleMute = () => {
        if (localAudioStream) {
            localAudioStream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    };

    const handleCameraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCameraId = e.target.value;
        setSelectedCamera(newCameraId);

        // Stop current stream before starting a new one
        if (localVideoStream) {
            localVideoStream.getTracks().forEach(track => track.stop());
        }

        // Start webcam with the selected camera
        startWebcam(true, newCameraId);
    };

    return (
        <div className="flex flex-col bg-secondary items-center justify-center p-6 min-h-screen bg-gray-50">
            <div className="w-full max-w-4xl bg-secondary rounded-xl shadow-lg overflow-hidden">
                {/* Video Container */}
                <div className="relative w-full bg-black rounded-lg overflow-hidden aspect-video">
                    {/* Local video (your webcam) */}
                    <div className="relative w-full">
                        <video
                            ref={fieldTechVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full aspect-video bg-black"
                        />
                        {/* Remote audio only (no visible element) */}
                        <audio
                            ref={masterTechAudioRef}
                            autoPlay
                            playsInline
                            className="hidden" // Hide the element
                        />

                        {/* Pins and Boxes Overlay */}
                        {callId && callId !== 'new' && (
                            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                                {boxes.map((box) => box.visible ? (
                                    <Box key={box.id} {...box}
                                         onDelete={() => console.log("Cannot remove as a Field Tech")}/>
                                ) : null)}
                                {pins.map((pin) => pin.visible ? (
                                    <Pin key={pin.id} {...pin}
                                         onDelete={() => console.log("Cannot remove as a Field Tech")}/>
                                ) : null)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Status and Controls */}
                <div className="mt-4">
                    <div className="p-4 rounded-lg bg-secondary text-white">
                        <div className="flex flex-col gap-3">
                            {/* Connection status */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Status:</span>
                                <span className={`text-sm ${isCallActive ? 'text-green-400' : 'text-yellow-400'}`}>
                                    {isCallActive ? 'Connected' : localAudioStream && localVideoStream ? 'Ready' : 'Inactive'}
                                </span>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-gray-600"></div>

                            {/* Controls */}
                            <div className="flex flex-col gap-2">
                                {!localVideoStream && !localAudioStream && !isCallActive && (

                                    <>{availableCameras.length > 1 && !isCallActive && (
                                        <div className="mt-4">
                                            <div className="p-4 rounded-lg bg-secondary text-white">
                                                <label htmlFor="camera-select"
                                                       className="block text-sm font-medium mb-2">
                                                    Camera Source
                                                </label>
                                                <select
                                                    id="camera-select"
                                                    value={selectedCamera}
                                                    onChange={handleCameraChange}
                                                    className="w-full py-2 px-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    {availableCameras.map((camera) => (
                                                        <option key={camera.deviceId} value={camera.deviceId}>
                                                            {camera.label || `Camera ${availableCameras.indexOf(camera) + 1}`}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                        <button
                                            onClick={() => startWebcam(true, selectedCamera).finally(() => console.log("Webcam started:", fieldTechVideoRef ))}
                                            className="w-full py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">
                                            Start Webcam
                                        </button>
                                    </>
                                )}

                                {localAudioStream && localVideoStream && !isCallActive && (
                                    <button
                                        onClick={createCall}
                                        className="w-full py-3 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium transition-colors">
                                        Create Call
                                    </button>
                                )}

                                {isCallActive && (
                                    <>
                                        <button
                                            onClick={toggleMute}
                                            className={`w-full py-3 rounded-md font-medium transition-colors ${isMuted ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-600 hover:bg-gray-700'}`}>
                                            {isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
                                        </button>

                                        <button
                                            onClick={() => hangUp(callId, false)}
                                            className="w-full py-3 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium transition-colors">
                                            End Call
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FieldCallPage;