import React, {PropTypes} from 'react';
import SignUpForm from '../components/SignUpForm.jsx';

class SignUpPage extends React.Component {
  constructor(props, context){
    super(props, context);

    this.state = {
      user: {
        email: '',
        password: '',
        name: ''
      },
      errors: {}
    };

    this.changeUser = this.changeUser.bind(this);
    this.processForm = this.processForm.bind(this);
  }

  changeUser(e){
    const field = e.target.name;
    const user = this.state.user;
    user[field] = e.target.value;

    this.setState({
      user
    });
  }

  processForm(e){
    e.preventDefault();

    console.log(this.state.user);
    console.log(this.state.email);
    console.log(this.state.password);

    const name = encodeURIComponent(this.state.user.name);
    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);
    const formData = `name=${name}&email=${email}&password=${password}`;

    const xhr = new XMLHttpRequest();
    xhr.open('post','/auth/signup');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success

        // change the component-container state
        this.setState({
          errors: {}
        });

        console.log('The form is valid');
        localStorage.setItem('successMessage', xhr.response.message);
        this.context.router.replace('/login');
      } else {
        // failure

        const errors = xhr.response.errors ? xhr.response.errors : {};
        errors.summary = xhr.response.message;

        this.setState({
          errors
        });
      }
    });
    xhr.send(formData);
  }

  render(){
    return (
      <SignUpForm
        onSubmit={this.processForm}
        onChange={this.changeUser}
        user = {this.state.user}
        errors = {this.state.errors}
      />
    );
  };
}

export default SignUpPage;
