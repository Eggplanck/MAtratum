import React from 'react';
import {Provider} from 'react-redux'
import {createStore} from 'redux'
import './App.css';
import PageControler from './PageControler'
import Cookies from 'js-cookie';

let my_id = -1
let w_login = false

if(Cookies.get('matratum-user-id')!==undefined){
    my_id = Cookies.get('matratum-user-id')
}
if(Cookies.get('matratum-auth-token')!==undefined){
    w_login = true
}

let state_value = {
    logged_in:w_login,
    timeline_init:false,
    mypage_init:false,
    draft_stratum: [
        {
            text: '',
            text_type: 'plain',
        }
    ],
    draft_target: null,
    timeline :[],
    search_result: [],
    my_line: [],
    my_favs: [],
    page_mode: 'timeline',
    last_update_time: 'all',
    my_id: my_id,
    my_name: 'me',
    my_description: '',
    my_avatar: null,
    my_follower_count: 0,
    my_followee_count: 0,
    search_type:'word'
}

function reducer(state=state_value, action) {
    switch (action.type) {
        case 'changePageMode':
            return changePageMode(state,action)
        case 'textChange':
            return textChange(state,action)
        case 'layerClear':
            return layerClear(state,action)
        case 'addLayer':
            return addLayer(state,action)
        case 'toEdit':
            return toEdit(state,action)
        case 'Login':
            return Login(state,action)
        case 'UpdateTimeline':
            return UpdateTimeline(state,action)
        case 'Searched':
            return Searched(state,action)
        case 'loadMyPage':
            return loadMyPage(state,action)
        case 'editCancel':
            return editCancel(state,action)
        case 'profileUpdate':
            return profileUpdate(state,action)
        case 'Logout':
            return Logout(state,action)
        case 'Reset':
            return Reset(state,action)
        case 'changeSearchType':
            return changeSearchType(state,action)
        case 'favInLine':
            return favInLine(state,action)
        case 'shareInLine':
            return shareInLine(state,action)
        case 'MoreTimeLine':
            return MoreTimeLine(state,action)
        case 'MoreSearched':
            return MoreSearched(state,action)
        case 'MyLineMore':
            return MyLineMore(state,action)
        case 'MyFavsMore':
            return MyFavsMore(state,action)
        case 'DeleteMine':
            return DeleteMine(state,action)
        default:
            return state
    }
}

function Login(state,action){
    let new_state = Object.assign({},JSON.parse(JSON.stringify(state)))
    new_state.logged_in = true
    new_state.my_id = action.user_id
    return new_state
}

function Logout(state,action){
    my_id = -1
    w_login = false
    let new_state = {
        logged_in:false,
        timeline_init:false,
        mypage_init:false,
        draft_stratum: [
            {
                text: '',
                text_type: 'plain',
            }
        ],
        draft_target: null,
        timeline :[],
        search_result: [],
        my_line: [],
        my_favs: [],
        page_mode: 'timeline',
        last_update_time: 'all',
        my_id: -1,
        my_name: 'me',
        my_description: '',
        my_avatar: null,
        my_follower_count: 0,
        my_followee_count: 0,
        search_type:'word'
    }
    return new_state
}

function Reset(state,action){
    let new_state = Object.assign({},JSON.parse(JSON.stringify(state)))
    new_state.timeline_init = false
    new_state.mypage_init = false
    new_state.last_update_time = 'all'
    return new_state
}

function changeSearchType(state,action){
    let new_state = Object.assign({},JSON.parse(JSON.stringify(state)))
    new_state.search_type = action.search_type
    new_state.search_result = []
    return new_state
}

function UpdateTimeline(state,action){
    let new_state = Object.assign({},JSON.parse(JSON.stringify(state)))
    new_state.timeline = action.line.concat(new_state.timeline)
    new_state.last_update_time = action.UpdateTime
    new_state.timeline_init = true
    return new_state
}

function MoreTimeLine(state,action){
    let new_state = Object.assign({},JSON.parse(JSON.stringify(state)))
    new_state.timeline = new_state.timeline.concat(action.line)
    return new_state
}

function Searched(state,action){
    let new_state = Object.assign({},JSON.parse(JSON.stringify(state)))
    new_state.search_result = action.result
    return new_state
}

function MoreSearched(state,action){
    let new_state = Object.assign({},JSON.parse(JSON.stringify(state)))
    new_state.search_result = new_state.search_result.concat(action.result)
    return new_state
}

function loadMyPage(state,action){
    let new_state = Object.assign({},JSON.parse(JSON.stringify(state)))
    new_state.my_id = action.data.user_info.user_id
    new_state.my_name = action.data.user_info.name
    new_state.my_description = action.data.user_info.description
    new_state.my_follower_count = action.data.user_info.follower_count
    new_state.my_followee_count = action.data.user_info.followee_count
    new_state.my_avatar = action.data.user_info.avatar
    new_state.my_line = action.data.my_line
    new_state.my_favs = action.data.favorite_line
    new_state.mypage_init = true
    return new_state
}

function MyLineMore(state,action){
    let new_state = Object.assign({},JSON.parse(JSON.stringify(state)))
    new_state.my_line = new_state.my_line.concat(action.line)
    return new_state
}

function MyFavsMore(state,action){
    let new_state = Object.assign({},JSON.parse(JSON.stringify(state)))
    new_state.my_favs = new_state.my_favs.concat(action.line)
    return new_state
}

function profileUpdate(state,action){
    let new_state = Object.assign({},JSON.parse(JSON.stringify(state)))
    new_state.my_description = action.description
    new_state.my_name = action.display_name
    new_state.my_avatar = action.avatar
    new_state.timeline_init = false
    new_state.last_update_time = 'all'
    new_state.mypage_init = false
    return new_state
}

function changePageMode(state,action){
    let new_state = Object.assign({},JSON.parse(JSON.stringify(state)))
    new_state.page_mode = action.mode
    return new_state
}

function editCancel(state,action){
    let new_state = Object.assign({},JSON.parse(JSON.stringify(state)))
    new_state.draft_target = null
    new_state.draft_stratum = [
        {
            text: '',
            text_type: 'plain',
        }
    ]
    new_state.mypage_init = false
    return new_state
}

function textChange(state,action){
    let new_state = Object.assign({},JSON.parse(JSON.stringify(state)))
    new_state.draft_stratum[action.index].text = action.text
    return new_state
}

function addLayer(state,action){
    let new_state = Object.assign({},JSON.parse(JSON.stringify(state)))
    new_state.draft_stratum.push({
        text: '',
        text_type: action.text_type
    })
    return new_state
}

function layerClear(state,action){
    if(state.draft_stratum.length === 1){
        return state
    }
    let new_state = Object.assign({},JSON.parse(JSON.stringify(state)))
    new_state.draft_stratum = []
    for(let i=0;i<state.draft_stratum.length;i++){
        if(i !== action.index){
            new_state.draft_stratum.push(state.draft_stratum[i])
        }
    }
    return new_state
}

function toEdit(state,action){
    let new_state = Object.assign({},JSON.parse(JSON.stringify(state)))
    new_state.draft_target = action.target
    return new_state
}

function favInLine(state,action){
    let new_state = Object.assign({},JSON.parse(JSON.stringify(state)))
    for(let sss of new_state.timeline){
        if(sss.id === action.id){
            sss.favorite = !sss.favorite
            if(!sss.favorite){
                sss.favorite_count = sss.favorite_count - 1
            }else{
                sss.favorite_count = sss.favorite_count + 1
            }
        }
    }
    for(let sss of new_state.my_line){
        if(sss.id === action.id){
            sss.favorite = !sss.favorite
            if(!sss.favorite){
                sss.favorite_count = sss.favorite_count - 1
            }else{
                sss.favorite_count = sss.favorite_count + 1
            }
        }
    }
    for(let sss of new_state.my_favs){
        if(sss.id === action.id){
            sss.favorite = !sss.favorite
            if(!sss.favorite){
                sss.favorite_count = sss.favorite_count - 1
            }else{
                sss.favorite_count = sss.favorite_count + 1
            }
        }
    }
    if(new_state.search_type === 'word'){
        for(let sss of new_state.search_result){
            if(sss.id === action.id){
                sss.favorite = !sss.favorite
                if(!sss.favorite){
                    sss.favorite_count = sss.favorite_count - 1
                }else{
                    sss.favorite_count = sss.favorite_count + 1
                }
            }
        }
    }
    new_state.mypage_init = false
    return new_state
}

function shareInLine(state,action){
    let new_state = Object.assign({},JSON.parse(JSON.stringify(state)))
    for(let sss of new_state.timeline){
        if(sss.id === action.id){
            sss.share = !sss.share
            if(!sss.share){
                sss.share_count = sss.share_count - 1
            }else{
                sss.share_count = sss.share_count + 1
            }
        }
    }
    for(let sss of new_state.my_line){
        if(sss.id === action.id){
            sss.share = !sss.share
            if(!sss.share){
                sss.share_count = sss.share_count - 1
            }else{
                sss.share_count = sss.share_count + 1
            }
        }
    }
    for(let sss of new_state.my_favs){
        if(sss.id === action.id){
            sss.share = !sss.share
            if(!sss.share){
                sss.share_count = sss.share_count - 1
            }else{
                sss.share_count = sss.share_count + 1
            }
        }
    }
    if(new_state.search_type === 'word'){
        for(let sss of new_state.search_result){
            if(sss.id === action.id){
                sss.share = !sss.share
                if(!sss.share){
                    sss.share_count = sss.share_count - 1
                }else{
                    sss.share_count = sss.share_count + 1
                }
            }
        }
    }
    new_state.timeline_init = false
    new_state.mypage_init = false
    return new_state
}

function DeleteMine(state,action){
    let new_state = Object.assign({},JSON.parse(JSON.stringify(state)))
    for(let l=0;l<new_state.timeline.length;l++){
        if(new_state.timeline[l].id === action.id){
            new_state.timeline.splice(l,1)
        }
    }
    for(let l=0;l<new_state.my_line.length;l++){
        if(new_state.my_line[l].id === action.id){
            new_state.my_line.splice(l,1)
        }
    }
    for(let l=0;l<new_state.my_favs.length;l++){
        if(new_state.my_favs[l].id === action.id){
            new_state.my_favs.splice(l,1)
        }
    }
    if(new_state.search_type === 'word'){
        for(let l=0;l<new_state.search_result.length;l++){
            if(new_state.search_result[l].id === action.id){
                new_state.search_result.splice(l,1)
            }
        }
    }
    return new_state
}

let store = createStore(reducer)

function App() {
    return (
        <div className='App'>
            <Provider store={store}>
                <PageControler />
            </Provider>
        </div>
    );
}

export default App;
