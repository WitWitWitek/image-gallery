import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation, faEye, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { useCreateNewUserMutation } from './usersApiSlice';
import '../../styles/Forms.scss';
import { isErrorWithMessage } from '../../lib/fetchErrorHelper';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,20}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%.]).{8,24}$/;

function NewUserForm() {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const [password, setPassword] = useState<string>('');
  const [passwordRepeat, setPasswordRepat] = useState<string>('');
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(false);

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isRepeatVisible, setIsRepeatVisible] = useState<boolean>(false);

  const [validUsername, setValidUsername] = useState<boolean>(false);
  const [validPassword, setValidPassword] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>('');

  const [errMessage, setErrMessage] = useState<string>('');

  const navigate = useNavigate();

  const [createNewUser, {
    isSuccess,
    isError,
    isLoading,
  }] = useCreateNewUserMutation();

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(password));
    setPasswordsMatch(password === passwordRepeat);
  }, [password, passwordRepeat]);

  const canSave = validUsername && validPassword && passwordsMatch;

  const handleSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSave) {
      if (!validUsername) {
        setValidationError('Invalid username!');
      } else if (!validPassword) {
        setValidationError('Invalid password!');
      } else if (!passwordsMatch) {
        setValidationError('Passwords are not the same!');
      }
      return;
    }
    try {
      await createNewUser({ username, email, password }).unwrap();
    } catch (err) {
      if (isErrorWithMessage(err)) {
        setErrMessage(err.data.message);
      }
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setPassword('');
      setUsername('');
      setValidationError('');
      navigate('/login');
    }
  }, [isSuccess, navigate]);

  const onUsernameChanged = (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value);
  const onEmailChanged = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const onPasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const onPasswordRepeatChanged = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => setPasswordRepat(e.target.value);

  return (
    <section className="form-section">
      <h2 className="form-section__title">Sign up:</h2>
      <form className="form-section__form" onSubmit={handleSubmission}>
        <label className="form-section__label" htmlFor="username">
          Username:
          <input
            type="text"
            id="username"
            autoComplete="off"
            className="form-section__input"
            onChange={onUsernameChanged}
            required
          />
          {!validUsername && (
            <p className="form-section__note">
              3 to 30 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>
          )}
        </label>
        <label className="form-section__label" htmlFor="email">
          Email:
          <input
            type="email"
            id="email"
            className="form-section__input"
            autoComplete="off"
            onChange={onEmailChanged}
            required
          />
          {!email && (
            <p className="form-section__note">
              Should contain @ sign
            </p>
          )}
        </label>
        <label className="form-section__label" htmlFor="password">
          Password:
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            id="password"
            autoComplete="off"
            onChange={onPasswordChanged}
            required
            className="form-section__input"
          />
          <button type="button" className="form-section__password-button" onClick={() => setIsPasswordVisible((prev) => !prev)}>
            <FontAwesomeIcon icon={faEye} />
          </button>
          {!validPassword && (
            <p className="form-section__note">
              8 to 24 characters.
              <br />
              Must include uppercase and lowercase letters, a number and a special character.
              <br />
              Allowed special characters: !@#$%
            </p>
          )}
        </label>
        <label className="form-section__label" htmlFor="passwordRepeat">
          Repeat password:
          <input
            type={isRepeatVisible ? 'text' : 'password'}
            id="passwordRepeat"
            autoComplete="off"
            className="form-section__input"
            onChange={onPasswordRepeatChanged}
            required
          />
          <button type="button" className="form-section__password-button" onClick={() => setIsRepeatVisible((prev) => !prev)}>
            <FontAwesomeIcon icon={faEye} />
          </button>
          {!passwordsMatch && (
            <p className="form-section__note">
              Passwords must match!
            </p>
          )}
        </label>
        <button type="submit" className="form-section__button" disabled={isLoading}>{isLoading ? 'Loading...' : 'Sign up'}</button>
      </form>
      <p className="form-section__linkto">
        Already have an account?
        {' '}
        <Link to="/login" className="form-section__button">Log in</Link>
      </p>
      {(validationError || isError)
                && (
                <div className="form-section__error">
                  <p className="form-section__error-paragraph">
                    <FontAwesomeIcon icon={faCircleExclamation} />
                    {' '}
                    {validationError}
                    {errMessage}
                  </p>
                </div>
                )}
      {isSuccess
                && (
                <div className="form-section__success">
                  <p className="form-section__success-paragraph">
                    <FontAwesomeIcon icon={faCircleCheck} />
                    {' '}
                    User successfully created. Check your email account.
                  </p>
                </div>
                )}
    </section>
  );
}

export default NewUserForm;
