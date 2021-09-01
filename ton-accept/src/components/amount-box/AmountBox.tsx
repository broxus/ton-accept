import React from "react";

type AmountBoxProps = {
  amount: number;
  description: string;
};

const AmountBox = ({ amount, description }: AmountBoxProps): JSX.Element => {
  return (
    <>
      <div className="amount">
        <span>$ {amount}</span>
        <p>{description}</p>
      </div>
    </>
  );
};

export default AmountBox;
