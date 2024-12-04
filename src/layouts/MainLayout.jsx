import React from 'react'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from '../components/NavBar'

const MainLayout = ({searchText, handleSearchText}) => {
  return (
    <>
    <NavBar searchText={searchText} handleSearchText={handleSearchText} />
    <ToastContainer />
    <Outlet />
    </>
  )
}

export default MainLayout