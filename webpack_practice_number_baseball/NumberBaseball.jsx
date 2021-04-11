import React, {Component} from 'react';
import Try from './Try';

// 숫자 네 개를 겹치지 않게 생성한다.
function getNumbers(){
    const candidate = [1,2,3,4,5,6,7,8,9];
    const array = [];
    for(let i = 0; i < 4; i += 1){
        const chosen = candidate.splice(Math.floor(Math.random() * (9-1)), 1)[0];
        array.push(chosen);
    }
    return array;
}

class NumberBaseball extends Component {
    state = {
        result: '',
        value: '',
        answer: getNumbers(),
        tries: []
    };
    onSubmitForm = (e) => {
        const { result, value, tries, answer } = this.state;
        e.preventDefault();
        if(value === answer.join('')){
            this.setState({
                result: '홈런!',
                tries: [...tries, { try: value, result: '홈런!'}],
            });
            alert('게임을 다시 시작합니다!');
                this.setState({
                    value: '',
                    answer: getNumbers(),
                    tries:[],
            });
        } else {
            const answerArray = value.split('').map((v) => parseInt(v));
            let strike = 0;
            let ball = 0;
            if(tries.length >= 9){ // 10번이상 틀린 경우
                this.setState({
                    result: `10번 넘게 틀려서 실패! 답은 ${answer.join(',')}였습니다.`
                });
                alert('게임을 다시 시작합니다!');
                this.setState({
                    value: '',
                    answer: getNumbers(),
                    tries:[],
                });
            } else {
                for(let i = 0; i < 4; i += 1){
                    if(answerArray[i] === answer[i]){
                        strike += 1;
                    } else if(answer.includes(answerArray[i])){
                        ball += 1;
                    }
                }
                this.setState({
                    tries: [...tries, { try: value, result: `${strike} 스트라이크, ${ball} 볼입니다`}],
                    value: '',
                })
            }
        }
    };

    onChangeInput = (e) => {
        console.log(this.state.answer);
        this.setState({
            value: e.target.value
        });
    };

    render(){
        const {result, value, tries} = this.state;
        return(
            <>
                <h1>{result}</h1>
                <form onSubmit={this.onSubmitForm}>
                    <input maxLength={4} value={value} onChange={this.onChangeInput}/>
                </form>
                <div>시도: { tries.length }</div>
                <ul>
                    {tries.map((v, i) => <Try key={`${i + 1}차 시도 :`} tryInfo={v}/>)}
                </ul>
            </>
        )
    };
}

export default NumberBaseball;