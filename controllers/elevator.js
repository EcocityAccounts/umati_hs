const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { promisify } = require('util');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const _ = require('lodash');
const validator = require('validator');
const mailChecker = require('mailchecker');
const Elevator = require('../models/Elevator');
const User = require('../models/User');


const randomBytesAsync = promisify(crypto.randomBytes);


/* exports.getElevatorapi = function(req, res){
        for (var i=0; i<elev_data.length; i++){
            myChannel.push( elev_data[i].eleventrytitle );
        }
        res.send( myChannel.join("\n") );
};*/



/*
   $match: {
      name: { $in: [ "USA", "China" ] }
   }
*/



exports.getElevatorapi = function (req, res, next) {
  //  var mySort = ['group', 'Taxes with mom'];
  //  var sortVar = User.profile.group
    Elevator.find()
        .sort([['elevdate', 'ascending']])
	//.find({}, null, {sort: {group: "Ward Food Logistics"}})
	.where('group').equals('Ward Food Logistics') // find each Person with a last name matching 'Ghost'
        //.sort([['group', 'Ward Logistics Group']])
	//.sort(mySort)
        .exec(function (err, elev_data) {
            if (err) { return next(err); }
            res.json(elev_data);
        })
};


// Display calendar data
exports.getElevator = function (req, res, next) {
    Elevator.find()
        .sort([['elevdate', 'ascending']])
        .exec(function (err, elev_data) {
            if (err) { return next(err); }
            // Successful, so rendecalsr.
            res.render('account/elevator', { title: 'Personalized Podcast', elevdata: elev_data });
        })
};

// Display calendar data
exports.getElevator3 = function (req, res, next) {
    Elevator.find()
        .sort([['elevdate', 'ascending']])
        .exec(function (err, elev_data) {
            if (err) { return next(err); }
            // Successful, so rendecalsr.
            res.render('account/elevator3', { title: 'Podcast Manager', elevdata: elev_data });
        })
};

// css grid calendar - display calendar data
exports.getElevator4 = function (req, res, next) {
    Elevator.find()
        .sort([['elevdate', 'ascending']])
        .exec(function (err, elev_data) {
            if (err) { return next(err); }
            // Successful, so rendecalsr.
            res.render('account/elevator4', { title: 'Elevator4', elevdata: elev_data });
        })
};

// css grid podcast display - display tabular as calendar data
exports.getElevator5 = function (req, res, next) {
    Elevator.find()
        .sort([['elevdate', 'ascending']])
        .exec(function (err, elev_data) {
            if (err) { return next(err); }
            // Successful, so rendecalsr.
            res.render('account/elevator5', { title: 'Elevator5', elevdata: elev_data });
        })
};

// Load Edit Form
exports.getUpdateResourceElevatorEntry = function (req, res, next) {
  Elevator.findById(req.params.elevitem_id, function(err, elev){
    /*if(elev.group != user.profile.group){
      req.flash('danger', 'Not Authorized');
      return res.redirect('/');
    }*/
    if (err) { return next(err); }
    return res.render('account/elevatorresourceentryupdate', {
      title:'Edit Elevator Item',
      elevdata:elev
    });
  });
};

// Load Edit Form
exports.getUpdateElevatorEntry = function (req, res, next) {
  Elevator.findById(req.params.elevitem_id, function(err, elev){
    /*if(elev.group != user.profile.group){
      req.flash('danger', 'Not Authorized');
      return res.redirect('/');
    }*/
    if (err) { return next(err); }
    return res.render('account/elevatorentryupdate', {
      title:'Edit Elevator Item',
      elevdata:elev
    });
  });
};

var getCats = function(elevcat, elev) {
    Elevator.aggregate([
        { $match: {
            elevcat: elevcat
        }},
        { $unwind: "$records" },
        { $group: {
            elevcat: "$elevcat",
            balance: { $sum: "$records.amount"  }
        }}
    ], function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(result);
    });
}

// Remove entry
exports.getElevatorRemove = function (req, res, next) {
    var itemid = req.params.itemid;
    return res.render('account/elevatorremove', {
      title:'Remove elev entry',
      elevdata:itemid
    });
};

// Load Categories
exports.getElevatorCat = function (req, res, next) {
    var itemid = req.params.itemid;
    return res.render('account/elevatorcat', {
      title:'Podcast categories',
      elevdata:itemid
    });
};


// Post via ajax
exports.getElevatorentryupdate = function (req, res) {
    var itemid = req.params.itemid;
    var dayid = req.params.dayid;
    var seqid = req.params.seqid;
	
    var data = {
      seqid: seqid,
      dayid: dayid
    };
    // save the update 
	// findOneAndUpdate() -g june 8 2020
    Elevator.findByIdAndUpdate(itemid, data, function(err, result) {
    //Elevator.findOneAndUpdate(itemid, data, function(err, result) {
    if (err){ 
         res.send(err);
    }
    else{
         res.send(result);
    };

  });
};


 /*
 * POST /cal
 * Sign in using email and password.
 */
exports.postElevator = (req, res, next) => {
  const validationErrors = [];
  if (validator.isEmpty(req.body.post)) validationErrors.push({ msg: 'Elevator content cannot be blank.' });
};

/**
 * GET account/elevatorentrycreate
 * a
 */
exports.getElevatorEntry = (req, res, next) => {
  let parsedQ = req.query.day;
  res.render('account/elevatorentrycreate', {
    title: 'Create elevator entry',
    reque:parsedQ
  });
};

/**
 * GET account/elevatormanage
 * a
 */
exports.getElevatormanage = (req, res) => {
  res.render('account/elevatormanage', {
    title: 'Manage podcast entries'
  });
};


/**
 * POST /account/elevator
 * Create a new calendar entry.
 */
exports.postCreateElevatorEntry = (req, res, next) => {
  const validationErrors = [];
//  if (!validator.isAscii(req.body.eleventrytitle)) validationErrors.push({ msg: 'Please enter a title for your new podast entry.' });
//  if (!validator.isAscii(req.body.post)) validationErrors.push({ msg: 'Please add some content to your podcast entry.' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/elevatorentryedit');
  }

  const elev = new Elevator({
    username: req.body.user,
    eleventrytitle: req.body.eleventrytitle,
    eleventryurl: req.body.eleventryurl,
    seqid: req.body.seqid,
    dayid: req.body.dayid,
    embedcode: req.body.embedcode,
    elevdate: req.body.elevdate,
    duration: req.body.duration,
    post: req.body.post, 
    location: req.body.location, 
    elevcat: req.body.elevcat,
    elevtags: req.body.elevtags,
    group: req.body.group,
    visibility: req.body.visibility
  });

  Elevator.findOne({ eleventrytitle: req.body.eleventrytitle }, (err, existingElev) => {
    if (err) { return next(err); }
    if (existingElev) {
      req.flash('errors', { msg: 'Podcast entry with that title already exists.' });
      return res.redirect('/account/elevatorentryedit');
    }
    elev.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your update.' });
          return res.redirect('/account/elevator');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Podast update saved.' });
      res.redirect('/account/elevator');
    });
  });
};


/**
 * POST /elevatorentryupdate
 */

exports.postUpdateElevatorEntry = (req, res) => {

  // update podcast ( Elevator ) and send back all calendar entries after update
  // create mongose method to update a existing record into collection
  var elevid = req.body.elevitemid;
  var data = {
    username : req.body.user,
    eleventrytitle : req.body.eleventrytitle,
    eleventryurl : req.body.eleventryurl,
    seqid: req.body.seqid,
    dayid: req.body.dayid,
    embedcode: req.body.embedcode,
    duration: req.body.duration,
    post : req.body.post,
    location : req.body.location,
    elevcat : req.body.elevcat,
    elevtags : req.body.elevtags,
    elevdate : req.body.elevdate,
    group : req.body.group,
    visibility: req.body.visibility
  }
 
  // save the update
  Elevator.findByIdAndUpdate(elevid, data, function(err, pos) {
  if (err) throw err;

  
  // using Twilio SendGrid's v3 Node.js Library
  // https://github.com/sendgrid/sendgrid-nodejs
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: 'greg@ecocity.com',
    from: 'greg@ecocity.com',
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };
  sgMail.send(msg);

  req.flash('success', { msg: 'Nice job. Your podcast entry has been updated.' });
  res.redirect('/account/elevator');
  });
};
