import React from 'react';
import {connect} from 'react-redux';
import Header from './Header';
import './Edit.css'
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import axios from 'axios';

import {withRouter, Redirect} from 'react-router-dom'


function mappingState(state) {
    return state
}

class EditingLayer extends React.Component {
    constructor(props){
        super(props)
        this.Clear = this.Clear.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.textRef = React.createRef()
        this.state = {
            mode: props.mode
        }
    }
    componentDidMount(){
        this.textRef.current.focus()
    }
    componentDidUpdate(prevProps){
        if(this.props !== prevProps){
            this.setState({
                mode: this.props.mode,
            })
        }
    }
    Clear(){
        this.props.dispatch(
            {
                type: 'layerClear',
                index: this.props.index,
            }
        )
    }
    handleChange(event){
        this.props.dispatch(
            {
                type: 'textChange',
                index: this.props.index,
                text: event.target.value
            }
        )
    }
    render(){
        if(this.state.mode === 'edit'){
            if(this.props.text_type === 'plain'){
                return (
                    <div className='plainTextareaCase'>
                    <ClearIcon className='closeButton' onClick={this.Clear} />
                    <TextareaAutosize rowsMin={4} className='Textarea' maxLength={200} value={this.props.text} onChange={this.handleChange} ref={this.textRef} ></TextareaAutosize>
                    </div>
                )
            }
            if(this.props.text_type === 'tex'){
                return (
                    <div className='texTextareaCase'>
                    <ClearIcon className='closeButton' onClick={this.Clear} />
                    <TextareaAutosize rowsMin={4} className='Textarea' maxLength={600} value={this.props.text} onChange={this.handleChange} ref={this.textRef} ></TextareaAutosize>
                    </div>
                )
            }
        }
        if(this.state.mode === 'view'){
            if(this.props.text_type === 'plain'){
                return (
                    <div className='plainEditLayer'>{this.props.text}</div>
                )
            }
            if(this.props.text_type === 'tex'){
                return (
                    <div className='texEditLayer'><div className='texroll'><BlockMath math={this.props.text} errorColor={'#cc0000'} renderError={(error)=>{return <div>Fail: {error.name}</div>}} /></div></div>
                    )
            }
        }
    }
}

EditingLayer = connect(mappingState)(EditingLayer)

class Edit extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            mode: 'edit'
        }
        this.createEditLayer = this.createEditLayer.bind(this)
        this.changeMode = this.changeMode.bind(this)
        this.Cancel = this.Cancel.bind(this)
        this.addPlainBox = this.addPlainBox.bind(this)
        this.addTexBox = this.addTexBox.bind(this)
        this.Post = this.Post.bind(this)
    }
    createEditLayer(){
        let layers = []
        let i = 0
        for(let layer of this.props.draft_stratum){
            layers.push(
                <EditingLayer index={i} text_type={layer.text_type} text={layer.text} mode={this.state.mode} key={i} />
            )
            i++
        }
        return layers
    }
    changeMode(event,mode){
        if(mode === null){
            return
        }
        this.setState({
            mode: mode
        })
    }
    Cancel(){
        this.props.dispatch({
            type:'editCancel'
        })
        this.props.history.goBack()
    }
    addPlainBox(){
        this.props.dispatch({
            type: 'addLayer',
            text_type: 'plain'
        })
    }
    addTexBox(){
        this.props.dispatch({
            type: 'addLayer',
            text_type: 'tex'
        })
    }
    Post(){
        let accessURL = '/apiv1/create/'
        let target
        if(this.props.draft_target === null){
            target = null
        }else{
            target = this.props.draft_target.id
        }
        let layers = []
        for(let l=0;l<this.props.draft_stratum.length;l++){
            if(this.props.draft_stratum[l].text===''){
                return
            }
            layers.push({
                index:l,
                text_type:this.props.draft_stratum[l].text_type,
                text:this.props.draft_stratum[l].text
            })
        }
        let post_data = {
            target:target,
            layers:layers
        }
        let config = {
            headers: {
                "Authorization": "Token " + localStorage.getItem('matratum-auth-token')
            },
        }
        axios.post(accessURL,post_data,config)
        .then(function(response){
            this.props.dispatch({
                type:'editCancel'
            })
            this.props.history.goBack()
        }.bind(this))
        .catch(function(err){
            alert('正しく投稿できませんでした。')
        })
    }
    render(){
        if(!this.props.logged_in){
            return <Redirect to={'/login'} />
        }
        if(this.props.draft_target !== null){
            return (
                <div className='Edit'>
                    <Header mode={'edit'} className='atama' />
                    <div className='EditStratum'>
                        <div className='targetInfo'>
                            To:{this.props.draft_target.author}::{this.props.draft_target.created}
                        </div>
                        {this.createEditLayer()}
                        {(this.state.mode==='edit')?
                        <div className='addButtons'>
                        <FormControlLabel
                            control={<Fab style={{backgroundColor:'black'}} size='small'>
                            <AddIcon style={{color:'white'}} onClick={this.addPlainBox} />
                            </Fab>}
                            label="Plain layer"
                            labelPlacement="bottom"
                            />
                        <FormControlLabel
                            control={<Fab style={{backgroundColor:'#f9f0e1'}} size='small'>
                            <AddIcon style={{color:'black'}} onClick={this.addTexBox} />
                            </Fab>}
                            label="Math layer"
                            labelPlacement="bottom"
                            />
                        </div>
                        :''}
                        <div className='exLayer'></div>
                    </div>
                    <div className='ModeButtons'>
                        <FormControl component="fieldset">
                            <ToggleButtonGroup size="small" value={this.state.mode} exclusive onChange={this.changeMode}>
                                <ToggleButton value="edit">
                                    <EditIcon />
                                </ToggleButton>
                                <ToggleButton value="view">
                                    <VisibilityIcon />
                                </ToggleButton>
                            </ToggleButtonGroup>
                            <Button variant="contained" color="primary" onClick={this.Post}>
                                POST
                            </Button>
                            <Button variant="contained" color="secondary" onClick={this.Cancel}>
                                CANCEL
                            </Button>
                        </FormControl>
                    </div>
                </div>
            )
        }
        return (
            <div className='Edit'>
                <Header mode={'edit'} className='atama' />
                <div className='EditStratum'>
                    {this.createEditLayer()}
                    {(this.state.mode==='edit')?
                        <div className='addButtons'>
                        <FormControlLabel
                            control={<Fab style={{backgroundColor:'black'}} size='small'>
                            <AddIcon style={{color:'white'}} onClick={this.addPlainBox} />
                            </Fab>}
                            label="Plain layer"
                            labelPlacement="bottom"
                            />
                        <FormControlLabel
                            control={<Fab style={{backgroundColor:'#f9f0e1'}} size='small'>
                            <AddIcon style={{color:'black'}} onClick={this.addTexBox} />
                            </Fab>}
                            label="Math layer"
                            labelPlacement="bottom"
                            />
                        </div>
                        :''}
                    <div className='exLayer'></div>
                </div>
                <div className='ModeButtons'>
                    <FormControl component="fieldset">
                        <ToggleButtonGroup size="small" value={this.state.mode} exclusive onChange={this.changeMode}>
                            <ToggleButton value="edit">
                                <EditIcon />
                            </ToggleButton>
                            <ToggleButton value="view">
                                <VisibilityIcon />
                            </ToggleButton>
                        </ToggleButtonGroup>
                        <Button variant="contained" color="primary" onClick={this.Post}>
                            POST
                        </Button>
                        <Button variant="contained" color="secondary" onClick={this.Cancel}>
                            CANCEL
                        </Button>
                    </FormControl>
                </div>
            </div>
        )
    }
}

Edit = withRouter(connect(mappingState)(Edit))

export default Edit