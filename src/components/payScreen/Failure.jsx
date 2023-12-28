import React from 'react';
import { useParams } from 'react-router-dom';

const Failure = () => {
  const { memo } = useParams();

  return (
    <div>
      <h1>Failure</h1>
      <p>Nie dziala</p>
    </div>
  );
};

export default Failure;
