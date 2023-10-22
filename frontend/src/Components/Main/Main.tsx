import React, { FC } from 'react'
import './Main.css'
import Button from '@mui/material/Button';
import BrushIcon from '@mui/icons-material/Brush';
import CreateBoard from '../CreateBoard/CreateBoard';
import { useNavigate } from 'react-router-dom';

interface MainPageProps {
    handleCreateBoard: (event: React.FormEvent<HTMLFormElement>) => void;
    handleClosePopup: () => void;
    handleOpenPopup: () => void;
    isPopupOpened: boolean;
    boards: any[];
    inputErrorText: string;
}

const MainPage: FC<MainPageProps> = ({ handleClosePopup, handleCreateBoard, handleOpenPopup, isPopupOpened, boards, inputErrorText }) => {

    const navigate = useNavigate()
    return (
        <>
            <header className='header'>
                <div className='logo'></div>
                <h1 className='header__title'>Drawing app</h1>
            </header>
            <main className='main'>
                <h2 style={{ textAlign: 'center', margin: '15px 0' }}>Active boards</h2>
                <div className='boards'>
                    {boards.map((board, index) =>
                    (<div key={index} className='board'>
                        <img className='board-snaphot' src={board.canvasState} alt="" />
                        <div className='board-name-container'>
                            <p className='board-name'>{`${board.name}'s board`}</p>
                            <Button onClick={() => { navigate(`/boards/${board.name}'s-board`) }} variant='outlined' sx={{ borderColor: '#dadce0', textTransform: 'none', mr: '10px', height: '30px', mt: 'auto', mb: 'auto' }} endIcon={<BrushIcon />}>Join</Button>
                        </div>
                    </div>)
                    )}
                </div>
            </main>
            <CreateBoard inputErrorText={inputErrorText} handleCreateBoard={handleCreateBoard} handleClosePopup={handleClosePopup} isOpened={isPopupOpened} />
            <footer className='footer'>
                <button onClick={handleOpenPopup} className='add-board-btn'><div className='add-board-btn-img'></div></button>
                <p className='footer__heading'>
                    Itransition educational project
                </p>
                <div className='footer__links-container'>
                    <p className='footer__link'>Savoskin Nikita @ {new Date().getFullYear()}</p>
                    <a
                        className='footer__link'
                        target='_blank'
                        rel='noreferrer'
                        href='https://www.itransition.com/'
                    >
                        Itransition
                    </a>
                    <a
                        className='footer__link'
                        target='_blank'
                        rel='noreferrer'
                        href='https://github.com/Augenb1ick'
                    >
                        Github
                    </a>
                </div>
            </footer>
        </>

    )
}

export default MainPage;