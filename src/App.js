import logo from './logo.svg'
import './App.css'
import Login from './Login/Login'
import Editor from './Editor/Editor'
import { BrowserRouter as Router, Route } from 'react-router-dom'

//func
function App() {
  // const [name, setName]=useState('')
  // const [room, setRoom]=useState('')
  return (
    <Router>
      <Route path='/' exact component={Login}></Route>
      <Route path='/room' exact component={Editor}></Route>
    </Router>
  )
}

export default App
