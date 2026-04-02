'use client';

type Props = {
  error: Error;
};

const ErrorPage = ({ error }: Props) => {
  return <p>Could not fetch note details. {error.message}</p>;
};

export default ErrorPage;
