var etherscan = require("etherscan");
var models = require("../models/index");
var api = new etherscan("9WBCURM4FXFYXF633BAX87J18ZUJHK7WWJ");

function processTransactions(transactions, address) {
  return new Promise(function(resolve, reject) {
    models.Company.all().then(function(companies) {
      models.Review.all().then(function(reviews) {
        // sorting companies
        var _companies = [];
        var _companyAddresses = [];
        for (var c in companies) {
          var companyAddress = companies[c].address.toLowerCase();
          _companies[companyAddress] = {
            name: companies[c].name,
            category: companies[c].category
          };
          _companyAddresses.push(companyAddress);
        }

        // sorting reviews
        var _reviews = [];
        for (var r in reviews) {
          var reviewAddress = reviews[r].address;
          _reviews[reviewAddress] = {
            review: reviews[r].review,
            verified: reviews[r].verified
          };
        }
        console.log(_reviews);

        var _transactions = {
          in: [],
          out: []
        };

        // giving
        for (var i in transactions) {
          // transaction is to verified selected smart contract (out)
          if (transactions[i].from == address) {
            var _cTransaction = transactions[i];
            if (_companyAddresses.indexOf(transactions[i].to) >= 0) {
              _cTransaction["category"] =
                _companies[transactions[i].to].category;
              _cTransaction["name"] = _companies[transactions[i].to].name;
            } else {
              _cTransaction["category"] = null;
              _cTransaction["name"] = null;
            }
            _transactions["out"].push(_cTransaction);
          }

          // receiving
          if (transactions[i].to == address) {
            var _cTransaction = transactions[i];
            if (_reviews[transactions[i].hash] != undefined) {
              _cTransaction["review"] = _reviews[transactions[i].hash].review;
              _cTransaction["verified"] =
                _reviews[transactions[i].hash].verified;
            } else {
              _cTransaction["review"] = null;
              _cTransaction["verified"] = false;
            }
            _transactions["in"].push(transactions[i]);
          }
        }
        resolve(_transactions);
      });
    });
  });
}

module.exports = {
  getTransaction: function(req, res) {
    if (!req.body.address) {
      res.status(500).send({
        error: 500,
        message: "No address provided"
      });
    }
    var tx = api.getTxList({
      address: req.body.address,
      sort: "desc"
    });

    tx.then(function(transactions) {
      processTransactions(transactions, req.body.address).then(function(
        result
      ) {
        res.send(result);
      });
      // res.send(transactions);
    }).catch(function(errors) {
      console.log(errors);
      res.status(500).send({
        status: 500,
        message: errors
      });
    });
  },
  addReviews: function(req, res) {
    models.Review.create({
      address: req.body.address,
      review: req.body.remarks,
      verified: false
    }).then(function(result) {
      res.send({
        success: true
      });
    });
  }
};

exports.gd;
