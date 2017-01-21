const express = require('express');
const validator = require('validator');
const passport = require('passport');

const router = new express.Router();

function validateSignUpForm(payload){
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
   isFormValid = false;
   errors.email = 'Please provide a correct email address.';
 }

 if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 8) {
   isFormValid = false;
   errors.password = 'Password must have at least 8 characters.';
 }

 if (!payload || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
   isFormValid = false;
   errors.name = 'Please provide your name.';
 }

 if (!isFormValid) {
   message = 'Check the form for errors.';
 }

 return {
   success: isFormValid,
   message,
   errors
 };
}

function validateLoginForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.email !== 'string' || payload.email.trim().length === 0) {
    isFormValid = false;
    errors.email = 'Please provide your email address.';
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
    isFormValid = false;
    errors.password = 'Please provide your password.';
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

router.post('/signup', (req, res, next)=>{
  const validationResult = validateSignUpForm(req.body);
  if(!validationResult.success){
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }

  return passport.authenticate('local-signup',(err)=>{
    if(err){
      if(err.name === 'MongoError' && err.code === 11000){
        //11000 Mongo code for duplication
        //409 HTTP error for conflict
        return res.status(409).json({
          success: false,
          message: 'Check the form for the errors',
          errors: {
            email: 'This email is already taken.'
          }
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Couldn\'t process form.'
      });
    }

    return res.status(200).json({
      success: true,
      message: "You have successfully signed up!"
    });
  })(req, res, next);
});

router.post('/login',(req, res, next)=>{
  const validationResult = validateLoginForm(req.body);
  if(!validationResult.success){
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }

  return passport.authenticate('local-login',(err, token, userData)=>{
    if(err){
      if(err.name === 'IncorrectCredentialsError'){
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Couldn\'t process form.'
      });
    }

    return res.status(200).json({
      success: true,
      message: "You have successfully logged in!",
      token,
      user: userData
    });
  })(req, res, next);
});

module.exports = router;