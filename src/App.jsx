import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
// import { TbError404Off } from "react-icons/tb"
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { toast } from 'react-toastify'
import Filter from './components/Filter'
import NavBar from './components/NavBar'
import NoteCardContainer from './components/NoteCardContainer'
import MainLayout from './layouts/MainLayout'
import AddNotePage from './pages/AddNotePage'
import EditNotePage from './pages/EditNotePage'
import HomePage from './pages/HomePage'
import NoteDetailPage from './pages/NoteDetailPage'

const App = () => {

  const [ notes, setNotes ] = useState([])
  const [ isLoading, setIsLoading ] = useState(false)
  const [ filterText, setFilterText ] = useState("")
  const [ searchText, setSearchText ] = useState("")

  const handleFilterText = (val) => {
    setFilterText(val)
  }

  const handleSearchText = (val) => {
    setSearchText(val)
  }

  const filteredNotes =
  filterText === "BUSINESS" ? notes.filter(note => note.category == "BUSINESS")
  : filterText === "PERSONAL" ? notes.filter(note => note.category == "PERSONAL")
  : filterText === "IMPORTANT" ? notes.filter(note => note.category == "IMPORTANT")
  : notes

  useEffect(() => {
    if(searchText.length < 3) return;
    axios.get(`https://notes-app-backend-qumy.onrender.com/notes-search?search=${searchText}`)
    .then(res => {
      console.log(res.data)
      setNotes(res.data)
    })
    .catch(err => {
      console.log(err.message)
    })
  }, [searchText])


  useEffect(() => {
    setIsLoading(true)
    axios.get("https://notes-app-backend-qumy.onrender.com/notes")
    .then(res => {
      // console.log(res.data)
      setNotes(res.data)
      setIsLoading(false)
    })
    .catch(err => {
      console.log(err.message)
    })
  }, [])

  const addNote = (data) => {
    axios.post("https://notes-app-backend-qumy.onrender.com/notes", data)
    .then(res => {
      setNotes([...notes, data])
      toast.success("A new note has been added")
      // console.log(res.data)
    })
    .catch(err => {
      console.log(err.message)
    })
  }

  const updateNote = (data, slug) => {
    axios.put(`https://notes-app-backend-qumy.onrender.com/notes/${slug}`, data)
    .then(res => {
      // console.log(res.data)
      toast.success("Note updated successfully")
    })
    .catch(err => console.log(err.message))
  }

  const deleteNote = (slug) => {
    axios.delete(`https://notes-app-backend-qumy.onrender.com/notes/${slug}`)
    .catch(err => console.log(err.message))
  }


  const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<MainLayout searchText={searchText} handleSearchText={handleSearchText} />}>
      <Route index element={<HomePage notes={filteredNotes} loading={isLoading} handleFilterText={handleFilterText} />} />
      <Route path='/add-note' element={<AddNotePage addNote={addNote} />} />
      <Route path='/notes/:slug' element={<NoteDetailPage deleteNote={deleteNote} />} />
      <Route path='/edit-note/:slug' element={<EditNotePage updateNote={updateNote} />} />
    </Route>

  ))

  return <RouterProvider router={router}/>
}

export default App