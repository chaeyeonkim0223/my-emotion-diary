import React, { useRef, useReducer, useEffect } from 'react';
import { BrowserRouter , Routes, Route} from 'react-router-dom';
import './App.css';
import Home from "./pages/Home"
import New from "./pages/New";
import Edit from "./pages/Edit"
import Diary from "./pages/Diary"

const reducer = (state, action)=>{
  let newState =[];
  switch(action.type){
    case "INIT":{
      return action.data;
    }
    case "CREATE":{
      const newItem ={
        ...action.data
      };
      newState = [...state, newItem];
      break;
    }
    case "REMOVE": {
      newState = state.filter((it)=> it.id !== action.targetId);
      break;
    }
    case "EDIT":{
      newState = state.map((it)=>it.id === action.data.id ? {...action.data} : it);
      break;
    }
    default: 
      return state;
  }

  localStorage.setItem("diary", JSON.stringify(newState))
  return newState;
}

export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

function App() {

  const [data, dispatch] = useReducer(reducer, []);
  const dataId = useRef(0);

  useEffect(()=>{
    const titleElement = document.getElementsByTagName('title')[0]
    titleElement.innerHTML =`감정 일기장`;
  },[])

  useEffect(()=>{
    const localData = localStorage.getItem('diary')
    if(localData){
      const diaryList= JSON.parse(localData).sort((a,b)=> parseInt(b.id) - parseInt(a.id));
      
      if(diaryList.length>=1){
        data.current = parseInt(diaryList[0].id) +1;
        dispatch({type:"INIT", data: diaryList});
      }
    }
  },[])

  //CREATE
  const onCreate = (date, content, emotion)=>{
    dispatch({type: "CREATE", data : {
      id : dataId.current++,
      date : new Date(date).getTime(),
      content,
      emotion
    }})
  }

  //REMOVE
  const onRemove = (targetId)=>{
    dispatch({type: "REMOVE", targetId });
  }

  //EDIT
  const onEdit = (targetId, date, content, emotion)=>{

    dispatch({type: "EDIT", data :{
      id: targetId, 
      date : new Date(date).getTime(),
      content,
      emotion
    }})
  }
  
  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={{onCreate, onEdit, onRemove}}>
        <BrowserRouter>
          <div className="App">
            <Routes>
              <Route path="/" element ={<Home/>}/>
              <Route path="/new" element ={<New/>}/>
              <Route path="/edit/:id" element ={<Edit/>}/>
              <Route path="/diary/:id" element ={<Diary/>}/>
            </Routes>
          </div>
        </BrowserRouter>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;
