module.exports = (func) => {
  return (req, res, next) => {
    //console.log(func);
    func(req, res, next).catch(next);
  };
};
