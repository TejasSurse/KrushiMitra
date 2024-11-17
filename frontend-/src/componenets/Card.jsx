import React from 'react';

export const Card = ({ crop }) => {
  const name = crop.name || crop.crop_name || crop.crop;
  const marketPrice = crop.market_price || crop.market_price_rupees || 'Price not available';
  const benefits = crop.benefits || crop.description || 'Information not available';

  return (
    <div className="bg-slate-700  w-[30%]sm:w-[30%] rounded-md overflow-hidden text-white m-4 border-[4px] border-black">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Name: {name}</h2>
        <span> </span>
        <p className="text-lg font-semibold">Market Price: {marketPrice}</p>
        <p className="mt-2">Benefits/Description: {benefits}</p>
      </div>
    </div>
  );
};

// commnet
