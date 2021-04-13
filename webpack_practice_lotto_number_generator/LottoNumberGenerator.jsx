import React, { Component } from 'react';
import Ball from './Ball';

// 로또 당첨숫자 7개 뽑는 함수
// 계산량이 많은 함수이기 때문에 반복 실행되면 안된다.
function getWinNumber(){
    console.log('getWinNumber');
    const candidate = Array(45).fill().map((v, i) => i + 1);
    const shuffle = [];
    while(candidate.length > 0){
        shuffle.push(candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0]);
    }
    const bonusNumber = shuffle[shuffle.length - 1];
    const winNumber = shuffle.splice(0, 6).sort((p, c) => p - c);
    return [...winNumber, bonusNumber];
}

class Lotto extends Component {
    state = {
        // 미리 준비할 데이터를 준비해두고 천천히 하나의 데이터씩 보여주기
        winNumbers: getWinNumber(), 
        // winBalls에 숫자가 당첨숫자가 한 개씩 들어가면 rendering
        winBalls: [],
        bonus: null,
        // 모든 공이 뽑아진 뒤에 한 번 더 뽑을지에 대한 버튼
        redo: false,
    };

    timeouts = [];

    runTimeouts = () => {
        const { winNumbers } = this.state;
        for(let i = 0; i < winNumbers.length - 1; i++) {
        // winNumbers의 숫자를 winBalls에 하나씩 넣어주면, render함수가 실행되면서
        // 화면에 순차적으로 그려주게 된다. 
            this.timeouts[i] = setTimeout(() => {
                this.setState((prevState) => {
                    return {
                        winBalls: [...prevState.winBalls, winNumbers[i]]
                    };
                }); 
            }, (i + 1) * 1000);
        }
        this.timeouts[6] = setTimeout(() => {
            this.setState({
                bonus: winNumbers[6],
                redo: true,
            });
        }, 7000);
    };

    componentDidMount(){
        this.runTimeouts();
    }

    componentDidUpdate(prevProps, prevState){
        console.log('didUpdate');
        // 어떤 것이 바뀌었는지 판단을 할 수 있다.
        if(this.state.winBalls.length === 0){
            this.runTimeouts();
        }
    }


    componentWillUnmount(){
        this.timeouts.forEach((v) => {
            clearTimeout(v);
        });
    }

    onClickRedo = () => {
        // state 초기화
        this.setState({
            winNumbers: getWinNumber(), 
            winBalls: [],
            bonus: null,
            redo: false,
        });
        this.timeouts = [];
    };

    render(){
        const { winBalls, bonus, redo } = this.state;
        return(
            <>
                <div>당첨 숫자</div>
                <div id="resultWindow">
                    { winBalls.map((v) => <Ball key={v} number={v} />) }
                </div>
                <div>보너스!</div>
                { bonus && <Ball number={ bonus } /> }
                { redo && <button onClick={this.onClickRedo}>한 번 더!</button>}    
            </>  
        )
        
    }
}

export default Lotto;