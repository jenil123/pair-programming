import React from 'react'
import { useState, useEffect } from 'react'
import uuid from 'react-uuid'
import { Link } from 'react-router-dom'
import './Login.css'
const Login = () => {
  const [roomId, setRoomId] = useState('')
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  // const generateUid = () => {
  //   const id = uuid()
  //   console.log(id)
  //   setUid(id)
  //   console.log(uid)
  // }
  const changeRoom = (e) => {
    //console.log(room)
    e.preventDefault()
    console.log(e)
    if (room === '') {
      setRoom(uuid() + new Date().getTime())
    }
  }
  return (
    <div className='joinOuterContainer'>
      <div className='joinInnerContainer'>
        <h1 className='heading'>Login to create a room.</h1>
        <div>
          <input
            type='text'
            className='joinInput'
            placeholder='Name'
            required={true}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type='text'
            className='joinInput'
            placeholder='Room'
            required={false}
            onChange={(e) => setRoom(e.target.value)}
          />
        </div>
        {room === '' ? setRoom(uuid() + new Date().getTime()) : room}
        <Link to={`/room?id=${room}`}>
          <button className={'btn'} type='submit'>
            Make a room
          </button>
        </Link>
        <p className='p'>
          Share the uid present in the URL with friends for collaborating{' '}
        </p>
      </div>
    </div>
  )
}

export default Login
