import React, { useEffect, useRef } from 'react';
import { IPin, IBox } from './usePins.ts';

interface CanvasDrawingRendererProps {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    pins: IPin[];
    boxes: IBox[];
    videoRef: React.RefObject<HTMLVideoElement>;
    onPinDelete: (pinId: string) => void;
    onBoxDelete: (boxId: string) => void;
}

const CanvasDrawingRenderer: React.FC<CanvasDrawingRendererProps> = ({
                                                                         canvasRef,
                                                                         pins,
                                                                         boxes,
                                                                         videoRef,
                                                                         onPinDelete,
                                                                         onBoxDelete
                                                                     }) => {
    const animationFrameId = useRef<number | null>(null);
    const activeItemRef = useRef<{ id: string, type: 'pin' | 'box' } | null>(null);

    // Function to draw pins on the canvas
    const drawPin = (ctx: CanvasRenderingContext2D, pin: IPin, isActive: boolean = false) => {
        if (!pin.visible) return;

        // Draw a circle
        ctx.beginPath();
        ctx.arc(pin.x, pin.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? 'rgba(255, 0, 0, 0.9)' : 'rgba(255, 0, 0, 0.7)';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw an X
        ctx.beginPath();
        ctx.moveTo(pin.x - 5, pin.y - 5);
        ctx.lineTo(pin.x + 5, pin.y + 5);
        ctx.moveTo(pin.x + 5, pin.y - 5);
        ctx.lineTo(pin.x - 5, pin.y + 5);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw a delete button if active
        if (isActive) {
            ctx.beginPath();
            ctx.arc(pin.x + 15, pin.y - 15, 8, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.strokeStyle = 'red';
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(pin.x + 12, pin.y - 15);
            ctx.lineTo(pin.x + 18, pin.y - 15);
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    };

    // Function to draw boxes on the canvas
    const drawBox = (ctx: CanvasRenderingContext2D, box: IBox, isActive: boolean = false) => {
        if (!box.visible) return;

        const x = Math.min(box.startX, box.endX);
        const y = Math.min(box.startY, box.endY);
        const width = Math.abs(box.endX - box.startX);
        const height = Math.abs(box.endY - box.startY);

        // Draw a rectangle
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.strokeStyle = isActive ? 'rgba(0, 255, 0, 0.9)' : 'rgba(0, 255, 0, 0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw a delete button if active
        if (isActive) {
            ctx.beginPath();
            ctx.arc(x + width, y, 8, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.strokeStyle = 'red';
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(x + width - 3, y);
            ctx.lineTo(x + width + 3, y);
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    };

    // Check if a point is inside a pin
    const isPointInPin = (x: number, y: number, pin: IPin) => {
        const dx = x - pin.x;
        const dy = y - pin.y;
        return Math.sqrt(dx * dx + dy * dy) <= 10;
    };

    // Check if a point is inside a box
    const isPointInBox = (x: number, y: number, box: IBox) => {
        const boxX = Math.min(box.startX, box.endX);
        const boxY = Math.min(box.startY, box.endY);
        const boxWidth = Math.abs(box.endX - box.startX);
        const boxHeight = Math.abs(box.endY - box.startY);

        return (
            x >= boxX - 5 &&
            x <= boxX + boxWidth + 5 &&
            y >= boxY - 5 &&
            y <= boxY + boxHeight + 5
        );
    };

    // Check if a point is inside the delete button of a pin
    const isPointInPinDeleteButton = (x: number, y: number, pin: IPin) => {
        const dx = x - (pin.x + 15);
        const dy = y - (pin.y - 15);
        return Math.sqrt(dx * dx + dy * dy) <= 8;
    };

    // Check if a point is inside the delete button of a box
    const isPointInBoxDeleteButton = (x: number, y: number, box: IBox) => {
        const boxX = Math.min(box.startX, box.endX);
        const boxY = Math.min(box.startY, box.endY);
        const boxWidth = Math.abs(box.endX - box.startX);

        const dx = x - (boxX + boxWidth);
        const dy = y - boxY;
        return Math.sqrt(dx * dx + dy * dy) <= 8;
    };

    // Handle mouse click
    const handleClick = (e: MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if we clicked on a pin delete button
        for (const pin of pins) {
            if (pin.visible && isPointInPinDeleteButton(x, y, pin)) {
                onPinDelete(pin.id);
                activeItemRef.current = null;
                return;
            }
        }

        // Check if we clicked on a box delete button
        for (const box of boxes) {
            if (box.visible && isPointInBoxDeleteButton(x, y, box)) {
                onBoxDelete(box.id);
                activeItemRef.current = null;
                return;
            }
        }

        // Check if we clicked on a pin
        for (const pin of pins) {
            if (pin.visible && isPointInPin(x, y, pin)) {
                activeItemRef.current = { id: pin.id, type: 'pin' };
                return;
            }
        }

        // Check if we clicked on a box
        for (const box of boxes) {
            if (box.visible && isPointInBox(x, y, box)) {
                activeItemRef.current = { id: box.id, type: 'box' };
                return;
            }
        }

        // If we didn't click on anything, clear the active item
        activeItemRef.current = null;
    };

    // Handle mouse move
    const handleMouseMove = (e: MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Update cursor based on what we're hovering over
        let isHoveringOverItem = false;

        // Check if we're hovering over a pin delete button
        for (const pin of pins) {
            if (pin.visible && isPointInPinDeleteButton(x, y, pin)) {
                canvas.style.cursor = 'pointer';
                isHoveringOverItem = true;
                break;
            }
        }

        // Check if we're hovering over a box delete button
        if (!isHoveringOverItem) {
            for (const box of boxes) {
                if (box.visible && isPointInBoxDeleteButton(x, y, box)) {
                    canvas.style.cursor = 'pointer';
                    isHoveringOverItem = true;
                    break;
                }
            }
        }

        // Check if we're hovering over a pin
        if (!isHoveringOverItem) {
            for (const pin of pins) {
                if (pin.visible && isPointInPin(x, y, pin)) {
                    canvas.style.cursor = 'pointer';
                    isHoveringOverItem = true;
                    break;
                }
            }
        }

        // Check if we're hovering over a box
        if (!isHoveringOverItem) {
            for (const box of boxes) {
                if (box.visible && isPointInBox(x, y, box)) {
                    canvas.style.cursor = 'pointer';
                    isHoveringOverItem = true;
                    break;
                }
            }
        }

        // Reset cursor if not hovering over anything
        if (!isHoveringOverItem) {
            canvas.style.cursor = 'default';
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Make sure the canvas is sized correctly
        const resizeCanvas = () => {
            const video = videoRef.current;
            if (!video) return;

            // Set canvas size to match the video container
            canvas.width = video.clientWidth;
            canvas.height = video.clientHeight;
        };

        // Initial resize
        resizeCanvas();

        // Add event listeners
        canvas.addEventListener('click', handleClick);
        canvas.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', resizeCanvas);

        // Draw function
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw all visible boxes
            boxes.forEach(box => {
                if (box.visible) {
                    const isActive = activeItemRef.current?.id === box.id && activeItemRef.current?.type === 'box';
                    drawBox(ctx, box, isActive);
                }
            });

            // Draw all visible pins
            pins.forEach(pin => {
                if (pin.visible) {
                    const isActive = activeItemRef.current?.id === pin.id && activeItemRef.current?.type === 'pin';
                    drawPin(ctx, pin, isActive);
                }
            });

            animationFrameId.current = requestAnimationFrame(draw);
        };

        // Start drawing
        draw();

        // Cleanup
        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            canvas.removeEventListener('click', handleClick);
            canvas.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [pins, boxes, canvasRef, videoRef, onPinDelete, onBoxDelete]);

    return null;
};

export default CanvasDrawingRenderer;