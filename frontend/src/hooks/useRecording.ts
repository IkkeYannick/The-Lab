import {useState, useRef, useEffect} from 'react';

const useRecording = (
    FieldTechStream: MediaStream | null,
    masterTechVideoRef: React.RefObject<HTMLVideoElement>,
    canvasRef: React.RefObject<HTMLCanvasElement>
) => {
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    const drawIntervalRef = useRef<number | null>(null);
    const recordingCanvasRef = useRef<HTMLCanvasElement | null>(null);

    // Create a recording canvas element when recording starts
    const createRecordingCanvas = () => {
        // Create a new canvas for recording purposes
        if (!recordingCanvasRef.current) {
            recordingCanvasRef.current = document.createElement('canvas');
        }

        const canvas = canvasRef.current;
        if (canvas) {
            // Match dimensions with the annotation canvas
            recordingCanvasRef.current.width = canvas.width;
            recordingCanvasRef.current.height = canvas.height;
        }

        return recordingCanvasRef.current;
    };

    const startRecording = () => {
        if (!FieldTechStream || !masterTechVideoRef.current || !canvasRef.current) {
            console.error('Missing required elements for recording');
            return;
        }

        const annotationCanvas = canvasRef.current;
        const remoteVideo = masterTechVideoRef.current;
        const MasterTechStream = remoteVideo.srcObject as MediaStream;
        const recordingCanvas = createRecordingCanvas();

        if (!MasterTechStream) {
            console.error('No remote stream available for recording');
            return;
        }

        console.log('Starting the recording...');

        // Set up an interval to composite the video and annotations onto the recording canvas
        if (drawIntervalRef.current) {
            clearInterval(drawIntervalRef.current);
        }

        drawIntervalRef.current = window.setInterval(() => {
            const ctx = recordingCanvas.getContext('2d');
            if (ctx && remoteVideo.readyState >= 2) {
                // Clear the recording canvas
                ctx.clearRect(0, 0, recordingCanvas.width, recordingCanvas.height);

                // Draw the remote video as the base layer
                ctx.drawImage(remoteVideo, 0, 0, recordingCanvas.width, recordingCanvas.height);

                // Draw the annotation canvas on top (which has pins and boxes)
                ctx.drawImage(annotationCanvas, 0, 0);
            }
        }, 33); // ~30fps

        // Get audio tracks from both streams
        const audioTracks = [
            ...(FieldTechStream?.getAudioTracks() || []),
            ...MasterTechStream.getAudioTracks()
        ];

        // Ensure we have audio tracks
        console.log('Audio tracks found:', audioTracks.length);

        // Create a stream from the recording canvas (which will have both video and annotations)
        const canvasStream = recordingCanvas.captureStream(30);

        // Ensure we have video tracks
        console.log('Canvas video tracks:', canvasStream.getVideoTracks().length);

        // Create a combined stream with canvas video and all audio
        const combinedStream = new MediaStream([
            ...canvasStream.getVideoTracks(),
            ...audioTracks
        ]);

        // Try to use a widely supported codec combination
        const mimeType = 'video/webm';

        // Create and configure the media recorder
        const recorder = new MediaRecorder(combinedStream, {
            mimeType,
            videoBitsPerSecond: 2500000 // 2.5 Mbps
        });

        recorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
                console.log('Recording chunk available:', event.data.size);
                recordedChunksRef.current.push(event.data);
            }
        };

        recorder.onstop = () => {
            console.log('Recording stopped');
            // Clean up the draw interval
            if (drawIntervalRef.current) {
                clearInterval(drawIntervalRef.current);
                drawIntervalRef.current = null;
            }
        };

        // Start recording with smaller chunks for reliability
        recorder.start(500);
        setMediaRecorder(recorder);
        console.log('Recording started successfully');
    };

    const stopRecording = async () => {
        if (mediaRecorder) {
            console.log('Stopping the recording...');
            mediaRecorder.requestData();
            mediaRecorder.stop();

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    console.log('Recorded chunks:', recordedChunksRef.current.length);
                    if (recordedChunksRef.current.length > 0) {
                        const blob = new Blob(recordedChunksRef.current, {type: 'video/webm'});
                        const fileName = `recording-${Date.now()}.webm`;
                        uploadRecording(blob, fileName).then(() => {
                            recordedChunksRef.current = []; // Clear the chunks
                            resolve();
                        });
                    } else {
                        console.error('No data available for upload, chunks might be empty.');
                        resolve();
                    }
                }, 500);
            });

        }
        return Promise.resolve();
    };

    const uploadRecording = async (blob: Blob, fileName: string) => {
        try {
            console.log('Uploading recording:', fileName, 'Size:', blob.size);

            // Step 1: Get a signed URL from your Cloudflare Worker
            const response = await fetch('https://gcs-signed-url-416379081464.europe-west1.run.app/getSignedUrl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fileName,
                    fileType: 'video/webm'
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to get upload URL: ${errorData.error || response.statusText}`);
            }

            const { url } = await response.json();

            // Step 2: Use the signed URL to upload directly to GCS
            const uploadResponse = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'video/webm',
                },
                body: blob,
            });

            if (!uploadResponse.ok) {
                throw new Error(`Failed to upload recording: ${uploadResponse.statusText}`);
            }

            console.log('Recording uploaded successfully');
            return true;
        } catch (error) {
            console.error("Error uploading recording:", error);
            alert("Failed to upload recording. Please try again later.");
            return false;
        }
    };

    // Clean up on component unmount
    useEffect(() => {
        return () => {
            if (drawIntervalRef.current) {
                clearInterval(drawIntervalRef.current);
            }
            // Clean up the recording canvas
            recordingCanvasRef.current = null;
        };
    }, []);

    return {startRecording, stopRecording};
};

export default useRecording;