import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation, faEye, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useChangeUserPasswordMutation } from './usersApiSlice';
import '../../styles/Forms.scss';
import useToken from '../../hooks/useToken';
import { isErrorWithMessage } from '../../lib/fetchErrorHelper';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%.]).{8,24}$/;

function ChangePasswordForm() {
  const username = useToken();

  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newPasswordRepeat, setNewPasswordRepeat] = useState<string>('');
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(false);
  const [validPassword, setValidPassword] = useState<boolean>(false);

  const [validationError, setValidationError] = useState<string>('');
  const [errMessage, setErrMessage] = useState<string>('');

  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState<boolean>(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState<boolean>(false);
  const [isRepeatVisible, setIsRepeatVisible] = useState<boolean>(false);

  const [changeUserPassword, {
    isSuccess,
    isError,
    isLoading,
  }] = useChangeUserPasswordMutation();

  const canSave = currentPassword.trim() !== '' && validPassword && passwordsMatch;

  const handleSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrMessage('');
    setValidationError('');
    if (!canSave) {
      setValidationError('All fields are required!');
    }
    try {
      await changeUserPassword({
        username,
        password: currentPassword,
        newPassword,
      }).unwrap();
    } catch (err) {
      if (isErrorWithMessage(err)) {
        setErrMessage(err.data.message);
      }
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setCurrentPassword('');
      setNewPassword('');
      setNewPasswordRepeat('');
      setErrMessage('');
      setValidationError('');
    }
  }, [isSuccess]);

  useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(newPassword));
    setPasswordsMatch(newPassword === newPasswordRepeat);
  }, [newPassword, newPasswordRepeat]);

  const onCurrentPasswordChanged = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => setCurrentPassword(e.target.value);
  const onNewPasswordChanged = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => setNewPassword(e.target.value);
  const onNewPasswordRepeatChanged = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => setNewPasswordRepeat(e.target.value);

  return (
    <section className="form-section">
      <h2 className="form-section__title">Change password:</h2>
      <form className="form-section__form" onSubmit={handleSubmission}>
        <label className="form-section__label" htmlFor="currentPassword">
          Current Password:
          <input
            type={isCurrentPasswordVisible ? 'text' : 'password'}
            autoComplete="off"
            id="currentPassword"
            className="form-section__input"
            onChange={onCurrentPasswordChanged}
            value={currentPassword}
            required
          />
          <button type="button" className="form-section__password-button" onClick={() => setIsCurrentPasswordVisible((prev) => !prev)}>
            <FontAwesomeIcon icon={faEye} />
          </button>
        </label>
        <label className="form-section__label" htmlFor="newPassword">
          New password:
          <input
            type={isNewPasswordVisible ? 'text' : 'password'}
            id="newPassword"
            className="form-section__input"
            onChange={onNewPasswordChanged}
            value={newPassword}
            required
          />
          <button type="button" className="form-section__password-button" onClick={() => setIsNewPasswordVisible((prev) => !prev)}>
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
        <label className="form-section__label" htmlFor="newPasswordRepeat">
          Repeat new password:
          <input
            type={isRepeatVisible ? 'text' : 'password'}
            id="newPasswordRepeat"
            className="form-section__input"
            onChange={onNewPasswordRepeatChanged}
            value={newPasswordRepeat}
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
        <button type="submit" className="form-section__button" disabled={isLoading}>{isLoading ? 'Loading...' : 'Update password'}</button>
        {(validationError || isError)
                        && (
                        <div className="form-section__error">
                          <p className="form-section__error-paragraph">
                            <FontAwesomeIcon icon={faCircleExclamation} />
                            {' '}
                            {validationError || errMessage}
                          </p>
                        </div>
                        )}
        {isSuccess
                        && (
                        <div className="form-section__success">
                          <p className="form-section__success-paragraph">
                            <FontAwesomeIcon icon={faCircleCheck} />
                            {' '}
                            Password successfully changed.
                          </p>
                        </div>
                        )}
      </form>
    </section>
  );
}

export default ChangePasswordForm;
