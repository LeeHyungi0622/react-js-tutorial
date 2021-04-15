const path = require('path');
const webpack = require('webpack');
const RefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
    // 웹팩 설정 이름
    name: 'wordrelay-setting',
    mode: 'development', // 실서비스: production
    // 빠르게 처리하기 위한 코드
    devtool: 'eval',

    // 확장자 생략을 위해서 resolve 옵션을 사용
    resolve: {
        extensions: ['.js', '.jsx']
    },
    // 이 부분이 중요
    // 목표 : 작성한 JavaScript파일을 하나로 합쳐서 
    // html에서 스크립트를 실행하기
    entry: {
        app: ['./client']
    }, // 입력(client.jsx, WordRelay.jsx)

    module: {
        // 여러개의 규칙을 적용
        rules: [{
            // 정규표현식으로 js와 jsx파일에 룰을 적용하겠다.
            test: /\.jsx?/,
            // babel을 적용해서 최신 문법의 코드를 구형브라우저에서도 돌아갈 수 있도록 
            // 호환되도록 바꿔주겠다.
            loader: 'babel-loader',
            options: {
                // presets: ['@babel/preset-env', '@babel/preset-react'],
                presets: [
                    ['@babel/preset-env', {
                        targets: {
                            // 한국에서 지원률이 5% 이상인 브라우저와 크롬의 특정 버전을 지정
                            browsers: ['> 1% in KR', 'last 2 chrome versions'],
                        },
                        debug: true,
                    }],
                    '@babel/preset-react',
                ],
                plugins: [
                    '@babel/plugin-proposal-class-properties',
                    'react-refresh/babel'
                ]
            }
        }]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({ debug: true }),
        new RefreshWebpackPlugin()
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'app.js',
        publicPath: '/dist/',
    }, // 출력 (app.js)
    devServer: {
        // output와 동일
        publicPath: '/dist/',
        hot: true
    }
};