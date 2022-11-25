import React from 'react';
import {connect} from 'react-redux';
import Header from './Header';
import UserList from './UserList';
import './Users.css'
import axios from 'axios';

import CircularProgress from '@material-ui/core/CircularProgress';


function mappingState(state) {
    return state
}

class Users extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            user_list:[],
            loading:false
        }
    }
    componentWillMount(){
        let accessURL = '/apiv1/'+this.props.mode+'/' + this.props.match.params.user_id + '/'
        let config = {
            headers: {
                "Authorization": "Token " + localStorage.getItem('matratum-auth-token')
            },
            data:{}
        }
        axios.get(accessURL,config)
        .then(function(response){
            this.setState({
                user_list:response.data.users,
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
    render(){
        if(this.state.loading){
            return (
                <div className='Users'>
                    <Header mode={'users'} />
                    <CircularProgress />
                </div>
            )
        }
        return (
            <div className='Users'>
                <Header mode={'users'} className='atama' />
                <UserList user_list={this.state.user_list} />
            </div>
        )
    }
}

Users = connect(mappingState)(Users)

export default Users