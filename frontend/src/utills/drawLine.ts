import { Draw } from '../types/types';

type DrawLineProps = Draw & {
    color: string;
    brushWidth: string;
};

export const drawLine = ({
    prevPoint,
    currentPoint,
    ctx,
    color,
    brushWidth,
}: DrawLineProps) => {
    const { x: currX, y: currY } = currentPoint;
    const lineColor = color;
    const lineWidth = Number(brushWidth);

    let startPoint = prevPoint ?? currentPoint;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.strokeStyle = lineColor;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();

    ctx.beginPath();
    ctx.fill();
};
