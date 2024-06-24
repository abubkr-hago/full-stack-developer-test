'use client';
import { useFormState } from 'react-dom';
import * as React from 'react';
import { useRef } from 'react';

function FormWrapper({ action, onSubmit, children }) {
  const [formState, setFormState] = useFormState(action, null);
  const ref = useRef<HTMLFormElement>();
  return (
    <form onSubmit={onSubmit} ref={ref} action={setFormState}>
      {React.Children.map(children, child => {
        // Checking isValidElement is the safe way and avoids a
        // typescript error too.
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { formState });
        }
        return child;
      })}
    </form>
  );
}

export default FormWrapper;
