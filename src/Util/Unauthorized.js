import React , {useContext, useEffect,useState} from 'react';
import '../App.css'

export default function Unauthorized() {
  return (
    <div>
            <div className="space-bottom">
                <div style={{position:'relative'}}>
                    <span className="text-lg">You are not authorized to access this platform</span>
                    
                    <span className="text-sm space-top">Contact IT support if you think there is an error with your access right</span>
                </div>
                </div>
        </div>
  )
 
}
