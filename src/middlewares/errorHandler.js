const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let msg = err.message;

    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        msg = 'Resource not found';
        statusCode = 404;
    }

    if (err.name === 'ValidationError') {
        msg = Object.values(err.errors)
            .map((i) => i.message)
            .join(',');
    }

    res.status(statusCode).json({
        message: msg,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export { notFound, errorHandler };
