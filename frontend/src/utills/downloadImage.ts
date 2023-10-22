export const handleSaveImage = (
    canvasRef: React.RefObject<HTMLCanvasElement>
) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');

    const imageData = canvas.toDataURL();

    link.href = imageData;
    link.download = 'my_drawing.jpeg';

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
};
