import './template/define.css';
import './template/main.css';
import {
    DOM, flex, flexChild, JX, binds,
} from 'fmihel-lib';
import React from 'react';
import ReactDOM from 'react-dom';
import Splitter from './source/splitter.jsx';

class App extends React.Component {
    constructor(p) {
        super(p);
        binds(this, 'onClickLeft');
        this.state = {
            debug: [
                { time: 1 },
            ],
        };
    }

    onClickLeft() {
        this.setState((state) => state);
    }

    debugParam(state, name) {
        return state.debug.find((o) => {
            const f = Object.keys(o);
            return (f[0] === name);
        });
    }

    componentDidMount() {
        this.t = setInterval(() => {
            this.setState((state) => {
                const o = this.debugParam(state, 'time');
                o.time += 1;
                return state;
            });
        }, 1000);
    }

    componentWillUnmount() {

    }

    render() {
        return (
            <div id ='app' style={{ ...flexChild(), ...flex() }}>
                <Splitter>
                    <div id='left' onClick = {this.onClickLeft}className='box' style={{ ...flexChild() }}>Left</div>
                    <div id='right' className='box' style={{ ...flexChild() }}></div>
                </Splitter>
            </div>
        );
    }
}


$(() => {
    ReactDOM.render(<App/>, DOM('#page'));
});
