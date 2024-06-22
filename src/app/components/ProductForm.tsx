'use client';
import { useFormState } from 'react-dom';
import * as React from 'react';
import { useRef } from 'react';
import { addToCart } from '../lib/actions';
import Product from './Product';

function ProductForm({ objectId, title, price, photo, description, rating }) {
  const [state, setState] = useFormState(addToCart, null);
  const ref = useRef<HTMLFormElement>();
  return (
    <form
      ref={ref}
      action={async formData => {
        await setState(formData);
        ref.current?.reset();
      }}
    >
      <Product
        state={state}
        objectId={objectId}
        title={title}
        price={price}
        photo={photo}
        description={description}
        rating={rating}
      />
    </form>
  );
}

export default ProductForm;
