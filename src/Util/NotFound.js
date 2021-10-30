import React, {useEffect,useContext} from 'react'
import {CONSTANT} from '../Util/Constant';
import { Context } from '../Util/Context';

export default function NotFound(){
    const {ruleBook,dispatch,_state}=useContext(Context)
    useEffect(() => {
        dispatch({type:CONSTANT.set_State,payload:{data:'Users',type:'page'}})
       }, []);
    return (
            <div>
                <div id='error' style={{textAlign:'center', margin:'auto', padding:'auto'}}>
                    <h1 className="notFoundTitle">Oops! That page can’t be found.</h1>
                    <p className="notFoundDesc">
                            It looks like nothing was found at this location.
                            Maybe try one of the links in the menu or press back to go to the previous page.
                    </p>
                </div>
                
             </div>
        );
    
}