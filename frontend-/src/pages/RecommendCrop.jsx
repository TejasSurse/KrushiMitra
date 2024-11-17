import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from '../componenets/Card';

const RecommendCrop = () => {
  const location = useLocation();
  const crops = location.state?.crops || [];

  return (
   <div
  className="max-h-full p-8"
  style={{
    background: "linear-gradient(135deg, #00C853 0%, #B2FF59 100%)"
  }}
>

      <h1 className="text-3xl font-bold text-center mb-8">Recommended Crops</h1> 
      
      {crops.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {crops.map((crop, index) => (
            <Card key={index} crop={crop} />
          ))}
        </div>
      ) : (
        <p className="text-center">No crops recommended at the moment.</p>
      )}
    </div>
  );
};

export default RecommendCrop;
