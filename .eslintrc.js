module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    'react/jsx-no-undef': 'off',  // 关闭未定义组件的检查
    'no-undef': 'off'  // 关闭未定义变量的检查
  }
}; 