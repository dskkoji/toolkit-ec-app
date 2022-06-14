import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { updateDoc, doc } from 'firebase/firestore'
import { db, auth } from '../../firebase'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { ErrorMessage } from '@hookform/error-message'
import { createUser } from '../../features/user/userSlice'
import { RootState } from '../../app/store'
import { useAppSelector } from '../../app/hooks'


interface AuthDataTypes {
  name: string
  email: string
  password: string
  confirmPassword?: string
  isSignedIn?: boolean
}

const initialState: AuthDataTypes = {
  name: '',
  email: '',
  password: '',
  isSignedIn: false
}

const Copyright = (props: any) => {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props} >
      {'Copyright ©️'}
      <Link color="inherit" href="https://mui.com/">
        your website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const theme = createTheme()

const UserAuth: React.FC = () => {
  const navigate = useNavigate()
  const { register, handleSubmit, getValues, formState: {errors} } = useForm<AuthDataTypes>()
  const [isSignedIn, setIsSignedIn] = useState(initialState.isSignedIn)
  const { users }  = useAppSelector((state: RootState) => state.user)


  const handleSignIn = async (data: AuthDataTypes) => {
    const { email, password } = data
    await signInWithEmailAndPassword(auth, email, password) 
        .then(() => {
          const currentUser: any= auth.currentUser
          const signInUser = users.filter((user) => user.email === currentUser.email)[0]
          updateDoc(doc(db, 'users', signInUser.uid), {
            isSignedIn: true
          })
          navigate('/')
        })
        .catch((error) => {
          const errorMessage = error.message
          alert(errorMessage)
        })
  }

  const handleSignUp = async (data: AuthDataTypes) => {
    const { name, email, password } = data
    await createUserWithEmailAndPassword(auth, email, password)
          .then(() => {
            createUser(name, email)

            navigate('/')
          })
          .catch((error) => {
            const errorMessage = error.message
            alert(errorMessage)
          })
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      user && navigate('/')
    })
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{ 
                marginTop: 8,
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center' 
                }} 
          >
          <Avatar sx={{ m: 1, bgColor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {isSignedIn ? 'ログイン' : '新規登録'}
          </Typography>
          <Box 
            component="form" 
            noValidate 
            onSubmit={
              isSignedIn ? handleSubmit(handleSignIn) : handleSubmit(handleSignUp)
            } 
            sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                {!isSignedIn && (
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      required
                      fullWidth
                      id="name"
                      label="Name"
                      autoFocus
                      autoComplete="name"
                      {...register('name', {
                        required: {
                          value: true,
                          message: '名前を入力してください'
                        },
                      })}
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <TextField 
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    autoFocus
                    autoComplete="email"
                    {...register('email', {
                      required: {
                        value: true,
                        message: 'メールアドレスを入力してください'
                      },
                      pattern: {
                        value: /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/,
                        message: 'メールアドレスを正しい形式で入力してください'
                      }
                    })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                     variant="outlined"
                     required
                     fullWidth
                     id="password"
                     label="Password"
                     autoComplete="current-password"
                     {...register('password', {
                       required: {
                         value: true,
                         message: 'パスワードを入力してください'
                       },
                       minLength: {
                         value: 6,
                         message: "パスワードを6文字以上で入力してください"
                       },
                     })}
                  /> 
                </Grid>
                {!isSignedIn && (

                  <Grid item xs={12} sm={6}>
                    <TextField 
                      variant="outlined"
                      required
                      fullWidth
                      id="confirmPassword"
                      label="Password(comfirm)"
                      autoComplete="current-password"
                      {...register('confirmPassword', {
                        required: {
                          value: true,
                          message: '確認のためパスワードを再入力してください'
                        },
                        minLength: {
                          value: 6,
                          message: "パスワードを6文字以上で入力してください"
                        },
                        validate: (value) => {
                          return (
                            value === getValues('password') || 'パスワードが一致しません'
                          )
                        }
                      })}
                    /> 
                  </Grid>
                )}
              </Grid>
              <ErrorMessage 
                errors={errors}
                name="muilipleErrorInput"
                render={({ messages }) => 
                  messages && 
                  Object.entries(messages).map(([type, message]) => (
                    <p key={type}>{message}</p>
                  ))
                } 
              /> 
              <Button 
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
              >
                {isSignedIn ?  'ログイン' : '新規登録'}
              </Button>
              <Grid container sx={{ justifyContent: "flex-end"}}>
                <Grid item>
                  <Link
                    href="#"
                    variant="body2"
                    onClick={() => setIsSignedIn(!isSignedIn)}
                  >
                     {isSignedIn 
                      ? 'アカウントをお持ちでない方はこちら' 
                      : 'アカウントをお持ちの方はこちら'
                      }
                  </Link>
                </Grid>
              </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }}  />
      </Container>
    </ThemeProvider>
  )
}

export default UserAuth