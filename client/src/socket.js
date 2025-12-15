import io from 'socket.io-client'

const socket = io(import.meta.env.L || 'http://localhost:5001', {
  auth: {
    token: localStorage.getItem('token')
  }
})

export default socket
