// middleware/logger.js
export const requestLogger = (req, res, next) => {
    res.on("finish", () => {
        console.log(`${req.method} ${req.route?.path ?? req.path} ${res.statusCode}`);
    });
    next();
};

export const timeStampLogger = (req,res,next)=>{
    const time = new Date()
    res.on("finish", () => {
        console.log(`${time.getDate()} ${time.getMonth()+1} ${time.getFullYear()}-> ${time.getHours()} ${time.getMinutes()} ${time.getSeconds()} `);
    });
    next();
}