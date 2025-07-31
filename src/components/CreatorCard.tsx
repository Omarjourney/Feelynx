import React from 'react';
import { Creator } from '../types';

    <div className="mt-2 text-sm flex justify-between items-center">
      <span>@{creator.username}</span>
      <span className="text-xs text-gray-400">${creator.rate}/min</span>
    </div>
    <button className="mt-2 w-full bg-pink-500 text-white py-1 rounded text-sm">
      Call
    </button>
    </div>
  );
};

export default CreatorCard;
