import { lazy } from 'react'
import './App.css'
import { BrowserRouter , Routes ,Route } from 'react-router-dom';
import { Suspense } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import SuspenseFallback from './components/SuspenseFallback.jsx'

const Home = lazy(() => import('./pages/Home.jsx'));

const Chats = lazy(() =>import('./pages/Chats.jsx'));
function App() {
  
  return (
    <>
    
        <BrowserRouter >
       
        <Suspense fallback ={<SuspenseFallback />}>
          <Routes>
       
            <Route path='/' element={<Home />} />
            <Route  path='/Chats' element ={<Chats/>} />
           
          </Routes>
          </Suspense> 
         
        </BrowserRouter>
       
        <ToastContainer />
    </>
  )
}

export default App
