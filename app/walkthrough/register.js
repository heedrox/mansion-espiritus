console.log('registering babel');
require('@babel/register')({
  presets: ['@babel/preset-env'],
  targets: {
    node: '18'
  }
}); 