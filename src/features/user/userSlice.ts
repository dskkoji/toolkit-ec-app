import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { db } from '../../firebase'
import { doc, setDoc, query, collection, getDocs, orderBy } from 'firebase/firestore'
import {Timestamp} from 'firebase/firestore'


// export interface UserState {
//   idCount: number
//   users: { uid: string; username: string; email: string; isSignedIn: boolean; created_at: Date | null}[]
//   selectedUser: { uid: string; username: string; email: string; isSignedIn: boolean; created_at: Date | null}
// }
export interface UserState {
  idCount: number
  users: { uid: string; username: string; email: string; isSignedIn: boolean; created_at: Timestamp | null}[]
  selectedUser: { uid: string; username: string; email: string; isSignedIn: boolean; created_at: Timestamp | null}
}

const initialState: UserState = {
  idCount: 1,
  users: [],
  selectedUser: {uid: '', username: '', email: '', isSignedIn: false, created_at: null}
}

export const fetchUsers = createAsyncThunk('user/getAllUsers', async () => {
  const q = query(collection(db, 'users'), orderBy('created_at', 'desc'))
  const querySnapshot = await getDocs(q)
  
  const allUsers = querySnapshot.docs.map((doc) => ({
      uid: doc.id,
      username: doc.data().username,
      email: doc.data().email,
      isSignedIn: doc.data().isSignedIn,
      created_at: doc.data().created_at
    })
  )

  const userNumber = allUsers.length
  const passData = { allUsers, userNumber }

  return passData
})



export const createUser = async (name: string, email: string): Promise<void> => {
  try {
    const dateTime = Timestamp.fromDate(new Date())
    const newUserRef = doc(collection(db, 'users'))
    await setDoc(newUserRef, {
      uid: newUserRef.id,
      username: name,
      email: email,
      isSignedIn: true,
      created_at: dateTime,
    })
  } catch (err) {
    console.log('Error writing document: ', err)
  }
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.users = action.payload.allUsers
      state.idCount = action.payload.userNumber
    })
  } 
})



export const selectUsers = (state: RootState): UserState['users'] => state.user.users

export default userSlice.reducer

