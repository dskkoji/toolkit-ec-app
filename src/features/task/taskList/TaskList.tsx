import React from 'react'
import styles from './TaskList.module.scss'
import { RootState } from '../../../app/store'
import { useAppSelector } from '../../../app/hooks'
import TaskItem from '../taskItem/TaskItem'

const TaskList: React.FC = () => {
  const { tasks } = useAppSelector((state: RootState) => state.task)

  return (
    <div className={styles.wrapper}>
      {tasks.map((task) => (
        <TaskItem 
          key={task.id}
          task={task}
        />
      ))}
    </div>
  )
}

export default TaskList