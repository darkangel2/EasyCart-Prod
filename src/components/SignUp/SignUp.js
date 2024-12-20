import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom'; // Import useHistory
import Logo from '../../images/background.png';
import './SignUp.css';
import { useAuth } from './useAuth';

const SignUp = ({ defaultReturningUser }) => {
  const [returningUser, setReturningUser] = useState(defaultReturningUser);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const history = useHistory(); // Use useHistory hook

  const { signIn, signUp, signInWithGoogle } = useAuth(); // Use the useAuth hook to access the auth instance

  useEffect(() => {
    setReturningUser(defaultReturningUser);
  }, [defaultReturningUser]);

  const onSubmit = data => {
    if (returningUser) {
      if (data.email && data.password) {
        signIn(data.email, data.password)
          .then(user => {
            setMessage("Signed in successfully!");
            setMessageType("success");
            console.log('Signed in as:', user);
          })
          .catch(error => {
            setMessage(error.message);
            setMessageType("error");
            console.error('Error signing in:', error);
          });
      }
    } else {
      if (data.name && data.email && data.password && data.confirm_password && data.phone) {
        signUp(data.email, data.confirm_password, data.name, data.phone)
          .then(user => {
            setMessage("Signed up successfully!");
            setMessageType("success");
            console.log('Signed up as:', user);
            history.push("/"); // Redirect to the main page
          })
          .catch(error => {
            setMessage(error.message);
            setMessageType("error");
            console.error('Error signing up:', error);
          });
      }
    }
  }

  return (
    <div className="sign-up">
      <div className="container">
        <div className="logo text-center py-4">
          <Link to="/">
            <img src={Logo} alt="" />
          </Link>
        </div>
        {
          returningUser ?

            <form onSubmit={handleSubmit(onSubmit)} className="py-3">

              <h1 className='lead text-center py-3'>Welcome back!</h1>
              {
                message && <p className={`text-${messageType}`}>{message}</p>
              }

              <div className="form-group">
                <input
                  name="email"
                  className="form-control"
                  {...register("email", { required: true })}
                  placeholder="Email"
                />
                {
                  errors.email && <span className="error">Email is required</span>
                }
              </div>

              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  {...register("password", { required: true })}
                  placeholder="Password"
                />
                {
                  errors.password && <span className="error">Password is required</span>
                }
              </div>

              <div className="form-group">
                <button
                  className="btn btn-danger btn-block"
                  type="submit"
                >
                  Sign In
                </button>
              </div>

              <div className='text-center my-0'>
                <label> or </label>
              </div>

              <button
                className='btn btn-success  btn-block'
                onClick={signInWithGoogle}
              >
                Sign in with Google
              </button>
              <div className="option text-center my-3">
                <label
                  onClick={() => setReturningUser(false)}
                >
                  Create a new Account
                </label>
              </div>
            </form>

            :

            <form onSubmit={handleSubmit(onSubmit)} className="py-5">

              {
                message && <p className={`text-${messageType}`}>{message}</p>
              }

              <div className="form-group">
                <input
                  name="name"
                  className="form-control"
                  {...register("name", {
                    required: "Name is required",
                    pattern: {
                      value: /^(?=^.{6,20}$)^[a-zA-Z-]+\s[a-zA-Z-]+\s[a-zA-Z-]+$/i,
                      message: "Name must be 6 - 20 characters & Max 3 words"
                    }
                  })}
                  placeholder="Name"
                />
                <span className="error">
                  {errors.name && errors.name.message}
                </span>
              </div>

              <div className="form-group">
                <input
                  name="email"
                  className="form-control"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  placeholder="Email"
                />
                <span className="error">
                  {errors.email && errors.email.message}
                </span>
              </div>

              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/i,
                      message: "Minimum eight characters, at least one uppercase letter, one lowercase letter and one number"
                    }
                  })}
                  placeholder="Password"
                />
                <span className="error">
                  {errors.password && errors.password.message}
                </span>
              </div>

              <div className="form-group">
                <input
                  type="password"
                  name="confirm_password"
                  className="form-control"
                  {...register("confirm_password", {
                    validate: (value) => value === watch('password')
                  })}
                  placeholder="Confirm Password"
                />
                {
                  errors.confirm_password && <span className="error">Passwords don't match.</span>
                }
              </div>

              <div className="form-group">
                <input
                  name="phone"
                  className="form-control"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Invalid phone number"
                    }
                  })}
                  placeholder="Phone Number"
                />
                <span className="error">
                  {errors.phone && errors.phone.message}
                </span>
              </div>

              <div className="form-group">
                <button
                  className="btn btn-danger btn-block"
                  type="submit"
                >
                  Sign Up
                </button>
              </div>

              <div className="option text-center my-3">
                <label
                  onClick={() => setReturningUser(true)}
                >
                  Already Have an Account
                </label>
              </div>
            </form>
        }
      </div>
    </div>
  );
};

export default SignUp;