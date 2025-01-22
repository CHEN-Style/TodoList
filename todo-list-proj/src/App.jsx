import { useState, useEffect } from 'react'
import './App.css'

function App() {

  const [todoList, setTodoList] = useState([])
  const [taskTitle, setTaskTitle]= useState('')

  useEffect(() => {
    const storedTodos = localStorage.getItem('TODOS')
    setTodoList(JSON.parse(storedTodos))
  }, [])

  // todoList变化就更新localStorage
  useEffect(()=>{
    localStorage.setItem('TODOS', JSON.stringify(todoList))
  }, [todoList])

  function handleTitleInput(e) {
    setTaskTitle(e.target.value)
  }

  function newTask() {
    const newTodo = {
      id: Date.now(),                                      // 根据已有任务生成ID
      name: taskTitle,                                     // 用户输入的任务名称
      content: ["", "", "", "", ""],                       // 内容初始化为空字符串，最多五条
      priority: 3,                                         // 默认优先级为3
      isCompleted: false,                                  // 初始为未完成
      isDeleted: false,                                    // 初始为未删除
    }
    setTodoList([...todoList, newTodo])
    setTaskTitle('')
  }

  function testFunc() {
    console.log(todoList)
  }

  return (
    <>
      <div className='title'>TODO LIST</div>
      <div className='newTodoBox'>
        <input type="text" className='userInputTitle' value={taskTitle} onChange={handleTitleInput}/>
        <button className='newTodoBtn' onClick={newTask}>新增事项</button>
        <button className='newTodoBtn' onClick={testFunc}>Test btn</button>
      </div>
      <div className='showTodoBox'>
        {
          todoList.length > 0 ? todoList.map(todo => (
            <div className='todoBox' key={todo.id}>
              <div className='todoTitle'>{todo.name}</div>
            </div>
          )) : (
            <div>No task</div>
          )
        }
      </div>

    </>
  )
}

export default App
