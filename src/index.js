import '@babel/polyfill';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import env from './config/envConfig';
import routes from './routes/v1';

const isProduction = env.NODE_ENV === 'production';

// Create global app object
const app = express();

app.use(cors());
app.use(cookieParser());

// Normal express config defaults
app.use(morgan('dev'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// connect app to routes
app.use('/api', routes);

// / catch 404 and forward to error handler
app.use((req, res, next) => {
  // const err = new Error('Endpoint Not Found');
  // err.status = 404;
  // next(err);
  res.status(404).json({
    errors: {
      message: 'Endpoint Not Found',
      error: { status: 404 }
    }
  });
  next();
});

// / error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    // eslint-disable-next-line no-console
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

// production error handler
// no stacktraces leaked to user
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

// finally, let's start our server...
const server = app.listen(env.PORT || 3000, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${server.address().port}`);
});


export default app;
