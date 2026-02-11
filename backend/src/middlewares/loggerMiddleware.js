const logger = (req, res, next) => {
  console.log('Request URL:', req.url);
  next();
}

export default logger;