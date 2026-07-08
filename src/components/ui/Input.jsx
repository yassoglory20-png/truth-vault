import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className={className}>
      {label && <label className="label" htmlFor={props.id}>{label}{props.required && <span className="text-red-500 ml-1">*</span>}</label>}
      <input ref={ref} className={`input ${error ? 'border-red-500 focus:ring-red-500' : ''}`} aria-invalid={error ? 'true' : 'false'} aria-describedby={error ? `${props.id}-error` : undefined} {...props} />
      {error && <p id={`${props.id}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>}
    </div>
  );
});
Input.displayName = 'Input';
export default Input;
