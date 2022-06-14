import React, { useEffect } from 'react'
import styles from './App.module.scss'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from './app/hooks'
import { onAuthStateChanged } from 'firebase/auth'
import Header from './components/header/Header'
import TaskForm from './features/task/taskForm/TaskForm'
import TaskList from './features/task/taskList/TaskList'
import { auth } from './firebase'
import { fetchTasks } from './features/task/taskSlice'
import { fetchUsers } from './features/user/userSlice'

 


const App: React.FC = (props) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      !user && navigate('user-auth')
    })
  }, [])

  useEffect(() => {
    const getData = () => {
      dispatch(fetchTasks())
      dispatch(fetchUsers())
    }
    getData()
  }, [])

  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>
        <Header />
        <TaskForm />
        <TaskList />
      </div>
    </div>
  )
}

export default App