import { useState } from 'react'
import Header from './components/Header/Header'
import Delivery from './components/Delivery/Delivery'
import Main from './components/Main/Main'
import Footer from './components/Footer/Footer'
import Authorization from './components/Authorization/Authorization'

function App() {

  return (
    <>
      <Header/>
      <Delivery/>
      <Main/>
      <Footer/>
    </>
  )
}

export default App
