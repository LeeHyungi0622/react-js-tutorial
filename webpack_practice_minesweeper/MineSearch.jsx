import React, { useReducer, createContext, useMemo } from 'react';
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
    halted: false,
}

// action 이름을 상수로 선언
export const START_GAME = 'START_GAME';
export const OPEN_CELL = 'OPEN_CELL';
export const CLICK_MINE = 'CLICK_MINE';
export const FLAG_CELL = 'FLAG_CELL';
export const QUESTION_CELL = 'QUESTION_CELL';
export const NORMALIZE_CELL = 'NORMALIZE_CELL';

const reducer = (state, action) => {
    switch(action.type){
        case START_GAME:{
            return {
                ...state,
                tableData: plantMine(action.row, action.cell, action.mine),
                halted: false,
            }
        };
        case OPEN_CELL:{
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            tableData[action.row][action.cell] = CODE.OPENED;
            // 주변 지뢰갯수 구하기
            let around = [];
            // 윗 줄이 존재하는 경우
            // 윗줄의 세 줄을 검사항목에 넣어준다.
            if(tableData[action.row - 1]){
                around = around.concat(
                    tableData[action.row - 1][action.cell - 1],
                    tableData[action.row - 1][action.cell],
                    tableData[action.row - 1][action.cell + 1],
                );
            }
            // 현재 셀의 좌우 셀을 검사항목에 추가해준다.
            around = around.concat(
                tableData[action.row][action.cell - 1],
                tableData[action.row][action.cell + 1],
            );
            // 아랫줄이 존재하는 경우
            if(tableData[action.row + 1]){
                around = around.concat(
                    tableData[action.row + 1][action.cell - 1],
                    tableData[action.row + 1][action.cell],
                    tableData[action.row + 1][action.cell + 1],
                );
            }
            // 검사항목들을 돌면서 지뢰가 있는 요소와 일치하는지 검사 
            const count = around.filter((v) => [CODE.MINE, CODE.FLAG_MINE, CODE.FLAG_MINE].includes(v));
            tableData[action.row][action.cell] = count.length;
            return {
                ...state,
                tableData,
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
        default:
            return state;
    }
}

const MineSearch = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const {tableData, halted, timer, result} = state;

    const value = useMemo(() => ({ tableData, halted, dispatch }), [tableData, halted]);
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