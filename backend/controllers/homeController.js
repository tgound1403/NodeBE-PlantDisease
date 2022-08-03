const path = require("path");
const { mainModule } = require("process");
let getHome = (req, res) => {
  return res.sendFile(path.join(`${__dirname}/../views/master.html`));
};

module.exports = getHome;
