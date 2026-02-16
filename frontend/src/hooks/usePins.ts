import {doc, onSnapshot, addDoc, collection, deleteDoc, query, where, getDocs} from "firebase/firestore";
import {firestore} from "../firebase/FireBaseSecurityContextProvider.tsx";
import {useState, useEffect, useRef} from "react";
import {v4 as uuidv4} from 'uuid';

export interface IPin {
    visible: boolean;
    id: string;
    x: number;
    y: number;
    docId?: string; // Firestore document ID
}

export interface IBox {
    visible: boolean;
    id: string;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    docId?: string; // Firestore document ID
}

const usePins = (callId: string | undefined, canvasRef: React.RefObject<HTMLCanvasElement | null> | null) => {
    const [pins, setPins] = useState<IPin[]>([]);
    const [boxes, setBoxes] = useState<IBox[]>([]);
    const startPosRef = useRef<{ x: number; y: number } | null>(null);
    const isDeleteActionRef = useRef(false);

    useEffect(() => {
        if (!callId || callId === '' || callId === 'new') {
            console.log('No valid callId yet, skipping pin/box setup');
            return () => {
            }; // Return empty cleanup function
        }

        console.log('Setting up pins/boxes listeners for callId:', callId);

        const callDocRef = doc(firestore, 'calls', callId);
        const pinCollectionRef = collection(callDocRef, 'pins');
        const boxCollectionRef = collection(callDocRef, 'boxes');

        const unsubscribePins = onSnapshot(pinCollectionRef, (snapshot) => {
            const newPins = snapshot.docs.map(doc => ({...doc.data(), docId: doc.id} as IPin));
            setPins(newPins);
            console.log('Pins updated:', newPins);
        });

        const unsubscribeBoxes = onSnapshot(boxCollectionRef, (snapshot) => {
            const newBoxes = snapshot.docs.map(doc => ({...doc.data(), docId: doc.id} as IBox));
            setBoxes(newBoxes);
            console.log('Boxes updated:', newBoxes);
        });

        return () => {
            unsubscribePins();
            unsubscribeBoxes();
        };
    }, [callId]);

    const addBox = async (box: IBox, activeCallId: string) => {
        if (!activeCallId || activeCallId === '' || activeCallId === 'new') {
            console.error('Cannot add box: No valid callId');
            return;
        }

        const callDocRef = doc(firestore, 'calls', activeCallId);
        const boxCollectionRef = collection(callDocRef, 'boxes');
        await addDoc(boxCollectionRef, box);
    };

    const addPin = async (pin: IPin, activeCallId: string) => {
        if (!activeCallId || activeCallId === '' || activeCallId === 'new') {
            console.error('Cannot add pin: No valid callId');
            return;
        }

        const callDocRef = doc(firestore, 'calls', activeCallId);
        const pinCollectionRef = collection(callDocRef, 'pins');
        await addDoc(pinCollectionRef, pin);
    };

    const removeBox = async (boxId: string, activeCallId: string) => {
        if (!activeCallId || activeCallId === '' || activeCallId === 'new') {
            console.error('Cannot remove box: No valid callId');
            return;
        }

        const callDocRef = doc(firestore, 'calls', activeCallId);
        const boxCollectionRef = collection(callDocRef, 'boxes');

        const q = query(boxCollectionRef, where("id", "==", boxId));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const boxDocRef = querySnapshot.docs[0].ref;
            await deleteDoc(boxDocRef);
        } else {
            console.error(`No box found with ID: ${boxId}`);
        }
    };

    const removePin = async (pinId: string, activeCallId: string) => {
        if (!activeCallId || activeCallId === '' || activeCallId === 'new') {
            console.error('Cannot remove pin: No valid callId');
            return;
        }

        const callDocRef = doc(firestore, 'calls', activeCallId);
        const pinCollectionRef = collection(callDocRef, 'pins');

        const q = query(pinCollectionRef, where("id", "==", pinId));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const pinDocRef = querySnapshot.docs[0].ref;
            await deleteDoc(pinDocRef);
        } else {
            console.error(`No pin found with ID: ${pinId}`);
        }
    };

    const isPointInPinDeleteButton = (x: number, y: number) => {
        for (const pin of pins) {
            if (pin.visible) {
                const deleteX = pin.x + 15;
                const deleteY = pin.y - 15;
                const dx = x - deleteX;
                const dy = y - deleteY;
                if (Math.sqrt(dx * dx + dy * dy) <= 10) {
                    return true;
                }
            }
        }
        return false;
    };

    const isPointInBoxDeleteButton = (x: number, y: number) => {
        for (const box of boxes) {
            if (box.visible) {
                const boxX = Math.min(box.startX, box.endX);
                const boxY = Math.min(box.startY, box.endY);
                const boxWidth = Math.abs(box.endX - box.startX);

                const deleteX = boxX + boxWidth;
                const deleteY = boxY;
                const dx = x - deleteX;
                const dy = y - deleteY;
                if (Math.sqrt(dx * dx + dy * dy) <= 10) {
                    return true;
                }
            }
        }
        return false;
    };

    const isPointInItem = (x: number, y: number) => {
        for (const pin of pins) {
            if (pin.visible) {
                const dx = x - pin.x;
                const dy = y - pin.y;
                if (Math.sqrt(dx * dx + dy * dy) <= 15) {
                    return true;
                }
            }
        }

        for (const box of boxes) {
            if (box.visible) {
                const boxX = Math.min(box.startX, box.endX);
                const boxY = Math.min(box.startY, box.endY);
                const boxWidth = Math.abs(box.endX - box.startX);
                const boxHeight = Math.abs(box.endY - box.startY);

                if (
                    x >= boxX - 5 &&
                    x <= boxX + boxWidth + 5 &&
                    y >= boxY - 5 &&
                    y <= boxY + boxHeight + 5
                ) {
                    return true;
                }
            }
        }

        return false;
    };

    const handleItemDeletion = (itemId: string, type: 'pin' | 'box') => {
        isDeleteActionRef.current = true;

        setTimeout(() => {
            isDeleteActionRef.current = false;
        }, 100);

        if (type === 'pin') {
            removePin(itemId, callId!);
        } else {
            removeBox(itemId, callId!);
        }
    };

    const handleMouseDown = (event: React.MouseEvent) => {
        if (!canvasRef) {
            console.error('Canvas ref is not set');
            return
        }
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (isPointInPinDeleteButton(x, y) || isPointInBoxDeleteButton(x, y)) {
            isDeleteActionRef.current = true;
            return;
        }

        if (isPointInItem(x, y)) {
            return;
        }

        startPosRef.current = {x, y};
    };

    const handleMouseUp = (event: React.MouseEvent) => {
        if (!canvasRef) {
            console.error('Canvas ref is not set');
            return
        }
        const canvas = canvasRef.current;
        if (!canvas || !startPosRef.current) return;

        if (isDeleteActionRef.current) {
            return;
        }

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (Math.abs(startPosRef.current.x - x) > 5 || Math.abs(startPosRef.current.y - y) > 5) {
            addBox({
                visible: true,
                id: uuidv4(),
                startX: startPosRef.current.x,
                startY: startPosRef.current.y,
                endX: x,
                endY: y,
            }, callId!);
        } else {
            addPin({
                visible: true,
                id: uuidv4(),
                x,
                y,
            }, callId!);
        }
        startPosRef.current = null;
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef) {
            console.error('Canvas ref is not set');
            return
        }
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (isPointInPinDeleteButton(x, y) || isPointInBoxDeleteButton(x, y)) {
            canvas.style.cursor = 'pointer';
        } else if (isPointInItem(x, y)) {
            canvas.style.cursor = 'pointer';
        } else {
            canvas.style.cursor = 'default';
        }
    };

    return {
        pins,
        boxes,
        addBox,
        addPin,
        removeBox,
        removePin,
        handleItemDeletion,
        handleMouseDown,
        handleMouseUp,
        handleMouseMove
    };
};

export default usePins;