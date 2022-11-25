import React from 'react';
import {connect} from 'react-redux';
import StratumLine from './StratumLine';
import Footer from './Footer';
import Header from './Header';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import EditIcon from '@material-ui/icons/Edit';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import './Mypage.css'
import Avatar from '@material-ui/core/Avatar';
import axios from 'axios';

import {withRouter} from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress';
import { Button } from '@material-ui/core';


function mappingState(state) {
    return state
}

class Mypage extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            value: 'my',
            loading:false
        }
        this.toFollower = this.toFollower.bind(this)
        this.toFollowee = this.toFollowee.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.toProfile = this.toProfile.bind(this)
        this.More = this.More.bind(this)
    }
    componentWillMount(){
        if(!this.props.logged_in){
            this.props.history.replace('/login')
        }else{
            if(!this.props.mypage_init){
                let user_id = localStorage.getItem('matratum-user-id')
                let accessURL1 = '/apiv1/userdetail/' + user_id + '/'
                let accessURL2 = '/apiv1/favorite/'
                let config = {
                    headers: {
                        "Authorization": "Token " + localStorage.getItem('matratum-auth-token')
                    },
                    data:{}
                }
                let favorite_line
                axios.get(accessURL2,config)
                .then(function(response1){
                    favorite_line = response1.data.favorite_line
                    axios.get(accessURL1,config)
                    .then(function(response2){
                        let my_page_data = {
                            my_line:response2.data.user_line,
                            user_info:response2.data.user_info,
                            favorite_line:favorite_line
                        }
                        this.props.dispatch({
                            type:'loadMyPage',
                            data:my_page_data
                        })
                        this.setState({
                            loading:false
                        })
                    }.bind(this))
                    .catch(function(err){
                        alert('マイページを正しく読み込めませんでした。')
                        this.setState({
                            loading:false
                        })
                    }.bind(this))
                }.bind(this))
                .catch(function(err){
                    alert('マイページを正しく読み込めませんでした。')
                    this.setState({
                        loading:false
                    })
                }.bind(this))
            }
        }
    }
    toFollower(event){
        this.props.history.push('/follower/'+this.props.my_id)
    }
    toFollowee(event){
        this.props.history.push('/followee/'+this.props.my_id)
    }
    toProfile(){
        this.props.history.push('/profile')
    }
    handleChange(event,value){
        if(value !== this.state.value){
            this.setState({
                value: value
            })
        }
    }
    More(){
        if(this.state.value === 'my'){
            if(this.props.my_line.length === 0){
                return
            }
            let user_id = localStorage.getItem('matratum-user-id')
            let lastTime = this.props.my_line[this.props.my_line.length-1].created
            let accessURL = '/apiv1/userline-more/' + user_id + '/' + lastTime + '/'
            let config = {
                headers: {
                    "Authorization": "Token " + localStorage.getItem('matratum-auth-token')
                },
                data:{}
            }
            axios.get(accessURL,config)
            .then(function(response){
                this.props.dispatch({
                    type:'MyLineMore',
                    line:response.data.line
                })
            }.bind(this))
            .catch(function(err){
                alert('正しく読み込めませんでした。')
            })
        }else{
            if(this.props.my_favs.length === 0){
                return
            }
            let lastTime = this.props.my_favs[this.props.my_favs.length-1].created
            let accessURL = '/apiv1/favorite-more/' + lastTime + '/'
            let config = {
                headers: {
                    "Authorization": "Token " + localStorage.getItem('matratum-auth-token')
                },
                data:{}
            }
            axios.get(accessURL,config)
            .then(function(response){
                this.props.dispatch({
                    type:'MyFavsMore',
                    line:response.data.line
                })
            }.bind(this))
            .catch(function(err){
                alert('正しく読み込めませんでした。')
            })
        }
    }
    render(){
        if(this.state.loading){
            return (
                <div className='Mypage'>
                    <Header mode={'mypage'} />
                    <Footer />
                    <CircularProgress />
                </div>
            )
        }
        return (
            <div className='Mypage'>
                <Header mode={'mypage'} className='atama'/>
                <Footer className='ashi' />
                <div className='profile'>
                    <div className='toprofile'>
                        <Button variant="contained" size="small" color="primary" onClick={this.toProfile} startIcon={<EditIcon />}>Edit profile</Button>
                    </div>
                    <div className='Avater'>
                        {this.props.my_avatar===null?
                        <Avatar>
                        <AccountCircleIcon fontSize='large'/>
                        </Avatar>:
                        <Avatar src={this.props.my_avatar}/>}
                    </div>
                    <div className='name'>
                        {this.props.my_name}
                    </div>
                    <div className='followInfo'>
                        <div className='followCount' onClick={this.toFollower} >Follower:{this.props.my_follower_count}</div>
                        <div className='followCount' onClick={this.toFollowee} >Followee:{this.props.my_followee_count}</div>
                    </div>
                    <div className='Explain'>{this.props.my_description}</div>
                </div>
                <Paper position='relative' style={{zIndex:50}}>
                    <Tabs value={this.state.value} onChange={this.handleChange} variant='fullWidth' indicatorColor="primary">
                    <Tab label="My submittions" value='my' />
                    <Tab label="Favorite" value='favs'/>
                    </Tabs>
                </Paper>
                {(this.state.value==='my')?<StratumLine line={this.props.my_line} mine={'my_line'} deletable={true} />:<StratumLine line={this.props.my_favs} mine={'my_favs'} />}
                <div style={{width:'98%',textAlign:'center'}}>
                <Button onClick={this.More} size='small' >More...</Button>
                </div>
                <div style={{width:'98%',height:'50%'}}></div>
                </div>
        )
    }
}

Mypage = withRouter(connect(mappingState)(Mypage))

export default Mypage