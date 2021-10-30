import React, { Component } from 'react';
import { usePromiseTracker } from "react-promise-tracker";
import Spinner  from "react-spinners/ScaleLoader";
import Clip  from "react-spinners/MoonLoader";
import { css } from "@emotion/core";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;



export const loadingComponent = (value1,value2) => {
  return (
    value1==value2 &&<span>
      <Clip 
      size={15}
      color={"#fff"}/>
    </span>
  )
};


export const LoadingSpinerComponent = (props) => {
  const { promiseInProgress } = usePromiseTracker({area: props.area, delay: 0});

    return (
      <div style={{display:props.display==null ? 'flex':props.display}}>
      {
        (promiseInProgress === true) &&
        <Spinner  css={override}
        size={150}
        color={"#00338D"}/>
      }
    </div>
    )
  };

  export const stripText = (text, length) =>{
    if(text==null) return ""
    return text.length>length ? text.substr(0,length-3)+'...' : text
  }

  
  