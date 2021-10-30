import React , {useState,useReducer, useEffect,useCallback} from 'react';
import {Context} from './Util/Context'
import {CONSTANT} from './Util/Constant';
import axios from 'axios';
import PageRoutes from './Routes'
import { LoadingSpinerComponent} from './Util/Helpers';
import toastr from "toastr"
import {
  Route,
  useHistory,
} from "react-router-dom";
import { trackPromise} from 'react-promise-tracker';
import Sidebar from "react-sidebar";
import qs from 'qs'
import './App.css'
import './Util/bootstrap/bootstrap.min.css'

function App() {
  let history = useHistory();

  useEffect(() => {

  }, []);

  function reducer(state, action){
    switch (action.type){
      case CONSTANT.getCompetitions:
      case CONSTANT.getMatches:
      case CONSTANT.getStandings:
        const payload=(action.payload==null) ? "": action.payload;
        const id=(action.id==null) ? "":"competitions/" +action.id+"/";
        return simpleGetRequest(action.type,payload,id);
      default:
        return state;
    }
  }

  
  const memoizedReducer = useCallback(reducer, [])
  const [initial,dispatch]=useReducer(memoizedReducer,[])

  const [competitions, setCompetitions] = useState({})
  const [matches, setMatches] = useState({})
  const [standings, setStandings] = useState({})
  
  const[base_url, setbase_url]=useState(CONSTANT.domainApi)
 

  function simpleGetRequest(url,query_string,id){
    initialMessage(url)
    trackPromise(
    axios({url:base_url +id+ url + query_string,method:'GET', headers: 
    {  'X-Auth-Token': "5ee8579e468f4e5aab44735013fc020e"}
       }).then(result =>{
      switch (url){ 
        case CONSTANT.getCompetitions:
          setCompetitions(result.data)
          break;
        case CONSTANT.getMatches:
          setMatches(result.data)
          break;
        case CONSTANT.getStandings:
          console.log("DSS",result.data)
          setStandings(result.data)
          break;
        default:
            break;
      }
        return result.data;
    }).catch((e)=>(
      <div>
        {toastr.clear()}
        {toastr.error((e.response!=null) ? (e.response.data.constructor === String ? e.response.data :e.response.data?.Message ): e.message)}
      </div>
      )
    ), CONSTANT.loading)
  }

  function initialMessage(url){
    switch (url){ 
      case CONSTANT.login:
        toastr.info("Please wait",null,{showMethod :'slideDown',
                                        progressBar:true,
                                        positionClass:'toast-top-center',
                                        preventDuplicates:true,
                                        timeOut:'10000'
                                    })
        break;
    }
  }

  return (
    
    <div>
        <Context.Provider value={{dispatch,competitions,matches,standings}}>
            {PageRoutes.map(({ path, Component }) => (
              <Route key={path}  exact path={path}>
                  <Component />
              </Route>
            ))}
        </Context.Provider>
        <LoadingSpinerComponent/>
    </div>
  );
}

export default App;
