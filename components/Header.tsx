import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
const Header = () => {
  return (
    <header className='flex justify-between p-5 max-w-7xl mx-auto '>
      <div className='flex items-center space-x-5'>
         <h1 className='text-4xl font-bold text-white'>BLOGit.</h1>
         
      </div>

      <div className='flex items-center space-x-5 text-green-400 cursor-pointer'>
        <h1>Sigin</h1>
      </div>
    </header>
  )
}

export default Header