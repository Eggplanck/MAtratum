import React from 'react';
import {connect} from 'react-redux';
import StratumLine from './StratumLine';
import Footer from './Footer';
import Header from './Header';
import './Search.css'
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Button } from '@material-ui/core';
import UserList from './UserList'
import axios from 'axios';
import Cookies from 'js-cookie';
import CircularProgress from '@material-ui/core/CircularProgress';
import {withRouter} from 'react-router-dom'



function mappingState(state) {
    return state
}

class Search extends React.Component {
    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.handleTypeChange = this.handleTypeChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handleEnter = this.handleEnter.bind(this)
        this.More = this.More.bind(this)
        this.state = {
            word: '',
            type: 'word',
            loading:false
        }
    }
    handleChange(event){
        this.setState({
            word:event.target.value
        })
    }
    handleTypeChange(event){
        this.setState({
            type: event.target.value
        })
        this.props.dispatch({
            type:'changeSearchType',
            search_type:event.target.value
        })
    }
    handleEnter(e){
        if(e.which === 13){
            this.handleClick()
        }
    }
    componentDidMount(){
        if(this.state.word === '' && this.props.search_result.length === 0){
            this.setState({
                loading:true
            })
            if(this.props.logged_in){
                let accessURL = '/apiv1/latest/'
                let config = {
                    headers: {
                        "Authorization": "Token " + Cookies.get('matratum-auth-token')
                    },
                    data:{}
                }
                axios.get(accessURL,config)
                .then(function(response){
                    this.props.dispatch({
                        type:'Searched',
                        result:response.data.line,
                    })
                    this.setState({
                        loading:false
                    })
                }.bind(this))
                .catch(function(err){
                    alert('正しく読み込めませんでした。')
                    this.setState({
                        loading:false
                    })
                }.bind(this))
            }else{
                let accessURL = '/apiv1/latest/'
                axios.get(accessURL)
                .then(function(response){
                    this.props.dispatch({
                        type:'Searched',
                        result:response.data.line,
                    })
                    this.setState({
                        loading:false
                    })
                }.bind(this))
                .catch(function(err){
                    alert('正しく読み込めませんでした。')
                    this.setState({
                        loading:false
                    })
                }.bind(this))
            }
        }
    }
    handleClick(){
        if(this.state.word === ''){
            return
        }
        this.setState({
            loading:true
        })
        if(this.props.logged_in){
            if(this.state.type === 'word'){
                let accessURL = '/apiv1/wordsearch/' + this.state.word + '/'
                let config = {
                    headers: {
                        "Authorization": "Token " + Cookies.get('matratum-auth-token')
                    },
                    data:{}
                }
                axios.get(accessURL,config)
                .then(function(response){
                    this.props.dispatch({
                        type:'Searched',
                        result:response.data.line,
                    })
                    this.setState({
                        loading:false
                    })
                }.bind(this))
                .catch(function(err){
                    alert('検索結果を正しく読み込めませんでした。')
                    this.setState({
                        loading:false
                    })
                }.bind(this))
            }else{
                let accessURL = '/apiv1/usersearch/' + this.state.word + '/'
                let config = {
                    headers: {
                        "Authorization": "Token " + Cookies.get('matratum-auth-token')
                    },
                    data:{}
                }
                axios.get(accessURL,config)
                .then(function(response){
                    this.props.dispatch({
                        type:'Searched',
                        result:response.data.users,
                    })
                    this.setState({
                        loading:false
                    })
                }.bind(this))
                .catch(function(err){
                    alert('検索結果を正しく読み込めませんでした。')
                    this.setState({
                        loading:false
                    })
                }.bind(this))
            }
        }else{
            if(this.state.type === 'word'){
                let accessURL = '/apiv1/wordsearch/' + this.state.word + '/'
                axios.get(accessURL)
                .then(function(response){
                    this.props.dispatch({
                        type:'Searched',
                        result:response.data.line,
                    })
                    this.setState({
                        loading:false
                    })
                }.bind(this))
                .catch(function(err){
                    alert('検索結果を正しく読み込めませんでした。')
                    this.setState({
                        loading:false
                    })
                }.bind(this))
            }else{
                let accessURL = '/apiv1/usersearch/' + this.state.word + '/'
                axios.get(accessURL)
                .then(function(response){
                    this.props.dispatch({
                        type:'Searched',
                        result:response.data.users,
                    })
                    this.setState({
                        loading:false
                    })
                }.bind(this))
                .catch(function(err){
                    alert('検索結果を正しく読み込めませんでした。')
                    this.setState({
                        loading:false
                    })
                }.bind(this))
            }
        }
    }
    More(){
        if(this.props.search_result.length === 0){
            return
        }
        if(this.state.word === ''){
            return
        }
        let lastTime = this.props.search_result[this.props.search_result.length-1].created
        let accessURL = '/apiv1/wordsearch-more/' + this.state.word + '/' + lastTime + '/'
        if(this.props.logged_in){
            if(this.state.type === 'word'){
                let config = {
                    headers: {
                        "Authorization": "Token " + Cookies.get('matratum-auth-token')
                    },
                    data:{}
                }
                axios.get(accessURL,config)
                .then(function(response){
                    this.props.dispatch({
                        type:'MoreSearched',
                        result:response.data.line,
                    })
                }.bind(this))
                .catch(function(err){
                    alert('検索結果を正しく読み込めませんでした。')
                    this.setState({
                        loading:false
                    })
                }.bind(this))
            }
        }else{
            if(this.state.type === 'word'){
                axios.get(accessURL)
                .then(function(response){
                    this.props.dispatch({
                        type:'MoreSearched',
                        result:response.data.line,
                    })
                }.bind(this))
                .catch(function(err){
                    alert('検索結果を正しく読み込めませんでした。')
                    this.setState({
                        loading:false
                    })
                }.bind(this))
            }
        }
    }
    render(){
        if(this.state.loading){
            return(
                <div className='Search2'>
                    <Header mode={'search'} className='atama' />
                    <div className='SearchField'>
                    <div>
                    <TextField
                        label='Search'
                        size='small'
                        InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                            <SearchIcon onClick={this.handleClick} />
                            </InputAdornment>
                        ),
                        }}
                        variant='filled'
                        value={this.state.word}
                        onChange={this.handleChange}
                        onKeyPress={this.handleEnter}
                    />
                    </div>
                    <div>
                    <FormControl style={{width:100}}>
                        <InputLabel>Search type</InputLabel>
                        <Select
                        value={this.props.search_type}
                        onChange={this.handleTypeChange}
                        >
                        <MenuItem value='word'>Word</MenuItem>
                        <MenuItem value='user'>User</MenuItem>
                        </Select>
                    </FormControl>
                    </div>
                    </div>
                    <CircularProgress />
                </div>
            )
        }
        if(!this.props.public){
            return (
                <div className='Search'>
                    <Header mode={'search'} className='atama' />
                    <Footer className='ashi' />
                    <div className='SearchField'>
                    <div>
                    <TextField
                        label='Search'
                        size='small'
                        InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                            <SearchIcon onClick={this.handleClick} />
                            </InputAdornment>
                        ),
                        }}
                        variant='filled'
                        value={this.state.word}
                        onChange={this.handleChange}
                        onKeyPress={this.handleEnter}
                    />
                    </div>
                    <div>
                    <FormControl style={{width:100}}>
                        <InputLabel>Search type</InputLabel>
                        <Select
                        value={this.props.search_type}
                        onChange={this.handleTypeChange}
                        >
                        <MenuItem value='word'>Word</MenuItem>
                        <MenuItem value='user'>User</MenuItem>
                        </Select>
                    </FormControl>
                    </div>
                    </div>
                    {(this.props.search_type==='word')?<StratumLine line={this.props.search_result} mine={'search_result'} />:<UserList user_list={this.props.search_result} />}
                    {(this.props.search_type==='word'&&this.props.search_result.length>0)?<div style={{width:'98%',textAlign:'center'}}>
                    <Button onClick={this.More} size='small' >More...</Button>
                    </div>:''}
                    <div style={{width:'98%',height:'50%'}}></div>
                </div>
            )
        }else{
            return (
                <div className='Search2'>
                    <Header mode={'public_search'} className='atama' />
                    <div className='SearchField'>
                    <div>
                    <TextField
                        label='Search'
                        size='small'
                        InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                            <SearchIcon onClick={this.handleClick} />
                            </InputAdornment>
                        ),
                        }}
                        variant='filled'
                        value={this.state.word}
                        onChange={this.handleChange}
                        onKeyPress={this.handleEnter}
                    />
                    </div>
                    <div>
                    <FormControl style={{width:100}}>
                        <InputLabel>Search type</InputLabel>
                        <Select
                        value={this.props.search_type}
                        onChange={this.handleTypeChange}
                        >
                        <MenuItem value='word'>Word</MenuItem>
                        <MenuItem value='user'>User</MenuItem>
                        </Select>
                    </FormControl>
                    </div>
                    </div>
                    {(this.props.search_type==='word')?<StratumLine line={this.props.search_result} mine={'search_result'} />:<UserList user_list={this.props.search_result} />}
                    {(this.props.search_type==='word'&&this.props.search_result.length>0)?<div style={{width:'98%',textAlign:'center'}}>
                    <Button onClick={this.More} size='small' >More...</Button>
                    </div>:''}
                    <div style={{width:'98%',height:'50%'}}></div>
                </div>
            )
        }
    }
}

Search = withRouter(connect(mappingState)(Search))

export default Search