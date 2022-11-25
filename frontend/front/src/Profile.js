import React from 'react';
import {connect} from 'react-redux';
import Header from './Header';
import Button from '@material-ui/core/Button';
import axios from 'axios';

import './Profile.css';
import TextField from '@material-ui/core/TextField';
import {withRouter, Redirect} from 'react-router-dom';
import Croppie from 'croppie';
import 'croppie/croppie.css'

function mappingState(state) {
    return state
}

class Profile extends React.Component {
    constructor(props){
        super(props)
        this.state ={
            display_name:props.my_name,
            description:props.my_description,
            avatar:props.my_avatar,
            avatar_change:false
        }
        this.handleNameChange = this.handleNameChange.bind(this)
        this.handleDesChange = this.handleDesChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleUpload = this.handleUpload.bind(this)
        this.Cancel = this.Cancel.bind(this)
        this.Exit = this.Exit.bind(this)
    }
    componentDidMount(){
        let el = document.getElementById('crop')
        this.crop = new Croppie(el,{
            viewport: {
                width: 200,
                height: 200,
                type: 'circle'
            },
            boundary: {
                width: 250,
                height: 250
            },
            showZoomer:false,
        })
        if(this.props.my_avatar !== null){
            this.crop.bind({
                url:this.state.avatar,
                zoom:0
            })
        }
    }
    componentWillUnmount(){
        delete this.crop
    }
    handleUpload(event){
        let file = event.target.files
        if (file && file[0]) {
            let reader = new FileReader();
            reader.onload = function(){
                this.setState({
                    avatar:reader.result,
                    avatar_change:true
                })
                this.crop.bind({
                    url:this.state.avatar,
                    zoom:0
                })
            }.bind(this)
            reader.readAsDataURL(file[0]);
        }
    }
    handleNameChange(event){
        if(event.target.value.length<31){
            this.setState({
                display_name:event.target.value
            })
        }
    }
    handleDesChange(event){
        if(event.target.value.length<301){
            this.setState({
                description:event.target.value
            })
        }
    }
    handleSubmit(){
        let accessURL = '/apiv1/profile/'
        if(this.state.avatar_change){
            let config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": "Token " + localStorage.getItem('matratum-auth-token'),
                },
            }
            this.crop.result({
                type:'blob',
                circle:true,
                quality:0.7
            })
            .then(function(image){
                let data = new FormData()
                data.append('display_name',this.state.display_name)
                data.append('description',this.state.description)
                data.append('file',image,this.props.my_id+'avatar.png')
                axios.post(accessURL,data,config)
                .then(function(response){
                    this.props.dispatch({
                        type:'profileUpdate',
                        description:response.description,
                        display_name:response.display_name,
                        avatar:response.avatar
                    })
                    this.props.history.goBack()
                }.bind(this))
                .catch(function(err){
                    alert('変更に失敗しました。')
                })
            }.bind(this))
            .catch(function(err){
                alert('画像の切り取りに失敗しました。')
            })
        }else{
            let config = {
                headers: {
                    "Authorization": "Token " + localStorage.getItem('matratum-auth-token')
                },
            }
            let data = {
                display_name:this.state.display_name,
                description:this.state.description,
                file:null
            }
            axios.post(accessURL,data,config)
            .then(function(response){
                this.props.history.goBack()
            }.bind(this))
            .catch(function(err){
                alert('変更に失敗しました。')
            })
        }
    }
    Cancel(){
        this.props.history.goBack()
    }
    Exit(){
        if(window.confirm('アカウントの復元はできません。退会しますか。')){
            let accessURL = '/apiv1/exit/'
            let config = {
                headers: {
                    "Authorization": "Token " + localStorage.getItem('matratum-auth-token')
                },
            }
            let data = {}
            axios.post(accessURL,data,config)
            .then(function(response){
                this.props.dispatch({
                    type:'Logout'
                })
                this.props.history.push('/')
            }.bind(this))
            .catch(function(err){
                alert('失敗しました。')
            })
        }
    }
    render(){
        if(!this.props.logged_in){
            return <Redirect to={'/login'} />
        }
        return (
            <div className='Profile'>
                <Header mode={''} className='atama' />
                <div className='forms_p'>
                    <div className='display_name'>
                    <TextField
                        label='Display name'
                        size='medium'
                        variant='outlined'
                        value={this.state.display_name}
                        onChange={this.handleNameChange}
                    />
                    </div>
                    <div className='descriptionCase'>
                    <TextField
                        label='Description'
                        multiline
                        variant='outlined'
                        value={this.state.description}
                        onChange={this.handleDesChange}
                    />
                    </div>
                    <div className='filee'>
                        <input type="file" id="upload" accept="image/*" onChange={this.handleUpload} />
                    </div>
                    <div id='crop'>
                    </div>
                    <Button variant="contained" color="secondary" onClick={this.Cancel}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={this.handleSubmit}>変更</Button>
                    <div className='exit'>
                    <Button variant="contained" color="secondary" onClick={this.Exit}>退会</Button>
                    </div>
                </div>
                <div style={{width:'98%',height:'50%'}}></div>
            </div>
        )
    }
}

Profile = withRouter(connect(mappingState)(Profile))

export default Profile