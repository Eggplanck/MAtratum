import React from 'react';
import {connect} from 'react-redux';
import Header from './Header';
import './Login.css';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import axios from 'axios';

import {withRouter, Redirect} from 'react-router-dom'
import Typography from '@material-ui/core/Typography';


function mappingState(state) {
    return state
}

class Login extends React.Component {
    constructor(props){
        super(props)
        this.state ={
            user_id:'',
            password:''
        }
        this.handleUserIdChange = this.handleUserIdChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    componentDidMount(){
        return
    }
    handleUserIdChange(event){
        this.setState({
            user_id:event.target.value
        })
    }
    handlePasswordChange(event){
        this.setState({
            password:event.target.value
        })
    }
    handleSubmit(){
        let accessURL = '/apiv1/auth-login/'
        let data = {
            username:this.state.user_id,
            password:this.state.password
        }
        axios.post(accessURL,data)
        .then(function(response){
            localStorage.setItem('matratum-auth-token',response.data['token'])
            localStorage.setItem('matratum-user-id',response.data['user_id'])
            this.props.dispatch({
                type:'Login',
                user_id:response.data['user_id']
            })
            this.props.history.push('/')
        }.bind(this))
        .catch(function(err){
            alert('User ID, Passwordを正しく入力してください。')
        })
    }
    render(){
        if(this.props.logged_in){
            return <Redirect to={'/'} />
        }
        return (
            <div className='Login'>
                <Header mode={'login'} className='atama' />
                
                    <div style={{width:'100%',textAlign:'center'}}>
                    <Typography variant="h3" gutterBottom>
                        MAtratum
                    </Typography>
                    <span style={{fontSize:'90%'}}>
                        MAtratumは数式を投稿できるSNSです。<br/>通常のテキストの"層"と数式の"層"を無制限に重ねていくことで数式を含む記述を投稿することができます。<br/>MAtratumで数式を用いたコミュニケーションをより豊かなものにしましょう。
                    </span>
                    </div>
                    <ValidatorForm
                    onSubmit={this.handleSubmit}
                    style={{height:'70%'}}>
                        <div className='forms'>
                        <div className='user_id'>
                        <TextValidator
                            label="User ID"
                            onChange={this.handleUserIdChange}
                            name="user_id"
                            validators={['required']}
                            errorMessages={['this field is required']}
                            value={this.state.user_id}
                        />
                        </div>
                        <div className='pass'>
                        <TextValidator
                            label="Password"
                            onChange={this.handlePasswordChange}
                            name="password"
                            type="password"
                            validators={['required']}
                            errorMessages={['this field is required']}
                            value={this.state.password}
                        />
                        </div>
                        <Button variant="contained" color="primary" type="submit">Login</Button>
                        </div>
                    </ValidatorForm>
                    <div style={{width:'98%',height:'50%'}}></div>
                
            </div>
        )
    }
}

Login = withRouter(connect(mappingState)(Login))

export default Login