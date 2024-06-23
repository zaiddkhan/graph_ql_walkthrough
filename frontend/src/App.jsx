import { useState } from 'react'
import { Route,Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import TransactionPage from './pages/TransactionPage'
import NotFoundPage from './pages/NotFoundPage'
import SignUpPage  from './pages/SignUp'
import Header from './components/ui/Header'
import { useQuery } from '@apollo/client'
import { GET_AUTHENTICATED_USERS } from './graphql/queries/userquery'
import { Toaster } from 'react-hot-toast'
import { Navigate } from 'react-router-dom'


function App() {
	const { loading, data } = useQuery(GET_AUTHENTICATED_USERS);

	if (loading) return null;

	return (
		<>
			{data?.authUser && <Header />}
			<Routes>
				<Route path='/' element={data?.authUser ? <HomePage /> : <Navigate to='/login' />} />
				<Route path='/login' element={!data?.authUser ? <LoginPage /> : <Navigate to='/' />} />
				<Route path='/signup' element={!data?.authUser ? <SignUpPage /> : <Navigate to='/' />} />
				<Route
					path='/transaction/:id'
					element={data?.authUser ? <TransactionPage /> : <Navigate to='/login' />}
				/>
				<Route path='*' element={<NotFoundPage />} />
			</Routes>
			<Toaster />
		</>
	);
}
  
export default App
