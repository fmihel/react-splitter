import './template/define.css';
import './template/main.css';
import {
    DOM, flex, flexChild, binds,
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


    render() {
        return (
            <div id ='app' style={{ ...flexChild(), ...flex() }}>
                <Splitter position={200} stretchPanel={0}>
                    <Splitter stretchPanel={1} position={200}>
                        <div id='left' onClick = {this.onClickLeft}className='box1' >
                        Left qwekjfkwq kqjef kjhfkjwerf
                        werf kwerflk wjlk wlkjrf lkjwlk flwerf
                        werf lwekj flkjwlf jelwf lk jlwkjeflkjwl w frlwjflkwe ljwerf
                        werfk jwlkl wfle jfljwlefj ljl jflwekj flw jelj lj lwejf l
                        </div>

                        <div id='right' className='box1' style={{ }}>
                    Left qwekjfkwq kqjef kjhfkjwerf
                        werf kwerflk wjlk wlkjrf lkjwlk flwerf
                        werf lwekj flkjwlf jelwf lk jlwkjeflkjwl w frlwjflkwe ljwerf
                        werfk jwlkl wfle jfljwlefj ljl jflwekj flw jelj lj lwejf l

                        </div>
                    </Splitter>
                    <div id="more">qwjehdkjqw qw jdkjh kjeh</div>
                </Splitter>
            </div>
        );
    }
}

/*
                        <Splitter direct="vert" position={200} max={400} min={100}>
                            <div id='top'>Top</div>
                            <div id='bottom'>Bottom</div>
                        </Splitter>
*/


$(() => {
    ReactDOM.render(<App/>, DOM('#page'));
});
