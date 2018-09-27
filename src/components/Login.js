import React from 'react';
import '../asset/css/style.css';

class Login extends React.Component {
    onLogin = (response)=> {
        console.log(response);
        // this.FB.api('me', response => console.log(response))
    }

    render() {
        return (
            <div className="container">
                <div className="card card-container" >
                    {/*<img class="profile-img-card" src="//lh3.googleusercontent.com/-6V8xOA6M7BA/AAAAAAAAAAI/AAAAAAAAAAA/rzlHcD0KYwo/photo.jpg?sz=120" alt="" />*/}
                    <img id="profile-img" className="profile-img-card"
                         src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"/>
                    <p id="profile-name" className="profile-name-card"></p>
                    <form className="form-signin" open={this.props.open}>
                        <span id="reauth-email" className="reauth-email"></span>
                        <input type="text"
                               id="username"
                               className="form-control"
                               placeholder="Username"
                               // required autoFocus
                               onChange={this.props.onChange}
                        />
                        <input type="password"
                               id="password"
                               className="form-control"
                               placeholder="Password"
                               // required
                               onChange={this.props.onChange}
                               ref="password"
                        />
                        <div id="remember" className="checkbox">
                            <label>
                                <input type="checkbox" value="remember-me"/>Remember me
                            </label>
                        </div>
                        <button
                            className="btn btn-lg btn-primary btn-block btn-signin"
                            // type="submit"
                            onClick={this.props.onLogin}
                        >
                            Sign in
                        </button>
                    </form>
                    {/*/form*/}
                    <a href="#" className="forgot-password">
                        Forgot the password?
                    </a>
                </div>
            </div>
        );
    }
}
export default Login;