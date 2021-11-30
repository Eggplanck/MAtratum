import React from 'react';
import Header from './Header';

class Nomatch extends React.Component {
    render(){
        return (
            <div>
                <Header mode='no' />
                Not found.
            </div>
        )
    }
}

export default Nomatch