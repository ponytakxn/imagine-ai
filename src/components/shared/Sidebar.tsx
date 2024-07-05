'use client'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { navLinks } from '@/constants'
import { usePathname } from 'next/navigation'
import { Button } from 'rewind-uikit'

const Sidebar = () => {
  const pathname = usePathname()

  return (
    <aside className='hidden h-screen w-72 bg-secondary p-5 shadow-md shadow-primary/50 md:flex'>
      <div className='flex size-full flex-col gap-4'>
        <Link href='/' className='flex items-center gap-2 md:py-2'>
          <Image src='/assets/images/logo-text.svg' alt='logo' width={180} height={28} />
        </Link>

        <nav className='h-full flex-col justify-between md:flex md:gap-4'>
          <SignedIn>
            <ul className='hidden w-full flex-col items-start gap-2 md:flex'>
              {navLinks.slice(0,6).map((link) => {
                const isActive = link.route === pathname

                return(
                  <li 
                    key={link.route} 
                    className='w-full'
                  >
                    <Button variant={`${isActive ? 'solid' : 'ghost'}`} color='primary' className='w-full'>
                      <Link className='p-16-semibold flex size-full gap-4 p-4' href={link.route}>
                        <Image 
                          src={link.icon}
                          alt='logo'
                          width={24}
                          height={24}
                          className={`${isActive && 'brigthness-200'}`}
                        />
                        {link.label}
                      </Link>
                    </Button>
                  </li>
                )
              })}
            </ul>

            <ul className='hidden w-full flex-col items-start gap-2 md:flex'>
              {navLinks.slice(6).map((link) => {
                const isActive = link.route === pathname

                return(
                  <li 
                    key={link.route} 
                    className='w-full'
                  >
                    <Button variant={`${isActive ? 'solid' : 'ghost'}`} color='primary' className='w-full'>
                      <Link className='p-16-semibold flex size-full gap-4 p-4' href={link.route}>
                        <Image 
                          src={link.icon}
                          alt='logo'
                          width={24}
                          height={24}
                          className={`${isActive && 'brigthness-200'}`}
                        />
                        {link.label}
                      </Link>
                    </Button>
                  </li>
                )
              })}

              <li className='self-end'>
                <UserButton showName />
              </li>
            </ul>
          </SignedIn>

          <SignedOut>
            <Button variant='solid' color='primary' size='md' className='w-full' >
              <Link href='/sign-in'>Log In</Link>
            </Button>
          </SignedOut>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar