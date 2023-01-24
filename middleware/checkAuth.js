

const checkAuth = (req,res,next) => {

    console.log('Desde checkauth.js');

    next();
}

export default checkAuth;