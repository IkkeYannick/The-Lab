import {useState, useRef, useContext} from 'react';
import {firestore} from '../firebase/FireBaseSecurityContextProvider.tsx'; // Import firestore from firebaseConfig
import {doc, collection, addDoc, setDoc, updateDoc, onSnapshot, getDoc} from 'firebase/firestore';
import FireBaseSecurityContext from "../firebase/FireBaseSecurityContext.ts";

enum CallStatus {
    WAITING,
    ONGOING,
    DONE,
}

export const useWebRTC = () => {
    const [localVideoStream, setLocalVideoStream] = useState<MediaStream | null>(null);
    const [localAudioStream, setLocalAudioStream] = useState<MediaStream | null>(null);
    //const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    //const [remoteStream, setRemoteStream] = useState<MediaStream>(new MediaStream);
    const [callId, setCallId] = useState<string>('');
    const [isCallActive, setIsCallActive] = useState(false);
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.WAITING);
    const {loggedInUser} = useContext(FireBaseSecurityContext)

    const fieldTechVideoRef = useRef<HTMLVideoElement | null>(null);
    const masterTechVideoRef = useRef<HTMLVideoElement | null>(null);
    const masterTechAudioRef = useRef<HTMLAudioElement | null>(null);
    const peerConnection = useRef(new RTCPeerConnection({
        iceServers: [
            {urls: 'stun:stun1.l.google.com:19302'},
            {urls: 'stun:stun2.l.google.com:19302'},
        ],
        iceCandidatePoolSize: 10,
    }));

    // Start the webcam and set up media streams
    const startWebcam = async (fieldTech: boolean = true, deviceId: string = '') => {
        try {
            let constraints;
                if (fieldTech) {
                    // Field Tech needs video and audio
                    const videoConstraints = deviceId
                        ? {deviceId: {exact: deviceId}}
                        : true;

                    constraints = {
                        video: videoConstraints,
                        audio: true
                    };
                } else {
                    // Master Tech needs only audio
                    constraints = {
                        video: false,
                        audio: true
                    };
                }

            // Get new media stream with the selected device
            const localStream = await navigator.mediaDevices.getUserMedia(constraints);

            const videoTracks = localStream.getVideoTracks();
            const localVideoStream = new MediaStream(videoTracks);

            // Separate video and audio tracks for field tech
            if (fieldTech) {
                peerConnection.current.addTrack(videoTracks[0], localVideoStream);
            }

            const audioTracks = localStream.getAudioTracks();
            const localAudioStream = new MediaStream(audioTracks);
            peerConnection.current.addTrack(audioTracks[0], localAudioStream);


            peerConnection.current.ontrack = (event) => {
                const stream = event.streams[0];
                const remoteVideoTracks = stream.getVideoTracks();
                const remoteAudioTracks = stream.getAudioTracks();

                console.log('Remote Track Details:', {
                    videoTrackCount: remoteVideoTracks.length,
                    audioTrackCount: remoteAudioTracks.length
                });

                console.log('Remote Audio Track Details:', {
                    trackCount: remoteAudioTracks.length,
                    tracks: remoteAudioTracks.map(track => ({
                        id: track.id,
                        kind: track.kind,
                        enabled: track.enabled,
                        muted: track.muted
                    }))
                });

                if (remoteVideoTracks.length === 0) {
                    console.warn('No video tracks received');
                } else {
                    const remoteVideoStream = new MediaStream(remoteVideoTracks);
                    if (masterTechVideoRef.current) {
                        masterTechVideoRef.current.srcObject = remoteVideoStream;
                    }
                }

                // Check if audio tracks are empty
                if (remoteAudioTracks.length === 0) {
                    console.warn('No audio tracks received');
                } else {
                    const remoteAudioStream = new MediaStream(remoteAudioTracks);
                    if (masterTechAudioRef.current) {
                        masterTechAudioRef.current.srcObject = remoteAudioStream;
                    }
                }
            };

            // Update state with new streams
            setLocalVideoStream(localVideoStream);
            setLocalAudioStream(localAudioStream);
            //setLocalStream(localAudioStream);

            //zet de srcObject van de video elementen naar de nieuwe streams
            if (fieldTech) {
                if (fieldTechVideoRef.current) {
                    fieldTechVideoRef.current.srcObject = localVideoStream;
                }
            }

            return localStream;
        } catch (error) {
            console.error('Error starting media:', error);
            return null;
        }
    };

    // Create a call (offer)
    const createCall = async () => {
        try {
            const callDocRef = doc(collection(firestore, 'calls'));
            const offerCandidatesRef = collection(callDocRef, 'offerCandidates');
            const answerCandidatesRef = collection(callDocRef, 'answerCandidates');

            setCallId(callDocRef.id);

            peerConnection.current.onicecandidate = (event) => {
                if (event.candidate) {
                    addDoc(offerCandidatesRef, event.candidate.toJSON()); // Using addDoc to add a new candidate
                }
            };
            const offerDescription = await peerConnection.current.createOffer();
            await peerConnection.current.setLocalDescription(offerDescription);

            const offer = {
                sdp: offerDescription.sdp,
                type: offerDescription.type
            };

            await setDoc(callDocRef, {offer, status: 'waiting', technician: loggedInUser, date: new Date()});

            // Listen for the remote answer
            onSnapshot(callDocRef, (snapshot) => {
                const data = snapshot.data();
                if (data?.answer && !peerConnection.current.remoteDescription) {
                    const answerDescription = new RTCSessionDescription(data.answer);
                    peerConnection.current.setRemoteDescription(answerDescription);
                    setCallStatus(CallStatus.ONGOING);
                }
            });

            // Listen for remote ICE candidates
            onSnapshot(answerCandidatesRef, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        const candidate = new RTCIceCandidate(change.doc.data());
                        peerConnection.current.addIceCandidate(candidate);
                    }
                });
            });

            setIsCallActive(true);
        } catch (error) {
            console.error('Error creating call:', error);
        }
    };

    // Answer the call
    const answerCall = async (callId: string) => {
        try {
            if (!callId) {
                console.error("No call ID provided!");
                return;
            }

            const callDocRef = doc(firestore, 'calls', callId);
            const answerCandidatesRef = collection(callDocRef, 'answerCandidates');
            const offerCandidatesRef = collection(callDocRef, 'offerCandidates');

            peerConnection.current.onicecandidate = (event) => {
                if (event.candidate) {
                    addDoc(answerCandidatesRef, event.candidate.toJSON());
                }
            };

            const callDocSnap = await getDoc(callDocRef);
            if (!callDocSnap.exists()) {
                console.error("Call document does not exist!");
                return;
            }

            const callData = callDocSnap.data();
            if (!callData?.offer) {
                console.error("No offer found in the call document!");
                return;
            }

            const offerDescription = new RTCSessionDescription(callData.offer);
            await peerConnection.current.setRemoteDescription(offerDescription);

            const answerDescription = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answerDescription);

            const answer = {
                type: answerDescription.type,
                sdp: answerDescription.sdp,
            };

            await updateDoc(callDocRef, {answer, status: 'ongoing'});

            onSnapshot(offerCandidatesRef, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        const candidate = new RTCIceCandidate(change.doc.data());
                        peerConnection.current.addIceCandidate(candidate);
                    }
                });
            });

            setIsCallActive(true);
        } catch (error) {
            console.error('Error answering call:', error);
        }
    };


    // Hangup the call
    const hangUp = async (callId: string, isMaster: boolean) => {
        try {
            if (!callId) {
                console.error("No call ID provided!");
                return;
            }

            const callDocRef = doc(firestore, 'calls', callId);
            const callDocSnap = await getDoc(callDocRef);
            if (callDocSnap.exists()) {
                peerConnection.current.close();
                setIsCallActive(false);
                setCallStatus(CallStatus.DONE);
                const callData = callDocSnap.data();
                const duration = new Date().getTime() - callData.date.toDate().getTime();
                if (isMaster) {
                    await updateDoc(callDocRef, {status: 'Resolved', duration: duration});
                    document.location.href = '/Dashboard';
                } else {
                    await updateDoc(callDocRef, {status: 'Hangup', duration: duration});
                    document.location.href = '/FieldCallPage';
                }
            } else {
                console.error("Call document does not exist!");
            }
        } catch (error) {
            console.error('Error hanging up the call:', error);
        }
    };

    return {
        localAudioStream,
        localVideoStream,
        isCallActive,
        startWebcam,
        createCall,
        answerCall,
        hangUp,
        fieldTechVideoRef,
        masterTechVideoRef,
        masterTechAudioRef,
        callId,
        callStatus,
    };
};
