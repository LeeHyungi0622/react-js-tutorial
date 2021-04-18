import React, { useReducer, createContext, useMemo, useEffect } from 'react';
import Table from './Table';
import Form from './Form';

export const CODE = {
    MINE: -7,
    NORMAL: -1,
    QUESTION: -2,
    FLAG: -3,
    QUESTION_MINE: -4,
    FLAG_MINE: -5,
    CLICKED_MINE: -6,
    OPENED: 0, // 의도된 값 0 이상이면 모두 opened!
}

// 랜덤으로 지뢰를 심는 메서드
const plantMine = (row, cell, mine) => {
    console.log(row, cell, mine);
    const candidate = Array(row * cell).fill().map((arr, i) => {
        return i;
    });
    const shuffle = [];
    while(candidate.length > row * cell - mine){
        // random으로 20개 뽑기
        const chosen = candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0];
        shuffle.push(chosen);
    }
    const data = [];
    for(let i = 0; i < row; i++){
        const rowData = [];
        data.push(rowData);
        for(let j = 0; j < cell; j++){
            rowData.push(CODE.NORMAL);
        }
    }
    for(let k = 0; k < shuffle.length; k++){
        const ver = Math.floor(shuffle[k] / cell);
        const hor = shuffle[k] % cell;
        data[ver][hor] = CODE.MINE;
    }
    console.log(data);
    return data;
};

// contextAPI 사용을 위한 context 객체
export const TableContext = createContext({
    tableData: [],
    // halted 변수도 context API에 추가
    halted: true,
    dispatch: () => {},
});

// initial state (useReducer에서 초기화)
const initialState = {
    tableData: [],
    data: {
        row: 0,
        cell: 0,
        mine: 0,
    },
    timer: 0,
    result: '',
    // 게임을 중단하기 위한 flag
    halted: true,
    openedCount: 0,
}

// action 이름을 상수로 선언
export const START_GAME = 'START_GAME';
export const OPEN_CELL = 'OPEN_CELL';
export const CLICK_MINE = 'CLICK_MINE';
export const FLAG_CELL = 'FLAG_CELL';
export const QUESTION_CELL = 'QUESTION_CELL';
export const NORMALIZE_CELL = 'NORMALIZE_CELL';
export const INCREMENT_TIMER = 'INCREMENT_TIMER';

const reducer = (state, action) => {
    switch(action.type){
        case START_GAME:{
            return {
                ...state,
                data: {
                    row: action.row, 
                    cell: action.cell, 
                    mine: action.mine,
                },
                openedCount: 0,
                tableData: plantMine(action.row, action.cell, action.mine),
                halted: false,
                timer: 0,
            }
        };
        case OPEN_CELL:{
            const tableData = [...state.tableData];
            // tableData[action.row] = [...state.tableData[action.row]];
            // tableData[action.row][action.cell] = CODE.OPENED;
            // 주변에 모든 빈칸을 검사해서 빈 칸인지 아닌지 검사를 해야되기 때문에 아래와 같이 검사를 한다.
            // 따라서 모든 칸을 새로운 객체로 만들어준다.
            tableData.forEach((row, i) => {
                tableData[i] = [...row];
            });
            //  한 번 열었던 칸은 다시 열어보지 않도록 처리 (dynamic programming과 유사)
            const checked = [];
            let openedCount = 0;
            const checkAround = (row, cell) => {
                if([CODE.OPENED, CODE.FLAG_MINE, CODE.FLAG, CODE.QUESTION_MINE, CODE.QUESTION].includes(tableData[row][cell])){
                    // 이미 열린 칸이나 지뢰가 있는 칸은 한번에 열면 안되기 때문에 막아준다.
                    return;
                }
                // 상하좌우 칸이 아닌 경우를 필터링
                if(row < 0 || row >= tableData.length || cell < 0 || cell >= tableData[0].length){
                    return;
                }
                // 이미 검사한 칸인 경우
                if(checked.includes(row + '/' + cell)){
                    return;
                } else {
                    // 검사하지 않은 셀의 경우 checked 배열에 row/cell 형태로 push를 해준다.
                    checked.push(row + '/' + cell);
                }
                // 셀이 하나씩 열릴때마다 1씩 count값 올려주기
                // 클릭한 셀이 닫힌 칸인 경우
                if(tableData[row][cell] === CODE.NORMAL){
                    openedCount += 1;
                }
                // 주변 지뢰갯수 구하기
                let around = [];
                // 윗 줄이 존재하는 경우
                // 윗줄의 세 줄을 검사항목에 넣어준다.
                if(tableData[row - 1]){
                    around = around.concat(
                        tableData[row - 1][cell - 1],
                        tableData[row - 1][cell],
                        tableData[row - 1][cell + 1],
                    );
                }
                // 현재 셀의 좌우 셀을 검사항목에 추가해준다.
                around = around.concat(
                    tableData[row][cell - 1],
                    tableData[row][cell + 1],
                );
                // 아랫줄이 존재하는 경우
                if(tableData[row + 1]){
                    around = around.concat(
                        tableData[row + 1][cell - 1],
                        tableData[row + 1][cell],
                        tableData[row + 1][cell + 1],
                    );
                }
                // 검사항목들을 돌면서 지뢰가 있는 요소와 일치하는지 검사 
                const count = around.filter((v) => [CODE.MINE, CODE.FLAG_MINE, CODE.FLAG_MINE].includes(v)).length;
                tableData[row][action.cell] = count;

                // 주변에 지뢰의 갯수가 하나도 없는 경우에 주변 셀을 열어준다. 
                // 옆 셀이 빈칸인 경우 옆 셀을 열어주고, 또 그 옆 셀이 비어있는 경우 해당 셀의 옆 셀도 같이 열어준다.
                // 재귀적으로 처리 
                if(count === 0){
                    if(row > -1){
                        const near = [];
                        // 제일 위칸을 클릭한 경우에 
                        // 더이상 더 위칸이 없는 경우에 해당 셀을 없애준다.
                        if(row - 1 > -1){
                            near.push([row - 1, cell - 1]);
                            near.push([row - 1, cell]);
                            near.push([row - 1, cell + 1]);
                        }
                        near.push([row, cell - 1]);
                        near.push([row, cell + 1]);
                        // 제일 아랫칸을 클릭한 경우에
                        // 더 이상의 아랫 칸은 없기 때문에 아래의 셀들을 없애준다.
                        if(row + 1 < tableData.length){
                            near.push([row + 1, cell - 1]);
                            near.push([row + 1, cell]);
                            near.push([row + 1, cell + 1]);
                        }
                        near.forEach((n) => {
                            // 주변 칸들이 이미 열려있는 칸이 아니라면
                            if(tableData[n[0]][n[1]] !== CODE.OPENED){
                                checkAround(n[0], n[1]);
                            }
                        });
                    }
                } 
                

            };

            // 주변 셀 검사 함수를 이용해서 주변 셀 검사하기
            checkAround(action.row, action.cell);
            // 승리조건 체크하기
            // 지뢰가 없는 칸 만큼 셀을 열었다면 승리
            let halted = false;
            let result = '';
            // 가로 * 세로 - 지뢰갯수 === 열은 셀의 갯수가 같으면 승리!
            if(state.data.row * state.data.cell - state.data.mine === state.openedCount + openedCount){
                halted = true;
                // 승리했다고 메시지 띄워주기
                result = `${state.timer}초만에 승리하셨습니다`;
            }
            return {
                ...state,
                tableData,
                openedCount: state.openedCount + openedCount,
                halted,
                result,
            };
        }
        case CLICK_MINE:{
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            tableData[action.row][action.cell] = CODE.CLICKED_MINE;
            return {
                ...state,
                tableData,
                halted: true,
            };
        }
        // 깃발을 꼿는 경우
        case FLAG_CELL:{
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            // 깃발을 처리하는 조건문 처리 (지뢰가 있는 곳에 깃발을 꼿거나 지뢰가 없는 곳에 깃발을 꼿는 경우)
            // 겉보기에는 똑같이 보인다.
            if(tableData[action.row][action.cell] === CODE.MINE){
                tableData[action.row][action.cell] = CODE.FLAG_MINE;
            } else {
                tableData[action.row][action.cell] = CODE.FLAG;
            }
            return {
                ...state,
                tableData,
            };
        }
        case QUESTION_CELL:{
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            if(tableData[action.row][action.cell] === CODE.FLAG_MINE){
                tableData[action.row][action.cell] = CODE.QUESTION_MINE;
            } else {
                // 지뢰가 없는 깃발인 경우
                tableData[action.row][action.cell] = CODE.QUESTION;
            }
            return {
                ...state,
                tableData,
            };
        }
        case NORMALIZE_CELL:{
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            if(tableData[action.row][action.cell] === CODE.QUESTION_MINE){
                tableData[action.row][action.cell] = CODE.MINE;
            } else {
                tableData[action.row][action.cell] = CODE.NORMAL;
            }
            return {
                ...state,
                tableData,
            };
        }
        case INCREMENT_TIMER:{
            return {
                ...state,
                timer: state.timer + 1,
            }
        }
        default:
            return state;
    }
}

const MineSearch = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const {tableData, halted, timer, result} = state;

    const value = useMemo(() => ({ tableData, halted, dispatch }), [tableData, halted]);
    

    useEffect(() => {
        let timer;
        // 중단이 풀렸을때 (게임이 시작될때)
        if(halted === false){
            timer = setInterval(() => {
                dispatch({ type: INCREMENT_TIMER });
            }, 1000);
        }
        return () => {
            clearInterval(timer);
        }
    },[halted]);
    
    return(
        <TableContext.Provider value={ value }>
            <Form dispatch={dispatch}/>
            <div>{timer}</div>
            <Table />
            <div>{result}</div>
        </TableContext.Provider>
    )
};

export default MineSearch;