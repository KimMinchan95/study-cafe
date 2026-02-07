import { useInputs } from '@/shared/hooks';
import { EMAIL_PATTERN, PASSWORD_PATTERN } from '@repo/shared';

export function useSigninForm() {
    const [formData, onFormChange, resetForm] = useInputs({
        email: '',
        password: '',
    });

    const isEmailInvalid =
        !!formData.email && !EMAIL_PATTERN.test(formData.email);
    const isPasswordInvalid =
        !!formData.password && !PASSWORD_PATTERN.test(formData.password);

    const isFormValid =
        !!formData.email &&
        !!formData.password &&
        !isEmailInvalid &&
        !isPasswordInvalid;

    return {
        formData,
        onFormChange,
        resetForm,
        validation: {
            isEmailInvalid,
            isPasswordInvalid,
            isFormValid,
        },
    };
}
