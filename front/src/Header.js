import React from 'react';
import {connect} from 'react-redux';
import './Header.css';
import EditIcon from '@material-ui/icons/Edit';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import UpdateIcon from '@material-ui/icons/Update';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import {withRouter} from 'react-router-dom'
import axios from 'axios';
import Cookies from 'js-cookie';


function mappingState(state) {
    return state
}

class Header extends React.Component {
    constructor(props){
        super(props)
        this.toEdit = this.toEdit.bind(this)
        this.Update = this.Update.bind(this)
        this.Return = this.Return.bind(this)
        this.toHome = this.toHome.bind(this)
        this.toLogin = this.toLogin.bind(this)
        this.toSignup = this.toSignup.bind(this)
        this.toSearch = this.toSearch.bind(this)
        this.Logout = this.Logout.bind(this)
    }
    toEdit(){
        if(this.props.mode === 'detail'){
            this.props.dispatch(
                {
                    type: 'toEdit',
                    target: this.props.target,
                }
            )
        }else{
            this.props.dispatch(
                {
                    type: 'toEdit',
                    target: null,
                }
            )
        }
        this.props.history.push('/edit')
    }
    Update(){
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
    Return(){
        this.props.history.goBack()
    }
    toHome(){
        this.props.history.push('/')
    }
    toLogin(){
        this.props.history.push('/login')
    }
    toSignup(){
        this.props.history.push('/signup')
    }
    toSearch(){
        this.props.history.push('/search')
    }
    Logout(){
        Cookies.remove('matratum-auth-token')
        Cookies.remove('matratum-user-id')
        this.props.dispatch({
            type:'Logout'
        })
        this.props.history.push('/login')
    }
    render(){
        if(this.props.mode === 'timeline'){
            return (
                <div className='headBar'>
                <AppBar style={{backgroundColor:'#620f2f'}} position="static">
                    <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        className='updateButton'
                        onClick={this.Update}
                    >
                        <UpdateIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap className='title' onClick={this.toHome}>
                        MAtratum
                    </Typography>
                    <IconButton
                        edge="start"
                        color="inherit"
                        className='editButton'
                        onClick={this.toEdit}
                    >
                        <EditIcon  />
                    </IconButton>
                    </Toolbar>
                </AppBar>
                </div>
            )
        }
        if(this.props.mode === 'edit'){
            return (
                <div className='headBar'>
                <AppBar style={{backgroundColor:'#620f2f'}} position="static">
                    <Toolbar>
                    <Typography variant="h6" noWrap className='title' onClick={this.toHome}>
                        MAtratum
                    </Typography>
                    </Toolbar>
                </AppBar>
                </div>
            )
        }
        if(this.props.mode === 'detail'){
            return (
                <div className='headBar'>
                <AppBar style={{backgroundColor:'#620f2f'}} position="static">
                    <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={this.Return}
                    >
                        <ArrowBackIosIcon  />
                    </IconButton>
                    <Typography variant="h6" noWrap className='title' onClick={this.toHome}>
                        MAtratum
                    </Typography>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={this.toEdit}
                    >
                        <EditIcon  />
                    </IconButton>
                    </Toolbar>
                </AppBar>
                </div>
            )
        }
        if(this.props.mode === 'public_search'){
            return (
                <div className='headBar'>
                <AppBar style={{backgroundColor:'#620f2f'}} position="static">
                    <Toolbar>
                    <Button onClick={this.toLogin} style={{color:'white'}} variant='outlined' >Login</Button>
                    <Typography variant="h6" noWrap className='title' onClick={this.toHome}>
                        MAtratum
                    </Typography>
                    <Button onClick={this.toSignup} style={{color:'white'}} variant='outlined' >Signup</Button>
                    </Toolbar>
                </AppBar>
                </div>
            )
        }
        if(this.props.mode === 'login'){
            return (
                <div className='headBar'>
                <AppBar style={{backgroundColor:'#620f2f'}} position="static">
                    <Toolbar>
                    <Button onClick={this.toSignup} style={{color:'white'}} variant='outlined' >Signup</Button>
                    <Typography variant="h6" noWrap className='title' onClick={this.toHome}>
                        MAtratum
                    </Typography>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={this.toSearch}
                    >
                        <SearchIcon  />
                    </IconButton>
                    </Toolbar>
                </AppBar>
                </div>
            )
        }
        if(this.props.mode === 'signup'){
            return (
                <div className='headBar'>
                <AppBar style={{backgroundColor:'#620f2f'}} position="static">
                    <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={this.toSearch}
                    >
                        <SearchIcon  />
                    </IconButton>
                    <Typography variant="h6" noWrap className='title' onClick={this.toHome}>
                        MAtratum
                    </Typography>
                    <Button onClick={this.toLogin} style={{color:'white'}} variant='outlined' >Login</Button>
                    </Toolbar>
                </AppBar>
                </div>
            )
        }
        if(this.props.mode === 'user_detail'||this.props.mode === 'users'||this.props.mode === 'no'){
            return (
                <div className='headBar'>
                <AppBar style={{backgroundColor:'#620f2f'}} position="static">
                    <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={this.Return}
                    >
                        <ArrowBackIosIcon  />
                    </IconButton>
                    <Typography variant="h6" noWrap className='title' onClick={this.toHome}>
                        MAtratum
                    </Typography>
                    </Toolbar>
                </AppBar>
                </div>
            )
        }
        if(this.props.mode === 'mypage'){
            return (
                <div className='headBar'>
                <AppBar style={{backgroundColor:'#620f2f'}} position="static">
                    <Toolbar>
                    <Typography variant="h6" noWrap className='title' onClick={this.toHome}>
                        MAtratum
                    </Typography>
                    <Button onClick={this.Logout} style={{color:'white'}} variant='outlined' >Logout</Button>
                    </Toolbar>
                </AppBar>
                </div>
            )
        }
        return (
            <div className='headBar'>
            <AppBar style={{backgroundColor:'#620f2f'}} position="static">
                <Toolbar>
                <Typography variant="h6" noWrap className='title' onClick={this.toHome}>
                    MAtratum
                </Typography>
                </Toolbar>
            </AppBar>
            </div>
        )
    }
}

Header = withRouter(connect(mappingState)(Header))

export default Header