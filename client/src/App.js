
import ListHeader from './components/ListHeader'
import { useEffect,useState } from 'react'
import ListItem from './components/ListItem'
import Auth from './components/Auth'
import {useCookies} from 'react-cookie'
function App() {
  const [cookies,setCookie,removeCookie]=useCookies(null)
  const [tasks,setTasks]=useState(null)
  const userEmail=cookies.Email
  const authToken=cookies.AuthToken

  
  const getData=async ()=>{
       try {      
      const response=await fetch(`http://localhost:8000/todos/${userEmail}`)
      const json=await response.json()
      setTasks(json)
    } catch (error) {
      console.error(error)
    }
  }
  
  useEffect(()=>{
    if(authToken){
      getData()
    }
  },[])
  console.log(tasks)

  //sort by date
  const sortedTasks=tasks?.sort((a,b)=>new Date(a.date) - new Date(b.date))
  return (
    <div className='app'>
      {!authToken && <Auth/>}
      {authToken&&
      <>
      <ListHeader listName={'🌴 Holiday tick list'} getData={getData} />
      <p className='user-email'>Welcome Back {userEmail}</p>
      {sortedTasks?.map((task,index)=>
         <ListItem key={index} task={task} getData={getData}/>
      )}
      </>
      }
    </div>
  );
}

export default App;
