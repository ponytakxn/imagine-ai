'use client'
import { navLinks } from '@/constants'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { Card, CardContent, CardHeader } from 'rewind-uikit'

const HeroBanner = () => {
  return (
    <Card className='hidden sm:flex-center w-full bg-info/60 p-8 rounded-xl border-none'>
      <CardHeader className='text-center h1-semibold text-secondary mb-6'>
        Unleash your creativity with Imagine
      </CardHeader>
      <CardContent>
        <ul className='flex-center w-ful gap-20'>
          {navLinks.slice(1, 5).map((link) => (
            <Link
              key={link.route}
              href={link.route}
              className='flex-center flex-col gap-2'
            >
              <li className='flex-center w-fit rounded-full bg-white p-4'>
                <Image 
                  src={link.icon}
                  alt='icon'
                  width={24}
                  height={24}
                />
              </li>
              <p className='p-14-medium text-center text-secondary'>{link.label}</p>
            </Link>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default HeroBanner