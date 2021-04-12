import React, { PureComponent } from 'react';

class ResponseCheck extends PureComponent{
    state = {
        state: 'waiting',
        message: '클릭해서 시작하세요.',
        result: [],
    };

    timeout;
    startTime;
    endTime;

    onClickScreen = () => {
        const { state, message, result} = this.state;
        if (state === 'waiting'){
            this.setState({
                state: 'ready',
                message: '초록색이 되면 클릭하세요.',
            });
            this.timeout = setTimeout(() => {
                this.setState({
                    state: 'now',
                    message: '지금 클릭',
                // 2 ~ 3초 (랜덤 시간(초)로 바뀐다.)
                });
                this.startTime = new Date();
            }, Math.floor(Math.random()*1000)+2000);
        // 빨간색 (클릭시 성급하게 클릭)
        } else if (state === 'ready') {
            // 기존에 실행한 setTimeout을 제거하고, 
            // state를 'waiting'으로 바꾸기 (한 번 더 기회)
            clearTimeout(this.timeout);
            this.setState({
                state: 'waiting',
                message: '너무 성급하시군요! 초록색이 된 후에 클릭하세요.',
            });
        // 반응속도 체크 구간 (하늘색)
        } else if (state === 'now') {
            this.endTime = new Date();
            this.setState((prevState) => {
                return {
                    state: 'waiting',
                    result: [],
                    message: '클릭해서 시작하세요!',
                    result: [...prevState.result, this.endTime - this.startTime],
                }
            })
        }
    };

    onReset = () => {
        this.setState({
            result: [],
        });
    }

    renderAverage = () => {
        const { result } = this.state;
        return result.length === 0 
        ? null 
        : <>
            <div>평균시간 : {result.reduce((a, c) => a + c) / result.length}ms</div>
            <button onClick={this.onReset}>리셋</button>
          </>
    }

    render(){
        const { state, message } = this.state;
        return (
            <>
                <div
                    id="screen"
                    className={state}
                    onClick={this.onClickScreen}>
                    {message}
                </div>
                {this.renderAverage()}  
            </>
        )
    }
}

export default ResponseCheck;