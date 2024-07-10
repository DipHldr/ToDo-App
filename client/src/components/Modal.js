import React,{useState} from 'react'
import {useCookies} from 'react-cookie'
const Modal = ({task,mode,setShowModal,getData}) => {
  const [cookies,setCookie,removeCookie]=useCookies(null)
  const editMode=mode==='edit'?true:false
  const [data,setData]=useState({
    user_email:editMode?task.user_email:cookies.Email,
    title:editMode?task.title:"",
    progress:editMode?task.progress:50,
    date:editMode?task.date:new Date()
  })
  const postData=async (e)=>{
    e.preventDefault()
    console.log(JSON.stringify(data))
    try {
      const response=await fetch('http://localhost:8000/todos',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
      })
      if(response.status===200){
        console.log('WORKED!!')
        setShowModal(false)
        getData()
      }
    } catch (error) {
      console.error(error)
      
    }
  }

  const editData=async(e)=>{
    e.preventDefault()
    try {
      const response=await fetch(`http://localhost:8000/todos/${task.id}`,{
        method:'PUT',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
      })
      if(response.status===200){
        setShowModal(false)
        getData()
      }
      
    } catch (error) {
      console.error(error)
      
    }
  }
  const handleChange=(e)=>{
    console.log('changing')
    const {name,value}=e.target
    setData(data=>({
      ...data,[name]:value
     }))

  }
  return (
    <div className="overlay">
      <div className="modal">
        <div className="form-title-container">
        <h2>Lets {mode} your task</h2>
        <button onClick={()=>setShowModal(false)}>X</button>
        </div>
          <form>
            <input
            required
            maxLength={50}
            name="title"
            value={data.title}
            onChange={handleChange}/>
            <br />
            <label htmlFor="range">Drag to track your current progress</label>
            <input
            required
            type="range"
            id="range"
            min="0"
            max="100"
            name="progress"
            value={data.progress}
            onChange={handleChange}/>
            <input className={mode} type="submit" onClick={editMode?editData:postData}/>
          </form>
      </div>
      
    </div>
  )
}

export default Modal
