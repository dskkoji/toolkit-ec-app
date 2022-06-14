import React from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { useForm } from 'react-hook-form'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import styles from './TaskForm.module.scss'

import { createTask, editTask, handleModalOpen, fetchTasks, selectSelectedTask } from '../taskSlice'


type Inputs = {
  taskTitle: string
}

type PropsTypes = {
  edit?: boolean
}

const TaskForm: React.FC<PropsTypes> = ({ edit }) => {
  const dispatch = useAppDispatch()
  const selectedTask = useAppSelector(selectSelectedTask)
  const { register, handleSubmit, reset } = useForm<Inputs>()

  const handleCreate = async (data: Inputs) => {
    await createTask(data.taskTitle)
    reset()
    dispatch(fetchTasks())
  }

  const handleEdit = async (data: Inputs) => {
    const sendData = { ...selectedTask, title: data.taskTitle }
    await editTask(sendData)
    dispatch(handleModalOpen(false))
    dispatch(fetchTasks())
  }

  return (
    <div className={styles.wrapper}>
      <form
        onSubmit={!edit ?  handleSubmit(handleCreate) : handleSubmit(handleEdit)}
        className={styles.form}
      >
        <TextField 
          label={!edit ? 'New Task' : 'Edit Task'}
          variant='outlined'
          {...register('taskTitle', {
            required: true
          })}
          className={styles.text_field}
          defaultValue={selectedTask.title}
        />
        {edit ? (
          <Box className={styles.button_wrapper}>
            <button 
              type="submit"
              onClick={handleSubmit(handleEdit)}
              className={styles.submit_button}
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => dispatch(handleModalOpen(false))}
              className={styles.cancel_button}
            >
              Cancel
            </button>
          </Box>
        ) : null}
      </form>
    </div>
  )  
}

export default TaskForm