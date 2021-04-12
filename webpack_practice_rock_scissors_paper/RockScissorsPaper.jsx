import React, { Component } from 'react';

const rspCoords = {
    rock: '0',
    scissors: '-142px',
    paper: '-284px',
};

const scores = {
    rock: 1,
    scissors: 0,
    paper: -1
};

const computerChoice = (imgCoord) => {
    return Object.entries(rspCoords).find(function(v) {
        return v[1] === imgCoord;
    })[0];
}

class RockScissorsPaper extends Component {
    
    state = {
        result: 'rock',
        score:0,
        imgCoord: '0',
    }

    interval;

    componentDidMount(){
        this.interval = setInterval(this.changeHand, 1000);
    }

    componentWillUnmount(){
        clearInterval(this.interval);
    }

    changeHand = () => {
        const { imgCoord } = this.state;
        console.log('hello', this.state.imgCoord, rspCoords);
        if(imgCoord === rspCoords.rock) {
            this.setState({
                imgCoord: rspCoords.scissors,
            });
        } else if(imgCoord === rspCoords.scissors){
            this.setState({
                imgCoord: rspCoords.paper
            });
        } else if(imgCoord === rspCoords.paper){
            this.setState({
                imgCoord: rspCoords.rock
            });
        }
    };

    onClickBtn = (choice) => () => {
        const { imgCoord } = this.state;
        clearInterval(this.interval);
        const myScore = scores[choice];
        const cpuScore = scores[computerChoice(imgCoord)];
        const diff = myScore - cpuScore;
        if(diff === 0){
            this.setState({
                result: '비겼습니다.'
            });
        } else if([-1, 2].includes(diff)){
            this.setState((prevState) => {
                return {
                    result: '이겼습니다.',
                    score: prevState.score + 1,
                };
            });
        } else {
            this.setState((prevState) => {
                return {
                    result: '졌습니다.',
                    score: prevState.score - 1,
                };
            });
        }
        // 2초동안 결과를 확인하고 다시 재시작 
        setTimeout(() => {
            this.interval = setInterval(this.changeHand, 1000);
        }, 2000)
    };

    render(){
        const { result, score, imgCoord } = this.state;
        return (
            <>
                <div id="computer" style={{ background: `url(https://en.pimg.jp/023/182/267/1/23182267.jpg) ${imgCoord} 0` }} />
                <div>
                <button id="rock" className="btn" onClick={this.onClickBtn('rock')}>rock</button>
                <button id="scissor" className="btn" onClick={this.onClickBtn('scissors')}>scissors</button>
                <button id="paper" className="btn" onClick={this.onClickBtn('paper')}>paper</button>
                </div>
                <div>{result}</div>
                <div>현재 {score}점</div>
            </>
        )
    }
}

export default RockScissorsPaper;