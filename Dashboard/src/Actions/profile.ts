import BackendAPI from 'CommonUI/src/utils/api/backend';
import { Dispatch } from 'redux';
import ObjectID from 'Common/Types/ObjectID';
import Route from 'Common/Types/api/route';
import * as types from '../constants/profile';
import FormData from 'form-data';
import ErrorPayload from 'CommonUI/src/payload-types/error';
import Action from 'CommonUI/src/types/action';
//Update profile setting

export const updateProfileSettingRequest: Function = (): void => {
    return {
        type: types.UPDATE_PROFILE_SETTING_REQUEST,
    };
};

export const updateProfileSettingSuccess: Function = (
    profileSetting: $TSFixMe
): void => {
    return {
        type: types.UPDATE_PROFILE_SETTING_SUCCESS,
        payload: profileSetting,
    };
};

export const updateProfileSettingError: Function = (
    error: ErrorPayload
): void => {
    return {
        type: types.UPDATE_PROFILE_SETTING_FAILURE,
        payload: error,
    };
};

export const updatePushNotificationRequest: Function = (): void => {
    return {
        type: types.UPDATE_PUSH_NOTIFICATION_REQUEST,
    };
};

export const updatePushNotificationError: Function = (
    error: ErrorPayload
): void => {
    return {
        type: types.UPDATE_PUSH_NOTIFICATION_ERROR,
        payload: error,
    };
};

export const updatePushNotificationSuccess: Function = (
    data: $TSFixMe
): void => {
    return {
        type: types.UPDATE_PUSH_NOTIFICATION_SUCCESS,
        payload: data,
    };
};

// Calls the API to update setting.

export const updateProfileSetting: Function = (values: $TSFixMe): void => {
    return function (dispatch: Dispatch): void {
        const data: $TSFixMe = new FormData();
        if (values.profilePic && values.profilePic !== 'null') {
            if (!values.removedPic) {
                if (
                    values.profilePic &&
                    typeof values.profilePic !== 'object'
                ) {
                    data.append('profilePic', values.profilePic);
                } else {
                    data.append(
                        'profilePic',
                        values.profilePic[0],
                        values.profilePic[0].name
                    );
                }
            } else {
                data.append('profilePic', null);
            }
        }

        data.append('name', values.name);
        data.append('email', values.email);
        data.append('companyPhoneNumber', values.companyPhoneNumber);
        data.append('timezone', values.timezone);
        data.append('alertPhoneNumber', values.alertPhoneNumber);

        const promise: $TSFixMe = BackendAPI.put('user/profile', data);
        dispatch(updateProfileSettingRequest());
        promise.then(
            (response): void => {
                const profileSettings: $TSFixMe = response.data;
                dispatch(updateProfileSettingSuccess(profileSettings));
                return profileSettings;
            },
            (error): void => {
                dispatch(updateProfileSettingError(error));
            }
        );

        return promise;
    };
};

// Update push notification
export const updatePushNotification: Function = (data: $TSFixMe): void => {
    return function (dispatch: Dispatch): void {
        const promise: $TSFixMe = BackendAPI.put(
            'user/push-notification',
            data
        );
        dispatch(updatePushNotificationRequest());
        promise.then(
            (response): void => {
                const profileSettings: $TSFixMe = response.data;
                dispatch(updatePushNotificationSuccess(profileSettings));
                return profileSettings;
            },
            (error): void => {
                dispatch(updatePushNotificationError(error));
            }
        );

        return promise;
    };
};

// Update user's two factor authentication
export const twoFactorAuthTokenRequest: Function = (): void => {
    return {
        type: types.UPDATE_TWO_FACTOR_AUTH_REQUEST,
    };
};

export const twoFactorAuthTokenSuccess: Function = (
    payload: $TSFixMe
): void => {
    return {
        type: types.UPDATE_TWO_FACTOR_AUTH_SUCCESS,
        payload: payload,
    };
};

export const twoFactorAuthTokenError: Function = (
    error: ErrorPayload
): void => {
    return {
        type: types.UPDATE_TWO_FACTOR_AUTH_FAILURE,
        payload: error,
    };
};

export const verifyTwoFactorAuthToken: Function = (values: $TSFixMe): void => {
    return function (dispatch: Dispatch): void {
        const promise: $TSFixMe = BackendAPI.post(
            new Route('user/totp/verifyToken'),
            values
        );
        dispatch(twoFactorAuthTokenRequest());
        promise.then(
            (response): void => {
                const payload: $TSFixMe = response.data;
                dispatch(twoFactorAuthTokenSuccess(payload));
                return payload;
            },
            (error): void => {
                dispatch(twoFactorAuthTokenError(error));
            }
        );

        return promise;
    };
};

// Generate user's QR code
export const generateTwoFactorQRCodeRequest: Function = (): void => {
    return {
        type: types.GENERATE_TWO_FACTOR_QR_REQUEST,
    };
};

export const generateTwoFactorQRCodeSuccess: Function = (
    payload: $TSFixMe
): void => {
    return {
        type: types.GENERATE_TWO_FACTOR_QR_SUCCESS,
        payload: payload,
    };
};

export const generateTwoFactorQRCodeError: Function = (
    error: ErrorPayload
): void => {
    return {
        type: types.GENERATE_TWO_FACTOR_QR_FAILURE,
        payload: error,
    };
};

export const generateTwoFactorQRCode: Function = (userId: ObjectID): void => {
    return function (dispatch: Dispatch): void {
        const promise: $TSFixMe = BackendAPI.post(`user/totp/token/${userId}`);
        dispatch(generateTwoFactorQRCodeRequest());
        promise.then(
            (response): void => {
                const payload: $TSFixMe = response.data;
                dispatch(generateTwoFactorQRCodeSuccess(payload));
                return payload;
            },
            (error): void => {
                dispatch(generateTwoFactorQRCodeError(error));
            }
        );

        return promise;
    };
};

// Update user twoFactorAuthToken

export const updateTwoFactorAuthToken: Function = (data: $TSFixMe): void => {
    return function (dispatch: Dispatch): void {
        const promise: $TSFixMe = BackendAPI.put('user/profile', data);
        dispatch(twoFactorAuthTokenRequest());
        promise.then(
            (response): void => {
                const payload: $TSFixMe = response.data;
                dispatch(twoFactorAuthTokenSuccess(payload));
                return payload;
            },
            (error): void => {
                dispatch(twoFactorAuthTokenError(error));
            }
        );

        return promise;
    };
};

//Update change password setting.

export const updateChangePasswordSettingRequest: Function = (): void => {
    return {
        type: types.UPDATE_CHANGE_PASSWORD_SETTING_REQUEST,
    };
};

export const updateChangePasswordSettingSuccess: Function = (): void => {
    return {
        type: types.UPDATE_CHANGE_PASSWORD_SETTING_SUCCESS,
    };
};

export const updateChangePasswordSettingError: Function = (
    error: ErrorPayload
): void => {
    return {
        type: types.UPDATE_CHANGE_PASSWORD_SETTING_FAILURE,
        payload: error,
    };
};

// Calls the API to update change password setting.
export const updateChangePasswordSetting: Function = (data: $TSFixMe): void => {
    return function (dispatch: Dispatch): void {
        const promise: $TSFixMe = BackendAPI.put('user/changePassword', data);
        dispatch(updateChangePasswordSettingRequest());

        promise.then(
            (): void => {
                dispatch(updateChangePasswordSettingSuccess());
                return {};
            },
            (error): void => {
                dispatch(updateChangePasswordSettingError(error));
            }
        );
        return promise;
    };
};

export const showProfileMenu: Function = (position: $TSFixMe): void => {
    return {
        type: types.SHOW_PROFILE_MENU,
        payload: position,
    };
};

export const hideProfileMenu: Function = (error: ErrorPayload): void => {
    return {
        type: types.HIDE_PROFILE_MENU,
        payload: error,
    };
};

// Get Previous User Settings.

export const userSettingsRequest: Function = (): void => {
    return {
        type: types.USER_SETTINGS_REQUEST,
    };
};

export const userSettingsSuccess: Function = (settings: $TSFixMe): void => {
    return {
        type: types.USER_SETTINGS_SUCCESS,
        payload: settings,
    };
};

export const userSettingsError: Function = (error: ErrorPayload): void => {
    return {
        type: types.USER_SETTINGS_FAILURE,
        payload: error,
    };
};

// Calls the API to update on cal alert setting.
export const userSettings: Function = (): void => {
    return function (dispatch: Dispatch): void {
        const promise: $TSFixMe = BackendAPI.get(new Route('user/profile'));
        dispatch(userSettingsRequest());

        promise.then(
            (response): void => {
                const settings: $TSFixMe = response.data;
                dispatch(userSettingsSuccess(settings));
                return settings;
            },
            (error): void => {
                dispatch(userSettingsError(error));
            }
        );

        return promise;
    };
};

export const logFile: Function = (file: $TSFixMe): void => {
    return function (dispatch: Dispatch): void {
        dispatch({ type: 'LOG_FILE', payload: file });
    };
};

export const resetFile: Function = (): void => {
    return function (dispatch: Dispatch): void {
        dispatch({ type: 'RESET_FILE' });
    };
};

export const sendVerificationSMSRequest: Function = (): void => {
    return {
        type: types.SEND_VERIFICATION_SMS_REQUEST,
    };
};

export const sendVerificationSMSSuccess: Function = (
    verificationAction: Action
): void => {
    return {
        type: types.SEND_VERIFICATION_SMS_SUCCESS,
        payload: verificationAction,
    };
};

export const sendVerificationSMSError: Function = (
    error: ErrorPayload
): void => {
    return {
        type: types.SEND_VERIFICATION_SMS_FAILURE,
        payload: error,
    };
};

export const sendVerificationSMSReset: Function = (): void => {
    return function (dispatch: Dispatch): void {
        dispatch({ type: types.SEND_VERIFICATION_SMS_RESET });
    };
};

export const sendEmailVerificationRequest: Function = (): void => {
    return {
        type: types.SEND_EMAIL_VERIFICATION_REQUEST,
    };
};

export const sendEmailVerificationSuccess: Function = (
    payload: $TSFixMe
): void => {
    return {
        type: types.SEND_EMAIL_VERIFICATION_SUCCESS,
        payload,
    };
};

export const sendEmailVerificationError: Function = (
    error: ErrorPayload
): void => {
    return {
        type: types.SEND_EMAIL_VERIFICATION_FAILURE,
        payload: error,
    };
};

export const sendEmailVerificationLink: Function = (values: $TSFixMe): void => {
    return function (dispatch: Dispatch): void {
        const promise: $TSFixMe = BackendAPI.post(
            new Route('user/resend'),
            values
        );
        dispatch(sendEmailVerificationRequest());

        promise.then(
            (data): void => {
                dispatch(sendEmailVerificationSuccess(data));
                return data;
            },
            (error): void => {
                dispatch(sendEmailVerificationError(error));
            }
        );
    };
};

export const sendVerificationSMS: Function = (
    projectId: ObjectID,
    values: $TSFixMe
): void => {
    return function (dispatch: Dispatch): void {
        const promise: $TSFixMe = BackendAPI.post(
            `twilio/sms/sendVerificationToken?projectId=${projectId}`,
            values
        );
        dispatch(sendVerificationSMSRequest());

        promise.then(
            (response): void => {
                const vericationAction: $TSFixMe = response.data;
                dispatch(sendVerificationSMSSuccess(vericationAction));
                return vericationAction;
            },
            (error): void => {
                dispatch(sendVerificationSMSError(error));
            }
        );

        return promise;
    };
};
export const verifySMSCodeRequest: Function = (): void => {
    return {
        type: types.VERIFY_SMS_CODE_REQUEST,
    };
};

export const verifySMSCodeSuccess: Function = (
    verificationResult: $TSFixMe
): void => {
    return {
        type: types.VERIFY_SMS_CODE_SUCCESS,
        payload: verificationResult,
    };
};

export const verifySMSCodeError: Function = (error: ErrorPayload): void => {
    return {
        type: types.VERIFY_SMS_CODE_FAILURE,
        payload: error,
    };
};

export const verifySMSCodeReset: Function = (): void => {
    return function (dispatch: Dispatch): void {
        dispatch({ type: types.VERIFY_SMS_CODE_RESET });
    };
};

export const verifySMSCode: Function = (
    projectId: ObjectID,
    values: $TSFixMe
): void => {
    return function (dispatch: Dispatch): void {
        const promise: $TSFixMe = BackendAPI.post(
            `twilio/sms/verify?projectId=${projectId}`,
            values
        );
        dispatch(verifySMSCodeRequest());

        promise.then(
            (response): void => {
                const verificationResult: $TSFixMe = response.data;
                dispatch(verifySMSCodeSuccess(verificationResult));
                return verificationResult;
            },
            (error): void => {
                dispatch(verifySMSCodeError(error));
            }
        );

        return promise;
    };
};

export const setAlertPhoneNumber: Function = (number: $TSFixMe): void => {
    return {
        type: types.SET_ALERT_PHONE_NUMBER,
        payload: number,
    };
};

export const setTwoFactorAuth: Function = (enabled: $TSFixMe): void => {
    return {
        type: types.SET_TWO_FACTOR_AUTH,
        payload: enabled,
    };
};

export const setInitAlertEmail: Function = (email: $TSFixMe): void => {
    return {
        type: types.SET_INIT_ALERT_EMAIL,
        payload: email,
    };
};

export const setVerified: Function = (value: $TSFixMe): void => {
    return {
        type: types.SET_VERIFIED,
        payload: value,
    };
};

export const setInitPhoneVerificationNumber: Function = (
    number: $TSFixMe
): void => {
    return {
        type: types.SET_INIT_PHONE_VERIFICATION_NUMBER,
        payload: number,
    };
};

export const setInitPhoneVerification: Function = (value: $TSFixMe): void => {
    return {
        type: types.SET_INIT_PHONE_VERIFICATION,
        payload: value,
    };
};

export const setProfilePic: Function = (value: $TSFixMe): void => {
    return {
        type: types.SET_PROFILE_PIC,
        payload: value,
    };
};

export const setRemovedPic: Function = (value: $TSFixMe): void => {
    return {
        type: types.SET_REMOVED_PIC,
        payload: value,
    };
};

export const setFileInputKey: Function = (value: $TSFixMe): void => {
    return {
        type: types.SET_FILE_INPUT_KEY,
        payload: value,
    };
};

export const setIsVerified: Function = (value: $TSFixMe): void => {
    return {
        type: types.SET_IS_VERIFIED,
        payload: value,
    };
};

export const setInitialAlertPhoneNumber: Function = (value: $TSFixMe): void => {
    return {
        type: types.SET_INITIAL_ALERT_PHONE_NUMBER,
        payload: value,
    };
};

export const setUserEmail: Function = (value: $TSFixMe): void => {
    return {
        type: types.SET_USER_EMAIL,
        payload: value,
    };
};

export const setResendTimer: Function = (value: $TSFixMe): void => {
    return {
        type: types.SET_RESEND_TIMER,
        payload: value,
    };
};

// Delete user account
export const deleteAccountRequest: Function = (): void => {
    return {
        type: types.DELETE_ACCOUNT_REQUEST,
    };
};

export const deleteAccountSuccess: Function = (promise: $TSFixMe): void => {
    return {
        type: types.USER_SETTINGS_SUCCESS,
        payload: promise,
    };
};

export const deleteAccountFailure: Function = (error: ErrorPayload): void => {
    return {
        type: types.USER_SETTINGS_FAILURE,
        payload: error,
    };
};

export const deleteAccount: Function = (
    userId: ObjectID,
    confirmation: $TSFixMe
): void => {
    return function (dispatch: Dispatch): void {
        const promise: $TSFixMe = delete (`user/${userId}/delete`,
        confirmation);
        dispatch(deleteAccountRequest());

        promise.then(
            (response): void => {
                dispatch(deleteAccountSuccess(response.data));
                return response;
            },
            (error): void => {
                dispatch(deleteAccountFailure(error));
            }
        );

        return promise;
    };
};

// Generate backup codes
const generateBackupCodesRequest: Function = (): void => ({
    type: types.GENERATE_BACKUP_CODES_REQUEST,
});

const generateBackupCodesSuccess: Function = (payload: $TSFixMe): void => ({
    type: types.GENERATE_BACKUP_CODES_SUCCESS,
    payload,
});

const generateBackupCodesFailure: Function = (payload: $TSFixMe): void => ({
    type: types.GENERATE_BACKUP_CODES_FAILURE,
    payload,
});

export const generateBackupCodes: Function = (): void => {
    return function (dispatch: Dispatch): void {
        const promise: $TSFixMe = BackendAPI.post(`user/generate/backupCode`);
        dispatch(generateBackupCodesRequest());

        promise.then(
            (response): void => {
                dispatch(generateBackupCodesSuccess(response.data));
                return response;
            },
            (error): void => {
                dispatch(generateBackupCodesFailure(error));
            }
        );

        return promise;
    };
};
