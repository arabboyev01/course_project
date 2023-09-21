const allowedOrigins = [
    'https://main.d1s24752uogjcv.amplifyapp.com/',
];

const appConfig = () => ({
    origins: allowedOrigins.join(', ')
})

export { appConfig }