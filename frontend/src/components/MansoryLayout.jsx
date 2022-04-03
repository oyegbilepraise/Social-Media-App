import React from 'react'
import Mansory from 'react-masonry-css';
import Pin from './Pin';

const breakpointsObj ={
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1
}

const MansoryLayout = ({pins}) => {
  return (
    <div>
      <Mansory className='flex animate-slide-fwd' breakpointCols={breakpointsObj}>
        {pins?.map((pin, i) => <Pin key={pin._id} pin={pin} className='w-max' /> )}
      </Mansory>
    </div>
  )
}

export default MansoryLayout