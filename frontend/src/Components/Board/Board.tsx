import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { MuiColorInput } from 'mui-color-input'
import { socket } from '../../utills/socket';
import { useDraw } from '../../hooks/useDraw'
import { drawLine } from '../../utills/drawLine'
import { Draw, Point } from '../../types/types';
import './Board.css';
import Slider from '@mui/material/Slider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { handleSaveImage } from '../../utills/downloadImage';
import DownloadIcon from '@mui/icons-material/Download';
import SaveIcon from '@mui/icons-material/Save';

interface BoardProps {
    boardId: string;
}

type DrawLineProps = {
    prevPoint: Point | null;
    currentPoint: Point;
    color: string;
    brushWidth: string;
}

const Board: React.FC<BoardProps> = ({ boardId }) => {
    const [color, setColor] = useState<string>('#000')
    const [brushWidth, setBrushWidth] = useState<string>('3')
    const { canvasRef, onMouseDown, clear } = useDraw(createLine)
    const navigate = useNavigate()
    const canvasWidth = 0.95 * window.innerWidth;
    const canvasHeight = 0.8 * window.innerHeight

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d')
        if (!canvasRef) return

        socket.emit('join-board', boardId);

        socket.on('get-canvas-state', () => {
            handleSaveBoard()
        })

        socket.on('canvas-state-from-server', (state: string) => {
            const img = new Image()
            img.src = state
            img.onload = () => {
                ctx?.drawImage(img, 0, 0)
            }
        })

        socket.on('draw-line', ({ prevPoint, currentPoint, color, brushWidth }: DrawLineProps) => {
            if (!ctx) return
            drawLine({ prevPoint, currentPoint, ctx, color, brushWidth })
        })

        socket.on('clear', clear)

        return () => {
            socket.off('draw-line')
            socket.off('get-canvas-state')
            socket.off('canvas-state-from-server')
            socket.off('clear')
        }
    }, [canvasRef, boardId])


    function createLine({ prevPoint, currentPoint, ctx }: Draw) {
        socket.emit('draw-line', { prevPoint, currentPoint, color, brushWidth, boardId });
        drawLine({ prevPoint, currentPoint, ctx, color, brushWidth });
    }

    const handleClearBoard = () => {
        socket.emit('clear', boardId);
    }

    const handleBrushChange = (event: Event, value: number | number[]) => {

        setBrushWidth(String(value));
    };

    const handleBackClick = () => {
        handleSaveBoard()
        navigate('/')
    }

    const handleSaveBoard = () => {
        const currentBoardState = canvasRef.current?.toDataURL()
        if (!currentBoardState) return
        socket.emit('canvas-state', { state: currentBoardState, boardId });
    }



    useEffect(() => {

        window.addEventListener('beforeunload', handleSaveBoard);

        return () => {
            window.removeEventListener('beforeunload', handleSaveBoard);
        };

    }, [canvasRef, boardId]);

    return (
        <>

            <div className='board-container'>
                <Button
                    onClick={handleBackClick}
                    sx={{ zIndex: 3, color: 'black', padding: '0', margin: 0, minWidth: '30px', maxHeight: '30px', position: 'absolute', top: '15px', left: '15px' }}>
                    <ArrowBackIcon />
                </Button>
                <Button
                    onClick={handleSaveBoard}
                    sx={{ zIndex: 3, color: '05887B', padding: '0', margin: 0, minWidth: '30px', maxHeight: '30px', position: 'absolute', top: '15px', right: '15px' }}>
                    <SaveIcon />
                </Button>
                <h1 className='board-title'>{`${boardId}'s board`}</h1>
                <canvas
                    className='board-canvas'
                    color='white'
                    ref={canvasRef}
                    onMouseDown={onMouseDown}
                    width={canvasWidth}
                    height={canvasHeight}
                    style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
                ></canvas>
                <div className='instruments-panel'>
                    <Slider
                        onChange={handleBrushChange}
                        size="small"
                        defaultValue={5}

                        max={8}
                        min={5}
                        aria-label="Small"
                        sx={{ maxWidth: '100px', margin: 'auto 0' }}

                    />
                    <MuiColorInput
                        value={color}
                        onChange={setColor}
                        sx={{ height: '30px', width: '180px' }}
                        inputProps={{ style: { padding: '10px' } }}
                    />

                    {/* <Button
                    sx={{ height: '43px' }}
                    onClick={handleUndo}
                    variant='outlined'
                    endIcon={<UndoIcon />}
                >
                    Undo
                </Button> */}
                    <Button
                        sx={{ height: '43px' }}
                        onClick={handleClearBoard}

                        variant='outlined'
                        color='error'
                        endIcon={<DeleteIcon />}
                    >
                        Clear
                    </Button>
                    <Button
                        sx={{ height: '43px' }}
                        variant='outlined'
                        onClick={() => { handleSaveImage(canvasRef) }}
                        endIcon={<DownloadIcon />}
                    >
                        Download
                    </Button>
                </div>
            </div>
        </>
    );
}

export default Board;
