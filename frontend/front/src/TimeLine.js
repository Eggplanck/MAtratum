import React from 'react';
import {connect} from 'react-redux';
import StratumLine from './StratumLine';
import Footer from './Footer';
import Header from './Header';
import './TimeLine.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import {withRouter} from 'react-router-dom'
import { Button } from '@material-ui/core';



function mappingState(state) {
    return state
}

class TimeLine extends React.Component {
    constructor(props){
        super(props)
        this.More = this.More.bind(this)
    }
    componentWillMount(){
        if(!this.props.logged_in){
            this.props.history.push('/login')
        }else{
            if(!this.props.timeline_init){
                let accessURL = '/apiv1/timeline/' + this.props.last_update_time + '/'
                let config = {
                    headers: {
                        "Authorization": "Token " + Cookies.get('matratum-auth-token')
                    },
                    data:{}
                }
                axios.get(accessURL,config)
                .then(function(response){
                    this.props.dispatch({
                        type:'UpdateTimeline',
                        UpdateTime:response.data.updateTime,
                        line:response.data.line
                    })
                }.bind(this))
                .catch(function(err){
                    alert('タイムラインを正しく読み込めませんでした。')
                })
            }
        }
    }
    More(){
        if(!this.props.logged_in){
            this.props.history.push('/login')
        }else{
            if(this.props.timeline.length===0){
                return
            }
            let lastTime = this.props.timeline[this.props.timeline.length-1].created
            let accessURL = '/apiv1/timeline-more/' + lastTime + '/'
            let config = {
                headers: {
                    "Authorization": "Token " + Cookies.get('matratum-auth-token')
                },
                data:{}
            }
            axios.get(accessURL,config)
            .then(function(response){
                this.props.dispatch({
                    type:'MoreTimeLine',
                    line:response.data.line
                })
            }.bind(this))
            .catch(function(err){
                alert('タイムラインを正しく読み込めませんでした。')
            })
        }
    }
    render(){
        return (
            <div className='TimeLine'>
                <Header mode={'timeline'} className='atama' />
                <Footer className='ashi' />
                <StratumLine line={this.props.timeline} mine={'timeline'} />
                {(this.props.timeline.length > 29)?
                <div style={{width:'98%',textAlign:'center'}}>
                <Button onClick={this.More} size='small' >More...</Button>
                </div>:''
                }
                <div style={{width:'98%',height:'50%'}}></div>
            </div>
        )
    }
}

TimeLine = withRouter(connect(mappingState)(TimeLine))

export default TimeLine