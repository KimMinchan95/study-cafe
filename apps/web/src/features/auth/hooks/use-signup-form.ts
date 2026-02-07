import { useInputs } from '@/shared/hooks';
import { PASSWORD_PATTERN, EMAIL_PATTERN } from '@repo/shared';

export function useSignupForm() {
    const [formData, onFormChange, resetForm] = useInputs({
        email: '',
        password: '',
        name: '',
        displayName: '',
    });

    const isEmailInvalid =
        !!formData.email && !EMAIL_PATTERN.test(formData.email);
    const isPasswordInvalid =
        !!formData.password && !PASSWORD_PATTERN.test(formData.password);

    const isFormValid =
        !!formData.email &&
        !!formData.password &&
        !!formData.name &&
        !!formData.displayName &&
        !isPasswordInvalid &&
        !isEmailInvalid;

    return {
        formData,
        onFormChange,
        resetForm,
        validation: {
            isPasswordInvalid,
            isEmailInvalid,
            isFormValid,
        },
    };
}
