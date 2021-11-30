import React from 'react';
import {connect} from 'react-redux';
import Edit from './Edit'
import TimeLine from './TimeLine'
import Detail from './Detail'
import Search from './Search';
import Mypage from './Mypage';
import UserDetail from './UserDetail'
import Users from './Users'
import Login from './Login'
import Nomatch from './Nomatch'
import Signup from './Signup'
import Profile from './Profile'
import Kiyaku from './Kiyaku'
import {HashRouter, Switch, Route, withRouter, Redirect} from 'react-router-dom'

function mappingState(state) {
    return {
        logged_in: state.logged_in,
        page_mode: state.page_mode
    }
}

class Home extends React.Component {
    render(){
        if(!this.props.logged_in){
            return <Redirect to={'/search'} />
        }
        if(this.props.page_mode === 'timeline'){
            return <TimeLine />
        }
        if(this.props.page_mode === 'search'){
            return <Search />
        }
        if(this.props.page_mode === 'mypage'){
            return <Mypage />
        }
    }
}

Home = withRouter(connect(mappingState)(Home))

class PageControler extends React.Component {
    render(){
        return(
        <HashRouter>
            <Switch>
                <Route exact path='/' component={Home} />
                <Route path='/edit' component={Edit} />
                <Route path='/detail/:id' component={Detail} />
                <Route path='/search' render={(routeProps)=><Search public={true} {...routeProps} />} />
                <Route path='/userdetail/:user_id' component={UserDetail} />
                <Route path='/login' component={Login} />
                <Route path='/signup' component={Signup} />
                <Route path='/follower/:user_id' render={(routeProps)=><Users mode='userfollowed' {...routeProps} />} />
                <Route path='/followee/:user_id' render={(routeProps)=><Users mode='userfollowing' {...routeProps} />} />
                <Route path='/profile' component={Profile} />
                <Route path='/kiyaku' component={Kiyaku} />
                <Route path='*' component={Nomatch} />
            </Switch>
        </HashRouter>
        )
    }
}

PageControler = connect(mappingState)(PageControler)

export default PageControler