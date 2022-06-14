import React from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import Modal from '@mui/material/Modal'
import Checkbox from '@mui/material/Checkbox'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import EventNoteIcon from '@mui/icons-material/EventNote'
import styles from './TaskItem.module.scss'
import TaskForm from '../taskForm/TaskForm'

import { 
    fetchTasks, 
    editTask, 
    selectIsModalOpen, 
    deleteTask, 
    selectTask, 
    handleModalOpen 
  } from '../taskSlice'

interface PropsTypes {
  task: { id: string; title: string; completed: boolean }
}

const TaskItem: React.FC<PropsTypes> = ({ task }) => {
  const isModalOpen = useAppSelector((selectIsModalOpen))
  const dispatch = useAppDispatch()

  const handleOpen = () => {
    dispatch(selectTask(task))
    dispatch(handleModalOpen(true))
  }

  const handleClose = () => {
    dispatch(handleModalOpen(false))
  }

  const handleEdit = async (id: string, title: string, completed: boolean) => {
    const sendData = { id, title, completed: !completed }
    await editTask(sendData)
    dispatch(fetchTasks())
  }

  const handleDelete = async (id: string) => {
    await deleteTask(id)
    dispatch(fetchTasks())
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <EventNoteIcon className={styles.icon} />
        <div className={styles.title_text}>{task.title}</div>
      </div>
      <div className={styles.right_item}>
        <Checkbox 
          checked={task.completed}
          onClick={() => handleEdit(task.id, task.title, task.completed)}
          className={styles.checkbox}
        />
        <button 
          onClick={handleOpen} 
          className={styles.edit_button} 
          >
          <EditIcon className={styles.icon} />
        </button>
        <button 
          onClick={() => handleDelete(task.id)} 
          className={styles.delete_button}
        >
          <DeleteIcon className={styles.icon}  />
        </button>
      </div>
      <Modal open={isModalOpen}  onClose={handleClose} className={styles.modal}>
        <div className={styles.modal_content}>
          <div className={styles.modal_title}>Edit Task Title</div>
          <TaskForm edit />
        </div>
      </Modal>
    </div>
  )
}

export default TaskItem