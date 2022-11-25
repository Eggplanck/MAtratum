import React from 'react';
import {connect} from 'react-redux';
import './StratumLine.css';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ReplyIcon from '@material-ui/icons/Reply';
import { createMuiTheme,ThemeProvider } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';

import {withRouter} from 'react-router-dom'

const theme2 = createMuiTheme({
    palette: {
      primary: {
        main: '#3F51B5',
        },
      secondary: {
        main: '#F50057'
      }
    },
})

function mappingState(state) {
    return state
}

class LooseStratum extends React.Component {
    constructor(props){
        super(props)
        this.index = props.index
        this.Favo = this.Favo.bind(this)
        this.Share = this.Share.bind(this)
        this.toDetail = this.toDetail.bind(this)
        this.toUserDetail = this.toUserDetail.bind(this)
        this.Delete_stratum = this.Delete_stratum.bind(this)
        this.state = {
            favorite:props.data.favorite,
            share:props.data.share,
            favorite_count:props.data.favorite_count,
            share_count:props.data.share_count
        }
    }
    componentDidUpdate(prevProps){
        if(this.props !== prevProps){
            this.setState({
                favorite:this.props.data.favorite,
                share:this.props.data.share,
                favorite_count:this.props.data.favorite_count,
                share_count:this.props.data.share_count
            })
        }
    }
    createLayers(){
        let layers_view = []
        let i = 0
        for(let layer of this.props.data.layers){
            if(i > 3){
                layers_view.push(
                    <div className='nextLayer' key={i}>.....</div>
                )
                break
            }else if(layer.text_type === 'plain'){
                layers_view.push(
                    <div className='plainLayer' key={i}><div className='plainCover'>{layer.text}</div></div>
                )
            }else if(layer.text_type === 'tex'){
                layers_view.push(
                <div className='texLayer' key={i}><div className='texroll'><BlockMath math={layer.text} errorColor={'#cc0000'} renderError={(error)=>{return <div>Fail: {error.name}</div>}} /></div></div>
                )
            }
            i++
        }
        return layers_view
    }
    Favo(event){
        event.stopPropagation()
        if(!this.props.logged_in){
            return
        }
        let accessURL = '/apiv1/favorite/'
        let config = {
            headers: {
                "Authorization": "Token " + localStorage.getItem('matratum-auth-token')
            },
        }
        let data = {
            id:this.props.data.id
        }
        axios.post(accessURL,data,config)
        .then(function(response){
            if(this.state.favorite){
                this.setState({
                    favorite:false,
                    favorite_count:this.state.favorite_count-1
                })
            }else{
                this.setState({
                    favorite:true,
                    favorite_count:this.state.favorite_count+1
                })
            }
            if(this.props.mine){
                this.props.dispatch({
                    type:'favInLine',
                    id:this.props.data.id
                })
            }
        }.bind(this))
        .catch(function(err){
            alert('favo error')
        })
    }
    Share(event){
        event.stopPropagation()
        if(!this.props.logged_in){
            return
        }
        let accessURL = '/apiv1/share/'
        let config = {
            headers: {
                "Authorization": "Token " + localStorage.getItem('matratum-auth-token')
            },
        }
        let data = {
            share_id:this.props.data.id
            }
        axios.post(accessURL,data,config)
        .then(function(response){
            if(this.state.share){
                this.setState({
                    share:false,
                    share_count:this.state.share_count-1
                })
            }else{
                this.setState({
                    share:true,
                    share_count:this.state.share_count+1
                })
            }
            if(this.props.mine){
                this.props.dispatch({
                    type:'shareInLine',
                    id:this.props.data.id
                })
            }
        }.bind(this))
        .catch(function(err){
            alert('share error')
        })
    }
    Delete_stratum(event){
        event.stopPropagation()
        if(!this.props.logged_in){
            return
        }
        if(window.confirm('一度削除した投稿は復元できません。投稿を削除しますか。')){
            let accessURL = '/apiv1/delete/'
            let config = {
                headers: {
                    "Authorization": "Token " + localStorage.getItem('matratum-auth-token')
                },
            }
            let data = {
                id:this.props.data.id
                }
            axios.post(accessURL,data,config)
            .then(function(response){
                this.props.dispatch({
                    type:'DeleteMine',
                    id:this.props.data.id
                })
            }.bind(this))
            .catch(function(err){
                alert('delete error')
            })
        }
    }
    toDetail(){
        this.props.history.push('/detail/'+this.props.data.id)
    }
    toUserDetail(event){
        event.stopPropagation()
        this.props.history.push('/userdetail/'+this.props.data.author_id)
    }
    render(){
        if(this.props.data.target !== null){
            return (
                <div className='LooseStratum' onClick={this.toDetail}>
                    {this.props.data.share_owner===null?'':<div className='commentTarget'>shared by {this.props.data.share_owner}</div>}
                    <div className='commentTarget'>
                        To:{this.props.data.target.author}::{this.props.data.target.created}
                    </div>
                    <div className='LooseAuthor'>
                        {this.props.data.author_avatar===null?
                            <Avatar style={{width:30,height:30}} onClick={this.toUserDetail}>
                            <AccountCircleIcon />
                            </Avatar>:
                            <Avatar style={{width:30,height:30}} src={this.props.data.author_avatar} onClick={this.toUserDetail} />}
                        <div onClick={this.toUserDetail}>{this.props.data.author}</div>
                    </div>
                    <div className='LooseCreated'>{this.props.data.created}</div>
                    <div className='layers'>
                        {this.createLayers()}
                    </div>
                    <div className='info'>
                        <div className='fav'>
                            <FavoriteIcon onClick={this.Favo} style={{fontSize:'130%',color:(this.state.favorite) ? 'red':'gray'}} />
                            {this.state.favorite_count}
                        </div>
                        <div className='share'>
                            <ReplyIcon onClick={this.Share} style={{fontSize:'130%',color:(this.state.share) ? 'blue':'gray'}} />
                            {this.state.share_count}
                        </div>
                        {(this.props.deletable===true&&this.props.data.share_owner===null)?
                        <div className='share'>
                            <DeleteIcon onClick={this.Delete_stratum} style={{fontSize:'130%',color:'black'}} />
                        </div>:''}
                    </div>
                </div>
            )
        }
        return (
            <div className='LooseStratum' onClick={this.toDetail}>
                {this.props.data.share_owner===null?'':<div className='commentTarget'>shared by {this.props.data.share_owner}</div>}
                <div className='LooseAuthor'>
                        {this.props.data.author_avatar===null?
                            <Avatar style={{width:30,height:30}} onClick={this.toUserDetail}>
                            <AccountCircleIcon />
                            </Avatar>:
                            <Avatar style={{width:30,height:30}} src={this.props.data.author_avatar} onClick={this.toUserDetail} />}
                    <div onClick={this.toUserDetail}>{this.props.data.author}</div>
                </div>
                <div className='LooseCreated'>{this.props.data.created}</div>
                <div className='layers'>
                    {this.createLayers()}
                </div>
                <div className='info'>
                    <div className='fav'>
                        <FavoriteIcon onClick={this.Favo} style={{fontSize:'130%',color:(this.state.favorite) ? 'red':'gray'}} />
                        {this.state.favorite_count}
                    </div>
                    <div className='share'>
                        <ReplyIcon onClick={this.Share} style={{fontSize:'130%',color:(this.state.share) ? 'blue':'gray'}} />
                        {this.state.share_count}
                    </div>
                    {(this.props.deletable===true&&this.props.data.share_owner===null)?
                    <div className='share'>
                        <DeleteIcon onClick={this.Delete_stratum} style={{fontSize:'130%',color:'black'}} />
                    </div>:''}
                </div>
            </div>
        )
    }
}

LooseStratum = withRouter(connect(mappingState)(LooseStratum))

class StratumLine extends React.Component {
    constructor(props){
        super(props)
        this.createLine = this.createLine.bind(this)
    }
    createLine(){
        let line_view = []
        let i = 0
        for(let stratum of this.props.line){
            line_view.push(<LooseStratum key={i} index={i} mine={this.props.mine} data={stratum} deletable={this.props.deletable} />)
            i++
        }
        return line_view
    }
    render(){
        return (
            <div className='StratumLine'>
                <ThemeProvider theme={theme2}>
                {this.createLine()}
                </ThemeProvider>
            </div>
        )
    }
}

StratumLine = connect(mappingState)(StratumLine)

export default StratumLine