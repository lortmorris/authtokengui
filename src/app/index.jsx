import React from 'react';
import {render} from 'react-dom';
import {Application} from './reducers/';
import {KeyCompoment} from './components/';

const myKeyComponent = new KeyCompoment(Application.Keys);


class App extends React.Component {
    render() {
        return (

            <div>

            </div>
        );
    }
}


const appRender = ()=>render(<App />,
    document.getElementById('app')
);


Application.subscribe(appRender);

appRender();

