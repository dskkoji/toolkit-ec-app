import React from 'react'
import styles from './Header.module.scss'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { db } from '../../firebase'
import {  updateDoc, doc } from 'firebase/firestore'
import { auth } from '../../firebase' 
import { useAppSelector } from '../../app/hooks'
import { RootState } from '../../app/store'
 
// interface User {
//   user: { uid: string; username: string; email: string; isSignedIn: boolean; created_at: Date | null }
// }

const Header: React.FC = () => {

  const navigate = useNavigate()
  const { users } = useAppSelector((state: RootState) => state.user)

  const currentUser: any = auth.currentUser

  const signInUser = users.filter((user) => user.email === currentUser.email)[0]

  console.log(signInUser)

  
  const handleSignOut = async () => {
    await signOut(auth)
          .then(() => {
            updateDoc(doc(db, 'users', signInUser.uid), {
              isSignedIn: false
            })
            navigate('user-auth')
            
          }).catch((error) => {
            const errorMessage = error.message
            alert(errorMessage)
          })
  }

  return (
    <div className={styles.root}>
      <AppBar position="static" className={styles.app_bar}>
        <Toolbar className={styles.tool_bar}>
          <Typography variant="h6">
             {signInUser?.username}さん こんにちは
          </Typography>
          <Button onClick={handleSignOut}>ログアウト</Button>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Header