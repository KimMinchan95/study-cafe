import { useState } from 'react';

const useInputs = <T extends Record<string, unknown>>(initialValues: T) => {
    const [values, setValues] = useState<T>(initialValues);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const reset = () => {
        setValues(initialValues);
    };

    return [values, onChange, reset] as const;
};

export { useInputs };
