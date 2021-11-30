import React from 'react';
import {connect} from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import './UserList.css'
import {withRouter} from 'react-router-dom'

function mappingState(state) {
    return state
}

class EachUser extends React.Component {
    constructor(props){
        super(props)
        this.toUserDetail = this.toUserDetail.bind(this)
    }
    toUserDetail(event){
        event.stopPropagation()
        this.props.history.push('/userdetail/'+this.props.user.user_id)
    }
    render(){
        return (
            <div className='LooseUser' onClick={this.toUserDetail} >
                <div className='avater'>
                {this.props.user.avatar===null?
                    <Avatar style={{width:40,height:40}}>
                    <AccountCircleIcon />
                    </Avatar>:
                    <Avatar style={{width:40,height:40}} src={this.props.user.avatar}/>}
                </div>
                <div className='LooseUserInfo'>
                    <div className='LooseAuth'>
                        {this.props.user.name}
                    </div>
                    <div className='LooseDesc'>
                        {this.props.user.description}
                    </div>
                </div>
            </div>
        )
    }
}

EachUser = withRouter(connect(mappingState)(EachUser))

class UserList extends React.Component {
    constructor(props){
        super(props)
        this.createUser = this.createUser.bind(this)
    }
    createUser(){
        let user_list = []
        let i = 0
        for(let user of this.props.user_list){
            user_list.push(
                <EachUser key={i} user={user} />
            )
            i++
        }
        return user_list
    }
    render(){
        return (
            <div className='UserList'>
                {this.createUser()}
            </div>
        )
    }
}

UserList = connect(mappingState)(UserList)

export default UserList