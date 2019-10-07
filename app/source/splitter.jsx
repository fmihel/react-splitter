import './splitter.css';
import React from 'react';
import {
    JX, flex, flexChild, binds,
} from 'fmihel-lib';
import ut from 'fmihel-lib/source/ut';


class Splitter extends React.Component {
    constructor(p) {
        super(p);
        this.state = {

            state: 'up',
            down: { x: 0, y: 0 }, // где кликнули в первый раз
            current: { x: 0, y: 0 }, // текущее положение
            move: { x: 0, y: 0 }, // на сколько переместили
            position: this.props.position, // текущая позиция

        };
        binds(this, 'winMouseMove', 'winMouseUp', 'MouseDown');
        this.ref = {
            left: React.createRef(),
            right: React.createRef(),
        };
    }

    winMouseMove() {
        if (this.stateMouse === 'down') {
            this.setState((state, props) => {
                const current = JX.mouse();
                const sign = (props.stretchPanel !== 0 ? 1 : -1);
                const move = { x: current.x - state.current.x, y: current.y - state.current.y };

                let position = state.position + sign * (props.direct === 'vert' ? move.y : move.x);
                if (
                    (ut.get(props, 'min', 0) >= position)
                    || ((props.max !== undefined) && (props.max > 0) && (props.max < position))
                ) {
                    position = state.position;
                    this.setMouseState('up');
                } else if (this.props.onSplit) {
                    props.onSplit({
                        current, move, down: state.down, position,
                    });
                }
                return { current, move, position };
            });
        }
    }

    // eslint-disable-next-line no-underscore-dangle
    setMouseState(stateMouse) {
        if (stateMouse === 'up') {
            this.stateMouse = 'up';
            JX.window.off('mouseup', this.winMouseUp);
            JX.window.off('mousemove', this.winMouseMove);
        } else if (stateMouse === 'down') {
            this.stateMouse = 'down';
            JX.window.on('mousemove', this.winMouseMove);
            JX.window.on('mouseup', this.winMouseUp);
        } else {
            console.error('stateMouse must eq "up" or "down"');
        }
    }

    winMouseUp() {
        this.setMouseState('up');
    }

    preLoadPosition(state, props) {
        if (state.position === undefined) {
            const ref = this.stretchPanel === 0 ? this.ref.right : this.ref.left;
            const pos = JX.pos(ref.current);
            return { position: props.direct === 'vert' ? pos.h : pos.w };
        }
        return {};
    }

    MouseDown(e) {
        this.setMouseState('down');

        const current = JX.mouse();

        this.setState({
            down: current,
            current,
            move: { x: 0, y: 0 },
            ...this.preLoadPosition(this.state, this.props),
        });
    }

    render() {
        const child = React.Children.toArray(this.props.children);

        let move = {};
        let cursor = {};
        if (this.props.direct === 'vert') {
            if (this.state.position !== undefined) {
                move = {
                    minHeight: this.state.position,
                    height: this.state.position,

                };
            }
            cursor = {
                cursor: 'n-resize',
            };
        } else {
            if (this.state.position !== undefined) {
                move = {
                    minWidth: this.state.position,
                    width: this.state.position,
                };
            }
            cursor = {
                cursor: 'e-resize',
            };
        }
        const moveLeft = this.props.stretchPanel === 0 ? {} : move;
        const moveRight = this.props.stretchPanel !== 0 ? {} : move;

        return (
            <div
                className='splitter-container'
                style={{
                    position: 'relative',
                    ...flexChild(),
                    ...flex(),
                }}>
                <div
                    className='splitter-frame'
                    style={{
                        position: 'absolute',
                        ...flex({ direct: this.props.direct }),
                        ...flexChild(),
                        width: '100%',
                        height: '100%',
                    }}
                >
                    <div
                        className="splitter-panel"
                        ref = {this.ref.left}
                        style={{
                            position: 'relative',
                            ...moveLeft,
                            ...flexChild({ grow: this.props.stretchPanel === 0 ? 1 : 0 }),
                            ...flex(),
                        }}

                    >
                        {child[0]}
                    </div>
                    <div
                        className='splitter'
                        style={{
                            ...cursor,
                            ...flexChild({ grow: 0 }),
                        }}

                        onMouseDown={this.MouseDown}
                    >
                    </div>
                    <div
                        className="splitter-panel"
                        ref = {this.ref.right}
                        style={{
                            position: 'relative',
                            ...moveRight,
                            ...flexChild({ grow: this.props.stretchPanel === 0 ? 0 : 1 }),
                            ...flex(),
                        }}
                    >
                        {child[1]}
                    </div>
                </div>
            </div>
        );
    }
}

Splitter.defaultProps = {
    onSplit: undefined,
    direct: 'horiz',
    stretchPanel: 1,
    //
    // position: 150,
    // min: 0,
    // max: 200,
    // minRight:0
};

export default Splitter;
