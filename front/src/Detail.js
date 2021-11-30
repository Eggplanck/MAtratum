import React from 'react';
import {connect} from 'react-redux';
import Header from './Header';
import StratumLine from './StratumLine';
import './Detail.css'
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ReplyIcon from '@material-ui/icons/Reply';
import Avatar from '@material-ui/core/Avatar';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {withRouter} from 'react-router-dom'
import axios from 'axios';
import Cookies from 'js-cookie';
import CircularProgress from '@material-ui/core/CircularProgress';
import VisibilityIcon from '@material-ui/icons/Visibility';



function mappingState(state) {
    return state
}


class Stratum extends React.Component {
    constructor(props){
        super(props)
        this.createLayer = this.createLayer.bind(this)
        this.Favo = this.Favo.bind(this)
        this.Share = this.Share.bind(this)
        this.toUserDetail = this.toUserDetail.bind(this)
        this.toTargetDetail = this.toTargetDetail.bind(this)
        this.rawCode = this.rawCode.bind(this)
        this.state = {
            loading:true,
            data:null,
            comment_line:[],
            favorite:false,
            favorite_count:-1,
            share:false,
            share_count:-1,
            not_find:false,
            raw:false
        }
    }
    componentWillMount(){
        let accessURL = '/apiv1/detail/' + this.props.match.params.id + '/'
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
                    data:response.data.target_stratum,
                    favorite:response.data.target_stratum.favorite,
                    favorite_count:response.data.target_stratum.favorite_count,
                    share:response.data.target_stratum.share,
                    share_count:response.data.target_stratum.share_count,
                    comment_line:response.data.comment_line,
                    not_find:false
                })
            }.bind(this))
            .catch(function(err){
                alert('正しく読み込めませんでした。')
                this.setState({
                    loading:false,
                    not_find:true
                })
            }.bind(this))
        }else{
            axios.get(accessURL)
            .then(function(response){
                this.setState({
                    loading:false,
                    data:response.data.target_stratum,
                    favorite_count:response.data.target_stratum.favorite_count,
                    share_count:response.data.target_stratum.share_count,
                    comment_line:response.data.comment_line,
                    not_find:false
                })
            }.bind(this))
            .catch(function(err){
                alert('正しく読み込めませんでした。')
                this.setState({
                    loading:false,
                    not_find:true
                })
            }.bind(this))
        }
    }
    componentDidUpdate(prevProps){
        if(this.props.match.params.id !== prevProps.match.params.id){
            let accessURL = '/apiv1/detail/' + this.props.match.params.id + '/'
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
                        data:response.data.target_stratum,
                        favorite:response.data.target_stratum.favorite,
                        favorite_count:response.data.target_stratum.favorite_count,
                        share:response.data.target_stratum.share,
                        share_count:response.data.target_stratum.share_count,
                        comment_line:response.data.comment_line,
                        not_find:false
                    })
                }.bind(this))
                .catch(function(err){
                    alert('正しく読み込めませんでした。')
                    this.setState({
                        loading:false,
                        not_find:true
                    })
                }.bind(this))
            }else{
                axios.get(accessURL)
                .then(function(response){
                    this.setState({
                        loading:false,
                        data:response.data.target_stratum,
                        favorite_count:response.data.target_stratum.favorite_count,
                        share_count:response.data.target_stratum.share_count,
                        comment_line:response.data.comment_line,
                        not_find:false
                    })
                }.bind(this))
                .catch(function(err){
                    alert('正しく読み込めませんでした。')
                    this.setState({
                        loading:false,
                        not_find:true
                    })
                }.bind(this))
            }
        }
    }
    createLayer(){
        let layers = []
        let i = 0
        for(let layer of this.state.data.layers){
            if(layer.text_type==='plain'){
                layers.push(
                    <div className='plainLayer' key={i} >{layer.text}</div>
                )
            }else if(layer.text_type==='tex'){
                if(this.state.raw){
                    layers.push(
                        <div className='texLayer' key={i}>{layer.text}</div>
                    )
                }else{
                    layers.push(
                        <div className='texLayer' key={i}><div className='texroll'><BlockMath math={layer.text} errorColor={'#cc0000'} renderError={(error)=>{return <div>Fail: {error.name}</div>}} /></div></div>
                    )
                }
            }
            i++
        }
        return layers
    }
    rawCode(){
        this.setState({
            raw:!this.state.raw
        })
    }
    Favo(){
        let accessURL = '/apiv1/favorite/'
        if(this.props.logged_in){
            let config = {
                headers: {
                    "Authorization": "Token " + Cookies.get('matratum-auth-token')
                },
            }
            let data = {
                id:this.state.data.id
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
                this.props.dispatch({
                    type:'favInLine',
                    id:this.state.data.id
                })
            }.bind(this))
            .catch(function(err){
                alert('favo error')
            })
        }else{
            this.props.history.push('/login')
        }
    }
    Share(){
        let accessURL = '/apiv1/share/'
        if(this.props.logged_in){
            let config = {
                headers: {
                    "Authorization": "Token " + Cookies.get('matratum-auth-token')
                },
            }
            let data = {
                share_id:this.state.data.id
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
                this.props.dispatch({
                    type:'shareInLine',
                    id:this.state.data.id
                })
            }.bind(this))
            .catch(function(err){
                alert('share error')
            })
        }else{
            this.props.history.push('/login')
        }
    }
    toTargetDetail(){
        this.props.history.push('/detail/'+this.state.data.target.id)
    }
    toUserDetail(event){
        event.stopPropagation()
        this.props.history.push('/userdetail/'+this.state.data.author_id)
    }
    render(){
        if(this.state.loading){
            return (
                <div className='Detail'>
                    <Header className='atama'/>
                        <CircularProgress />
                </div>
            )
        }
        if(this.state.data === null||this.state.not_find){
            return (
                <div className='Detail'>
                    <Header mode='no' className='atama' />
                        <div>Not Found</div>
                </div>
            )
        }
        if(this.state.data.target !== null){
            return (
                <div className='Detail'>
                    <Header target={this.state.data} mode={this.props.logged_in?'detail':'no'} className='atama' />
                    <div className='Stratum'>
                        <div className='commentDetailTarget' onClick={this.toTargetDetail} >
                        To:{this.state.data.target.author}::{this.state.data.target.created}
                        </div>
                        <div className='author' onClick={this.toUserDetail}>
                            {this.state.data.author_avatar===null?
                            <Avatar style={{width:40,height:40}} >
                            <AccountCircleIcon fontSize='large' />
                            </Avatar>:
                            <Avatar style={{width:40,height:40}} src={this.state.data.author_avatar} />}
                            <div>
                            {this.state.data.author}
                            </div>
                        </div>
                        <div className='created'>
                            {this.state.data.created}
                        </div>
                        {this.createLayer()}
                        <div className='detailInfo'>
                            <div className='detailFav'>
                                <FavoriteIcon onClick={this.Favo} style={{fontSize:'130%',color:(this.state.favorite) ? 'red':'gray'}} />
                                {this.state.favorite_count}
                            </div>
                            <div className='detailShare'>
                                <ReplyIcon onClick={this.Share} style={{fontSize:'130%',color:(this.state.share) ? 'blue':'gray'}} />
                                {this.state.share_count}
                            </div>
                            <VisibilityIcon onClick={this.rawCode} style={{color:(this.state.raw) ? 'green':'gray'}} />
                        </div>
                    </div>
                    <StratumLine line={this.state.comment_line} mine={false} />
                    <div style={{width:'98%',height:'50%'}}></div>
                </div>
            )
        }
        return (
            <div className='Detail'>
                <Header target={this.state.data} mode={this.props.logged_in?'detail':'no'} className='atama' />
                <div className='Stratum'>
                    <div className='author' onClick={this.toUserDetail}>
                        {this.state.data.author_avatar===null?
                            <Avatar style={{width:40,height:40}} >
                            <AccountCircleIcon fontSize='large' />
                            </Avatar>:
                            <Avatar style={{width:40,height:40}} src={this.state.data.author_avatar} />}
                        <div>
                        {this.state.data.author}
                        </div>
                    </div>
                    <div className='created'>
                        {this.state.data.created}
                    </div>
                    {this.createLayer()}
                    <div className='detailInfo'>
                        <div className='detailFav'>
                            <FavoriteIcon onClick={this.Favo} style={{fontSize:'130%',color:(this.state.favorite) ? 'red':'gray'}} />
                            {this.state.favorite_count}
                        </div>
                        <div className='detailShare'>
                            <ReplyIcon onClick={this.Share} style={{fontSize:'130%',color:(this.state.share) ? 'blue':'gray'}} />
                            {this.state.share_count}
                        </div>
                        <VisibilityIcon onClick={this.rawCode} style={{color:(this.state.raw) ? 'green':'gray'}} />
                    </div>
                </div>
                <StratumLine line={this.state.comment_line} mine={false} />
                <div style={{width:'98%',height:'50%'}}></div>
            </div>
        )
    }
}

Stratum = withRouter(connect(mappingState)(Stratum))

export default Stratum
