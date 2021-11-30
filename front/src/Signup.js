import React from 'react';
import {connect} from 'react-redux';
import Header from './Header';
import './Login.css';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import axios from 'axios';
import Cookies from 'js-cookie';
import {withRouter,Link} from 'react-router-dom'

function mappingState(state) {
    return state
}

class Signup extends React.Component {
    constructor(props){
        super(props)
        this.state ={
            user_id:'',
            display_name:'',
            password:'',
            password2:'',
        }
        this.handleUserIdChange = this.handleUserIdChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handlePassword2Change = this.handlePassword2Change.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleNameChange = this.handleNameChange.bind(this)
    }
    componentDidMount() {
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== this.state.password) {
                return false;
            }
            return true;
        });
    }
    componentWillUnmount() {
        ValidatorForm.removeValidationRule('isPasswordMatch');
    }
    handleNameChange(event){
        if(event.target.value.length<31){
            this.setState({
                display_name:event.target.value
            })
        }
    }
    handleUserIdChange(event){
        if(event.target.value.length<31){
            this.setState({
                user_id:event.target.value
            })
        }
    }
    handlePasswordChange(event){
        this.setState({
            password:event.target.value
        })
    }
    handlePassword2Change(event){
        this.setState({
            password2:event.target.value
        })
    }
    handleSubmit(){
        let accessURL = '/apiv1/signup/'
        let data = {
            user_id:this.state.user_id,
            display_name:this.state.display_name,
            password:this.state.password,
        }
        axios.post(accessURL,data)
        .then(function(response){
            Cookies.set('matratum-auth-token',response.data['token'])
            Cookies.set('matratum-user-id',response.data['user_id'])
            this.props.dispatch({
                type:'Login',
                user_id:response.data['user_id']
            })
            this.props.history.push('/')
        }.bind(this))
        .catch(function(err){
            if(err.response.status === 400){
                alert('パスワードは数字のみでない8文字以上の英数文字列にしてください。')
            }else if(err.response.status === 406){
                alert('そのUserIDはすでに使用されています。他のUserIDを入力してください。')
            }else{
                alert('サインアップに失敗しました。')
            }
        })
    }
    render(){
        return (
            <div className='Login'>
                <Header mode={'signup'} className='atama' />
                    <div style={{width:'100%',textAlign:'center'}}>
                        <h3>アカウントをつくりましょう</h3>
                    </div>
                    <ValidatorForm
                    onSubmit={this.handleSubmit}
                    style={{height:'100%'}}>
                        <div className='forms'>
                        <div className='user_id'>
                        <TextValidator
                            label="User ID"
                            onChange={this.handleUserIdChange}
                            name="user_id"
                            validators={['required']}
                            errorMessages={['this field is required']}
                            value={this.state.user_id}
                            helperText="ログイン時に用いるUser IDを設定してください。唯一無二である必要があります。"
                        />
                        </div>
                        <div className='user_id'>
                        <TextValidator
                            label="Display Name"
                            onChange={this.handleNameChange}
                            name="display_name"
                            validators={['required']}
                            errorMessages={['this field is required']}
                            value={this.state.display_name}
                            helperText='他のユーザーに表示される名前を設定してください。後から変更可能です。'
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
                            helperText='ログイン時に用いるパスワードを設定してください。パスワードは忘れたら終わりです。'
                        />
                        </div>
                        <div className='pass'>
                        <TextValidator
                            label="Password again"
                            onChange={this.handlePassword2Change}
                            name="password2"
                            type="password"
                            validators={['isPasswordMatch','required']}
                            errorMessages={['password mismatch','this field is required']}
                            value={this.state.password2}
                            helperText='確認のためもう一度パスワードを入力してください。'
                        />
                        </div>
                        <div style={{width:'100%',textAlign:'center',fontSize:'70%'}}>
                            この登録により当サイトの<Link to='/kiyaku' target='_blank' rel='noopener noreferrer'>利用規約</Link>に同意したことになります。
                        </div>
                        <Button variant="contained" color="primary" type="submit">signup</Button>
                        </div>
                    </ValidatorForm>
                    <div style={{width:'98%',height:'50%'}}></div>
            </div>
        )
    }
}

Signup = withRouter(connect(mappingState)(Signup))

export default Signup