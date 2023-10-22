import React, { useEffect, useState } from 'react';
import Board from '../Board/Board';
import { Routes, Route } from 'react-router-dom';
import MainPage from '../Main/Main';
import { socket } from '../../utills/socket';
import { API_URL } from '../../utills/constants';

function App() {

  const [isPopupOpened, setIsPopupOpened] = useState(false)
  const [boards, setBoards] = useState<any[]>([])
  const [inputErrorText, setInputErrorText] = useState('')

  const handleOpenPopup = () => {
    setIsPopupOpened(true)
  }

  const handleClosePopup = () => {
    setIsPopupOpened(false)
  }

  const handleCreateBoard = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget);
    const formDataObject: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });

    if (!formDataObject.name) {
      setInputErrorText('Please enter a name')
      return
    }

    const isNameExists = boards.some(board => board.name === formDataObject.name);
    if (isNameExists) {
      setInputErrorText('This name is already in use')
      return
    }

    socket.emit('join-board', formDataObject.name);
    updateBoards()
    setInputErrorText('')
    handleClosePopup()
  }


  useEffect(() => {
    updateBoards()
  }, [])

  const updateBoards = () => {
    return fetch(`${API_URL}/rooms`, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((res) => res.json())
      .then((data) => setBoards(data))
  }


  return (
    <>
      <Routes>
        <Route path='/'
          element=
          {
            <MainPage
              handleCreateBoard={handleCreateBoard}
              handleOpenPopup={handleOpenPopup}
              handleClosePopup={handleClosePopup}
              isPopupOpened={isPopupOpened}
              boards={boards}
              inputErrorText={inputErrorText}
            />
          }
        />
        {boards.map((board, index) => (
          <Route key={index} path={`/boards/${board.name}'s-board`} element={<Board boardId={board.name} />} />
        ))}
        {/* <Route path='/boards/1' element={<Board boardId='nikita' />} /> */}
      </Routes>
    </>
  );
}

export default App;