'use strict';
const production = (app, port) => {
    app.enable("trust proxy");

    app.use((req, res, next) => {
      if (req.secure) {
        next();
      } else {
        res.redirect("https://" + req.headers.host + req.url);
      }
    });

    app.listen(port);
    console.log('app running on port', port)
};

export default production;
