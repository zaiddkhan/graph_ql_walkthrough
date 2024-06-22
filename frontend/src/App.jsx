import { useState } from 'react'
import { Route,Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import TransactionPage from './pages/TransactionPage'
import NotFoundPage from './pages/NotFoundPage'
import SingUpPage from './pages/SignUp'
import Header from './components/ui/Header'
import { useQuery } from '@apollo/client'
import { GET_AUTHENTICATED_USERS } from './graphql/queries/userquery'
import { Toaster } from 'react-hot-toast'

function App() {
  const [count, setCount] = useState(0)
  const { loading,data,error} = useQuery(GET_AUTHENTICATED_USERS)
  console.log(data)
  const authUser = true;
  return (

    <>
    { data?.authUser && <Header/> } 
    
    
      <Routes>
        <Route path='/' element= {<HomePage/>} />
        <Route path='/login' element = { < LoginPage/>} />
        <Route path = '/signup' element = { <SingUpPage />} />
        <Route path = '/transaction/:id' element = { <TransactionPage />} />
        <Route path = '*' element  = {< NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
