import React from 'react';
import {connect} from 'react-redux';
import './Footer.css'
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import { createMuiTheme,ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#620f2f',
        contrastText: "#fff"
        },
      secondary: {
        main: '#E5CEAF'
      }
    },
})

function mappingState(state) {
    return state
}


class Footer extends React.Component {
    constructor(props){
        super(props)
        this.changeView = this.changeView.bind(this)
    }
    changeView(event,value){
        this.props.dispatch(
            {
                type: 'changePageMode',
                mode: value,
            }
        )
    }
    render(){
        return (
            <div className='Footer'>
            <ThemeProvider theme={theme}>
                <BottomNavigation
                value={this.props.page_mode}
                onChange={this.changeView}
                showLabels
                className='Navi'
                >
                    <BottomNavigationAction label="TimeLine" value='timeline' icon={<HomeIcon />} />
                    <BottomNavigationAction label="Search" value='search' icon={<SearchIcon />} />
                    <BottomNavigationAction label="MyPage" value='mypage' icon={<PermIdentityIcon />} />
                </BottomNavigation>
            </ThemeProvider>
            </div>
        )
    }
}

Footer = connect(mappingState)(Footer)

export default Footer