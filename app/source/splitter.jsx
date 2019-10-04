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
        this.refLeft = React.createRef();
    }

    winMouseMove() {
        if (this.stateMouse === 'down') {
            this.setState((state, props) => {
                const current = JX.mouse();
                const move = { x: current.x - state.current.x, y: current.y - state.current.y };

                let position = state.position + (props.direct === 'vert' ? move.y : move.x);
                if (
                    (ut.get(props, 'min', 0) >= position)
                    || ((props.max !== undefined) && (props.max > 0) && (props.max < position))
                ) {
                    position = state.position;
                    this.setMouseState('up');
                } else if (this.props.onSplit) {
                    this.props.onSplit({
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
            const pos = JX.pos(this.refLeft.current);
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
                    height: this.state.position,

                };
            }
            cursor = {
                cursor: 'n-resize',
            };
        } else {
            if (this.state.position !== undefined) {
                move = {
                    width: this.state.position,
                };
            }
            cursor = {
                cursor: 'e-resize',
            };
        }


        return (
            <div
                className='splitter-wrapper'
                style={{
                    ...flex({ direct: this.props.direct }),
                    ...flexChild(),
                }}
            >
                <div
                    ref = {this.refLeft}
                    className="splitter-panel"
                    style={{
                        ...move,
                        ...flexChild({ grow: 0 }),
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
                    style={{
                        ...flexChild({ grow: 1 }),
                        ...flex(),
                    }}
                >
                    {child[1]}
                </div>
            </div>
        );
    }
}

Splitter.defaultProps = {
    onSplit: undefined,
    direct: 'horiz',
    // position: 150,
    min: 0,
    // max: 200,
};

export default Splitter;
