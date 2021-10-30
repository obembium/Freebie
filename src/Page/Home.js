import React , {useContext, useEffect,useState} from 'react';
import { Context } from '../Util/Context';
import {CONSTANT} from '../Util/Constant';
import { Row, Col,Container , Dropdown, Button } from "react-bootstrap"
import { useForm } from "react-hook-form";
import {
  useLocation,
} from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import gsap from 'gsap'
import ReactModal from 'react-modal'
import { useMediaQuery } from 'react-responsive'
import moment from 'moment';
import { LoadingSpinerComponent } from '../Util/Helpers';

//The application designed follows a function based approach, 
//i could have as well made use of components instead of functions
//it would produce same result, but just wanted to place it all on a file since the solution is a simple one.
//Three basic endpoints are being called at the App.js file and dispatched here for usage.

//Author: Peter Ihaza
//Start time: 30/10/2021 12:32pm
//Completion time: 30/10/2021 3:15pm




export default function Home() {
  const {dispatch,competitions,standings,matches}=useContext(Context)

  const { register, handleSubmit, errors } = useForm();
  
  const [nav, setNav]= useState(1);
  const passChange = useLocation().passChanged;
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 970px)' })

  useEffect(() => {
    dispatch({type:CONSTANT.getCompetitions,payload:"?plan=TIER_ONE"})
   }, []);

   //OnEnter and OnExit are just for transition animation
   const onEnter = node => {
    gsap.from(
      [ node.children[0].lastElementChild],
      0.6,
      {
        y: 30,
        delay: 0.3,
        ease: "power3.InOut",
        opacity: 0,
        stagger: {
          amount: 0.3
        }
      }
    );
  };

  const onExit = node => {
    gsap.to(
      [node.children[0].firstElementChild, node.children[0].lastElementChild],
      0.6,
      {
        y: -30,
        ease: "power3.InOut",
        stagger: {
          amount: 0.2
        }
      }
    );
  };



  return (
    <div>
      {getHeader()}
      <div className="container">
        {getBody()}
        {getFooter()}
      </div>

    </div>
  )
  
  function getHeader(){
    return(
      <div className="backgroundHeader">
        <img className="logo" src={require('../Asset/images/logo.png')}/>
      </div>
    )
  }

  function getBody(){
    return(
      <div className="body card">
        {/* {nav==1 ? getPage1() : getPage2()} */}
        <CSSTransition
                  in={nav==1}
                  timeout={300}
                  classNames='slideUp'
                  onExit={(node)=>onExit(node,1)}
                  onEntering={(node)=>onEnter(node,1)}
                  unmountOnExit>
                    {getPage1()}
        </CSSTransition>
        <CSSTransition
                  in={nav!=1}
                  timeout={300}
                  onExit={(node)=>onExit(node,1)}
                  onEntering={(node)=>onEnter(node,1)}
                  classNames='slideUp'
                  unmountOnExit>
                    {getPage2()}
        </CSSTransition>
        <LoadingSpinerComponent area={CONSTANT.loading}/>
      </div>
    )
  }

  function getPage1(){
      const open =(id)=>{
        dispatch({type:CONSTANT.getStandings,id:id})
        dispatch({type:CONSTANT.getMatches,id:id})
        setNav(2)
      }
      return (
        <div>
        <h4><strong>All Competitions</strong></h4>
        <Row className="space-bottom">
        {competitions.competitions?.map((data,index)=>{
          const id=data.id
          const name=data.name
          const location=data.location
          return(
            <Col md={6} className="click space-top" onClick={()=>open(id)}>
              <div className="competition padding ruby" style={{width:'inherit'}} >

                <img width="80px" height="70px" src={(data.emblemUrl)}/>
                <div style={{paddingLeft:'15px'}}>
                  <h5><strong>{name}</strong></h5>
                  <span>{location}</span>
                </div>
                
              </div>
            </Col>
          )
        })}
        </Row>
      </div>
    )
  }

  function getPage2(){
    const name=standings?.competition?.name
    return (
      <div>
        <div className="ruby space-bottom2">
          <span className="click blue underline bold" onClick={()=>setNav(1)}>All Competitions</span>
          <span className="space-left2 bold">/</span>
          <span className="space-left2 bold">{name}</span>
        </div>
        <div><h4><strong>{name}</strong></h4></div>

        <Row className="tabs ruby p-0" style={{width:'100%',marginLeft:'0px'}}>
          <Col className="center">
            <span className={[nav==2 && "activeheader","click","tab"].join(' ')} onClick={()=>setNav(2)}>STANDINGS</span>
          </Col>
          <Col className="center">
            <span className={[nav==3 && "activeheader","click","tab"].join(' ')} onClick={()=>setNav(3)}>MATCHES</span>
          </Col>
        </Row>
        {standings!=null &&
        <div>
           <CSSTransition
                  in={nav==2}
                  timeout={300}
                  classNames='slideUp'
                  onExit={(node)=>onExit(node,1)}
                  onEntering={(node)=>onEnter(node,1)}
                  unmountOnExit>
                    {getStandings()}
        </CSSTransition>
        <CSSTransition
                  in={nav==3}
                  timeout={300}
                  classNames='slideUp'
                  onExit={(node)=>onExit(node,1)}
                  onEntering={(node)=>onEnter(node,1)}
                  unmountOnExit>
                    {getMatches()}
        </CSSTransition>
     
        </div>}
      </div>
      )
  }

  function getMatches(){
    var matchweek=  matches.matches!=undefined ? matches?.matches[0]?.matchday :"-"
      return (
        <div>
          <div><h4>Matchweek {matchweek}</h4></div>
          
          <Row class="row">
            {matches!=null && matches.matches?.map((data,index)=>{
              const datetime=data.utcDate
              const homeTeamScore=data.score.fullTime.homeTeam
              const homeTeam=data.homeTeam.name
              const awayTeamScore=data.score.fullTime.awayTeam
              const awayTeam=data.awayTeam.name
              return (
                      <div class="col-md-6 px-4 py-4 match">
                        <div class="match-details">
                          <div class="home-row">
                            <div class="emblem">
                              <img src={require('../Asset/images/h.png')} class="img-fluid"/>
                            </div>
                            <h4 class="h6 small mb-0">{homeTeam}</h4>
                            <div class="outcome">
                              <strong class="small text-danger">{homeTeamScore}</strong>
                            </div>
                          </div>
                          <div class="away-row">
                            <div class="emblem">
                              <img src={require('../Asset/images/a.png')} class="img-fluid"/></div>
                            <h4 class="h6 mb-0 small">{awayTeam}</h4>
                            <div class="outcome">
                              <strong class="small text-success">{awayTeamScore}</strong>
                            </div>
                          </div>
                        </div>
                        <div class="status border-left pl-2 text-center">
                          <h6>FT</h6>
                          <p class="small mb-1">{moment(datetime).format("MM/DD")}</p>
                          <p class="small mb-0">{moment(datetime).format("hh:mm")}</p>
                        </div>
                      </div>
                      )
            })}
          </Row>
    </div>
  )

  
  }

  function getStandings(){
    var count=0;
    return (
      <div className="tab-body-holder">
        <div class="standings">
          <div class="standings--group">
            <h5 class="mb-0 group-name">
              <strong></strong>
            </h5>
          <div class="standings-table">
            <div class="standing-row standing-header text-muted">
              <Row>
                <Col className="p-0" md="5" class="team-name">Team</Col>
                <Col className="p-0"md="1">MP</Col>
                <Col className="p-0"md="1">W</Col>
                <Col className="p-0"md="1">D</Col>
                <Col className="p-0"md="1">L</Col>
                <Col className="p-0"md="1">GF</Col>
                <Col className="p-0"md="1">GA</Col>
                <Col className="p-0"md="1">Pts</Col>
              </Row>
            </div>


            <div>
          {standings?.standings!=undefined && standings?.standings.map((d,i)=>{
            return (
              <div>
                {d.table?.map((data,index)=>{
                count++
                const team=data.team.name
                const icon=data.team.crestUrl
                const MP=data.playedGames
                const W=data.won
                const D=data.draw
                const L=data.lost
                const GF=data.goalsFor
                const GA=data.goalsAgainst
                const GD=data.goalDifference
                const Pts=data.points
                return (
                  <div class="standing-row space-top2">
                  <Row className="center2">
                    <Col md="5" class="team-name">
                      <div className="ruby center">
                        <span className="space-right2">{count}</span>
                        <span class="emblem ruby space-right2"><img src={icon} width="30" alt="" /></span>
                        <span style={{textAlign:'left'}}>{team}</span>
                      </div>
                    </Col>
                    <Col className="p-0" md="1" >{MP}</Col>
                    <Col className="p-0" md="1"  >{W}</Col>
                    <Col className="p-0" md="1" >{D}</Col>
                    <Col className="p-0" md="1" >{L}</Col>
                    <Col className="p-0" md="1" >{GF}</Col>
                    <Col className="p-0"md="1" >{GA}</Col>
                    <Col className="p-0" md="1" >{Pts}</Col>
                  </Row>
                </div>
                )
              })} 
              </div>
            )
          })}
      </div>
          
          </div>
        </div>
      </div>
    </div>
    )
  }

  function getFooter(){
    return(
      <div style={{textAlign:'center',margin:'30px'}}>
        <span>Built By <a target="_blank" href="https://www.linkedin.com/in/peterihaza/"><span className="space-left2 click blue underline">Peter Ihaza</span></a></span>

      </div>
    )
  }

  
}


