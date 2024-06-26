const errorMiddleware =(err, req, res, next) =>{

  const errstatus = err.status||500;
  const errMsg = err.message || 'Internal server error';
  res.status(errstatus).json({
    success: false,
    status: errstatus,
    message: errMsg,
})
}
module.exports = errorMiddleware;