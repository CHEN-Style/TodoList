import { useState, useEffect } from 'react'
import './App.css'

function App() {

  const [todoList, setTodoList] = useState([])
  const [taskTitle, setTaskTitle]= useState('')
  const [tempDelTodos, setTempDelTodos] = useState([])

  // 控制弹窗
  const [showModal, setShowModal] = useState(false)
  // 存储临时的todo给组件使用
  const [tempTodo, setTempTodo] = useState([])
  // 存储临时的优先级
  const [tempPriority, setTempPriority] = useState(0)

  // -------------------------------------------------------------------------------------------------------- useEffect
  // 渲染页面时获取localStorage
  useEffect(() => {
    const storedTodos = localStorage.getItem('TODOS')
    setTodoList(JSON.parse(storedTodos) || [])
  }, [])

  // todoList变化就更新localStorage
  useEffect(()=>{
    if (todoList.length > 0) {
      localStorage.setItem('TODOS', JSON.stringify(todoList))
    } 
  }, [todoList])

  // 渲染页面时获取 回收站
  useEffect(() => {
    const storedTempDel = localStorage.getItem('TempDel')
    setTempDelTodos(JSON.parse(storedTempDel) || [])
  }, [])

  // tempDelTodos变化就更新 回收站
  useEffect(()=>{
    if (tempDelTodos.length > 0) {
      localStorage.setItem('TempDel', JSON.stringify(tempDelTodos))
    }
  }, [tempDelTodos])
  // -------------------------------------------------------------------------------------------------------- useEffect

  function handleTitleInput(e) {
    setTaskTitle(e.target.value)
  }

  function newTask() {
    const timestamp = Date.now()
    const date = new Date(timestamp)
    const formateDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`

    const newTodo = {
      id: timestamp,                                      // 根据时间生成id
      name: taskTitle,                                     // 用户输入的任务名称
      content: ["", "", "", "", ""],                       // 内容初始化为空字符串，最多五条
      priority: 3,                                         // 默认优先级为3
      isCompleted: false,                                  // 初始为未完成
      isDeleted: false,                                    // 初始为未删除
      date: formateDate
    }
    setTodoList([...todoList, newTodo])
    setTaskTitle('')
  }

  function testFunc() {
    console.log(todoList)
  }

  // --------------------------------------------------------------- 需要学习
  function handleTodoIsCompleted(todo) {
    const newTodoList = todoList.map(item => {
      if (todo.id === item.id) {
        return {...item, isCompleted: !todo.isCompleted}
      } else {
        return item
      }
    })

    setTodoList(newTodoList)
  }
  // ------------------------------------------------------------------------

  function handleTempDelete(todo) {
    // 加入回收站
    setTempDelTodos([...tempDelTodos, todo])

    const newTodos = todoList.filter(item => item.id !== todo.id)

    // 这里是为了处理StrictMode下，useEffect在加入了todoList.length > 0的判断，导致了最后一个项目无法正常删除的问题，删除main.jsx中的StrictMode后也就不需要这行代码
    // 因为删除了唯一一个项目后，todoList.length = 0 也就无法触发useEffect了
    if (newTodos.length === 0) {
      setTodoList(newTodos)
      localStorage.setItem('TODOS', JSON.stringify(newTodos))
    }
    // ------------------------------------------------------

    setTodoList(newTodos)
  }

  function handleModalCancel() {
    setShowModal(false)
  }

  function handleTodoInfo(todo) {
    setShowModal(true)
    setTempTodo(todo)
  }

  function handlePriorityInput(e) {
    setTempPriority(e.target.value)
  }

  function hanlePriorityChange() {
    const newTodoList = todoList.map(item => {
      if (tempTodo.id === item.id) {
        return {...item, priority: tempPriority}
      } else {
        return item
      }
    })

    setTodoList(newTodoList)
    setShowModal(false)
  }

  // ------------------------------------------------------------------------------------------------------------------------ 组件部分
  const [selectedButton, setSelectedButton] = useState(1)
  // 控制侧边栏按钮
  const handleClick = (buttonId) => {
    setSelectedButton(buttonId);
  };

  // 默认排序组件
  const SortDefult = () => {
    return (
      todoList.length > 0 ? todoList.map(todo => (
        <div className='todoBox' key={todo.id}>
          <input type="checkbox" className='checkbox' checked={todo.isCompleted} onChange={()=>{handleTodoIsCompleted(todo)}}/>
          <div className={todo.isCompleted ? 'todoTitle-comp' : 'todoTitle-incomp'} onClick={()=>handleTodoInfo(todo)}>{todo.name}</div>
          <button className='deletTodoBtn' onClick={()=>{handleTempDelete(todo)}}>删除</button>
        </div>
      )) : (
        <div>No task</div>
      )
    )
  }

  // 按时间排序
  const SortByDate = () => {
    const [dateList, setDateList] = useState([])

    function createDateList() {
      const tempDate = []
      const tempList = []
  
      for (const item of todoList) {
        if (!tempDate.includes(item.date)) {
          tempDate.push(item.date)
          tempList.push([item])
        } else {
          const index = tempDate.indexOf(item.date)
          tempList[index].push(item)
        }
      }
      console.log(tempList)
      setDateList(tempList)
    }

    useEffect(() => {
      createDateList()
    }, [todoList])
     
    return (
      dateList.length > 0 ? dateList.map(todos => (
        <div key={todos[0].date} className='showTodoBox'>
          <h3>{todos[0].date}</h3>
          {todos.map(todo => (
            <div className='todoBox' key={todo.id}>
              <input type="checkbox" className='checkbox' checked={todo.isCompleted} onChange={()=>{handleTodoIsCompleted(todo)}}/>
              <div className={todo.isCompleted ? 'todoTitle-comp' : 'todoTitle-incomp'}>{todo.name}</div>
              <button className='deletTodoBtn' onClick={()=>{handleTempDelete(todo)}}>删除</button>
            </div>
          ))}
        </div>
      )) : (
        <div>No task</div>
      )

    )
  }

  // 按优先级排序
  const SortByPriority = () => {
    const [priorityList, setPriorityList] = useState([])
    
    function createPriorityList() {
      const tempList = [...todoList]
      // const tempList = todoList
      const sortTempList = tempList.sort((a, b) => b.priority - a.priority)
      setPriorityList(sortTempList)
    }

    useEffect(() => {
      createPriorityList()
    }, [todoList])

    return (
      priorityList.length > 0 ? priorityList.map(todo => (
        <div className='todoBox' key={todo.id}>
          <input type="checkbox" className='checkbox' checked={todo.isCompleted} onChange={()=>{handleTodoIsCompleted(todo)}}/>
          <div className='todoTitle-incomp'>priority: {todo.priority}</div>
          <div className={todo.isCompleted ? 'todoTitle-comp' : 'todoTitle-incomp'} onClick={()=>handleTodoInfo(todo)}>{todo.name}</div>
          <button className='deletTodoBtn' onClick={()=>{handleTempDelete(todo)}}>删除</button>
        </div>
      )) : (
        <div>No task</div>
      )
    )
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
        {selectedButton === 1 && <SortDefult/>}
        {selectedButton === 2 && <SortByDate/>}
        {selectedButton === 3 && <SortByPriority/>}
        {/* {
          todoList.length > 0 ? todoList.map(todo => (
            <div className='todoBox' key={todo.id}>
              <input type="checkbox" className='checkbox' checked={todo.isCompleted} onChange={()=>{handleTodoIsCompleted(todo)}}/>
              <div className={todo.isCompleted ? 'todoTitle-comp' : 'todoTitle-incomp'}>{todo.name}</div>
              <button className='deletTodoBtn' onClick={()=>{handleTempDelete(todo)}}>删除</button>
            </div>
          )) : (
            <div>No task</div>
          )
        } */}
      </div>
      <div className='btnContainer'>
        <button className='sortDefult' onClick={()=>handleClick(1)}>默认排序</button>
        <button className='sortByDate' onClick={()=>handleClick(2)}>按时间排序</button>
        <button className='sortByDate' onClick={()=>handleClick(3)}>按优先级排序</button>
      </div>

      {showModal && (
        <div className='modal'>
          <div>{tempTodo.name}</div>
          <p>修改优先级 输入数字0-9</p>
          <input type="text" className='priorityInput' value={tempPriority} onChange={handlePriorityInput}/>
          <button className='button' onClick={hanlePriorityChange}>确认修改</button>
          <button className='button' onClick={handleModalCancel}>取消</button>
        </div>
      )}

    </>
  )
}

export default App
