import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import React, { FC } from 'react'
import './CreateBoard.css'
import CloseIcon from '@mui/icons-material/Close';

interface CreateBoardProps {
    isOpened: boolean;
    handleClosePopup: () => void;
    handleCreateBoard: (event: React.FormEvent<HTMLFormElement>) => void;
    inputErrorText: string;
}

const CreateBoard: FC<CreateBoardProps> = ({ isOpened, handleClosePopup, handleCreateBoard, inputErrorText }) => {
    return (
        <div className={`popup ${isOpened && 'popup_opened'} `}>
            <Box
                onSubmit={handleCreateBoard}
                component='form'
                sx=
                {{
                    width: '250px',
                    height: '160px',
                    borderRadius: '10px',
                    backgroundColor: 'white',
                    boxShadow: "0px 4px 4px 0px rgba(67, 165, 153, 0.20)",
                    display: 'flex',
                    flexDirection: 'column',
                    position: "relative",
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 4,
                    padding: "20px"
                }}
            >
                <p
                    style=
                    {{
                        fontSize: '25px',
                        padding: '15px 0px',
                        textAlign: 'center',
                        margin: 0,
                    }}>New drawing board</p>
                <TextField
                    error={inputErrorText ? true : false}
                    helperText={inputErrorText}
                    name='name'
                    sx={{ padding: '10px 20px', width: 'calc(100% - 40px)' }}
                    variant='standard'
                    placeholder='Your name' />
                <Button
                    sx={{ width: '85%' }}
                    variant='text'
                    type='submit'
                >
                    Create
                </Button>
                <Button
                    onClick={handleClosePopup}
                    sx=
                    {{
                        position: 'absolute',
                        top: '-24px',
                        right: '-24px',
                        color: 'black',
                        padding: 0,
                        minWidth: '10px',
                        borderRadius: "50%"
                    }}><CloseIcon /></Button>
            </Box>
        </div >
    )
}

export default CreateBoard