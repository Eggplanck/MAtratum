import React from 'react';
import {connect} from 'react-redux';
import StratumLine from './StratumLine';
import Header from './Header';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import './UserDetail.css'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Cookies from 'js-cookie';
import CircularProgress from '@material-ui/core/CircularProgress';
import {withRouter} from 'react-router-dom'


function mappingState(state) {
    return state
}

class UserDetail extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            loading:true,
            following:false,
            followed:false,
            data:{},
            user_line:[],
            not_found:false
        }
        this.toFollower = this.toFollower.bind(this)
        this.toFollowee = this.toFollowee.bind(this)
        this.Follow = this.Follow.bind(this)
        this.More = this.More.bind(this)
    }
    componentWillMount(){
        let accessURL = '/apiv1/userdetail/' + this.props.match.params.user_id + '/'
        if(this.props.logged_in){
            let config = {
                headers: {
                    "Authorization": "Token " + Cookies.get('matratum-auth-token')
                },
                data:{}
            }
            axios.get(accessURL,config)
            .then(function(response){
                this.setState({
                    loading:false,
                    data:response.data.user_info,
                    user_line:response.data.user_line,
                    following:response.data.user_info.following,
                    followed:response.data.user_info.followed,
                    not_found:false
                })
            }.bind(this))
            .catch(function(err){
                alert('正しく読み込めませんでした。')
                this.setState({
                    loading:false,
                    not_found:true
                })
            }.bind(this))
        }else{
            axios.get(accessURL)
            .then(function(response){
                this.setState({
                    loading:false,
                    data:response.data.user_info,
                    user_line:response.data.user_line,
                    following:response.data.user_info.following,
                    followed:response.data.user_info.followed,
                    not_found:false
                })
            }.bind(this))
            .catch(function(err){
                alert('正しく読み込めませんでした。')
                this.setState({
                    loading:false,
                    not_found:true
                })
            }.bind(this))
        }
    }
    componentDidUpdate(prevProps){
        if(this.props.match.params.user_id !== prevProps.match.params.user_id){
            let accessURL = '/apiv1/userdetail/' + this.props.match.params.user_id + '/'
            if(this.props.logged_in){
                let config = {
                    headers: {
                        "Authorization": "Token " + Cookies.get('matratum-auth-token')
                    },
                    data:{}
                }
                axios.get(accessURL,config)
                .then(function(response){
                    this.setState({
                        loading:false,
                        data:response.data.user_info,
                        user_line:response.data.user_line,
                        following:response.data.user_info.following,
                        followed:response.data.user_info.followed,
                        not_found:false
                    })
                }.bind(this))
                .catch(function(err){
                    alert('正しく読み込めませんでした。')
                    this.setState({
                        loading:false,
                        not_found:true
                    })
                }.bind(this))
            }else{
                axios.get(accessURL)
                .then(function(response){
                    this.setState({
                        loading:false,
                        data:response.data.user_info,
                        user_line:response.data.user_line,
                        following:response.data.user_info.following,
                        followed:response.data.user_info.followed,
                        not_found:false
                    })
                }.bind(this))
                .catch(function(err){
                    alert('正しく読み込めませんでした。')
                    this.setState({
                        loading:false,
                        not_found:true
                    })
                }.bind(this))
            }
        }
    }
    More(){
        if(this.state.user_line.length===0){
            return
        }
        let lastTime = this.state.user_line[this.state.user_line.length-1].created
        let accessURL = '/apiv1/userline-more/' + this.props.match.params.user_id + '/' + lastTime + '/'
        let config = {
            headers: {
                "Authorization": "Token " + Cookies.get('matratum-auth-token')
            },
            data:{}
        }
        axios.get(accessURL,config)
        .then(function(response){
            this.setState({
                user_line:this.state.user_line.concat(response.data.line)
            })
        }.bind(this))
        .catch(function(err){
            alert('正しく読み込めませんでした。')
        })
    }
    toFollower(){
        this.props.history.push('/follower/'+this.state.data.user_id)
    }
    toFollowee(){
        this.props.history.push('/followee/'+this.state.data.user_id)
    }
    Follow(){
        let accessURL = '/apiv1/follow/'
        let config = {
            headers: {
                "Authorization": "Token " + Cookies.get('matratum-auth-token')
            },
        }
        let data = {
            user_id:this.state.data.user_id
        }
        axios.post(accessURL,data,config)
        .then(function(response){
            this.setState({
                following:!this.state.following
            })
            this.props.dispatch({
                type:'Reset'
            })
        }.bind(this))
        .catch(function(err){
            alert('正しく処理できませんでした。')
        })
    }
    render(){
        if(this.state.loading){
            return (
                <div className='UserDetail'>
                    <Header mode={'user_detail'} />
                    <CircularProgress />
                </div>
            )
        }
        if(this.state.not_found){
            return (
                <div className='UserDetail'>
                    <Header mode='no' />
                    <div>Not Found</div>
                </div>
            )
        }
        if(this.props.logged_in){
            return (
                <div className='UserDetail'>
                    <Header mode={'user_detail'} className='atama'/>
                    <div className='profile'>
                        <div className='Avater'>
                            {this.state.data.avatar===null?
                            <Avatar>
                            <AccountCircleIcon fontSize='large'/>
                            </Avatar>:
                            <Avatar src={this.state.data.avatar}/>}
                        </div>
                        <div className='name'>
                            {this.state.data.name}
                        </div>
                        <div className='followButton'>
                        {this.state.followed?'Followed':''}
                        </div>
                        {(this.props.match.params.user_id !== Cookies.get('matratum-user-id'))?
                        <div className='followButton'>
                            {!this.state.following?
                            <Button variant='contained' color='primary' onClick={this.Follow} >
                                Follow
                            </Button>:
                            <Button variant='contained' color='secondary' onClick={this.Follow} >
                            UnFollow
                            </Button>}
                        </div>:
                        ''}
                        <div className='followInfo'>
                            <div className='followCount' onClick={this.toFollower} >follower:{this.state.data.follower_count}</div>
                            <div className='followCount' onClick={this.toFollowee} >followee:{this.state.data.followee_count}</div>
                        </div>
                        <div className='Explain'>{this.state.data.description}</div>
                    </div>
                    <StratumLine line={this.state.user_line} />
                    {(this.state.user_line.length>29)?
                    <div style={{width:'98%',textAlign:'center'}}>
                    <Button onClick={this.More} size='small' >More...</Button>
                    </div>:''
                    }
                    <div style={{width:'98%',height:'50%'}}></div>
                </div>
            )
        }
        return (
            <div className='UserDetail'>
                <Header mode={'user_detail'} className='atama' />
                <div className='profile'>
                    <div className='Avater'>
                        {this.state.data.avatar===null?
                            <Avatar>
                            <AccountCircleIcon fontSize='large'/>
                            </Avatar>:
                            <Avatar src={this.state.data.avatar}/>}
                    </div>
                    <div className='name'>
                        {this.state.data.name}
                    </div>
                    <div className='followInfo'>
                        <div className='followCount' onClick={this.toFollower} >Follower:{this.state.data.follower_count}</div>
                        <div className='followCount' onClick={this.toFollowee} >Followee:{this.state.data.followee_count}</div>
                    </div>
                    <div className='Explain'>{this.state.data.description}</div>
                </div>
                <StratumLine line={this.state.user_line} />
                {(this.state.user_line.length>29)?
                <div style={{width:'98%',textAlign:'center'}}>
                <Button onClick={this.More} size='small' >More...</Button>
                </div>:''
                }
                <div style={{width:'98%',height:'50%'}}></div>
            </div>
        )
    }
}

UserDetail = withRouter(connect(mappingState)(UserDetail))

export default UserDetail