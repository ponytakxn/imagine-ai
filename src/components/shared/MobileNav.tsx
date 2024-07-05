'use client'
import Link from 'next/link'
import Image from 'next/image'
import React, { MutableRefObject, useEffect, useRef } from 'react'
import { Button, Drawer, DrawerCloseBtn, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from 'rewind-uikit'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { navLinks } from '@/constants'
import { usePathname } from 'next/navigation'

const MobileNav = () => {
  const pathname = usePathname()

  return (
    <header className='flex items-center justify-between fixed h-16 w-screen border-b-4 border-primary bg-secondary p-5 md:hidden'>

      <Link href='/' className='flex items-center gap-2 md:py-2'>
        <Image
          src='/assets/images/logo-text.svg'
          alt='logo'
          width={180}
          height={28}
        />
      </Link>

      <nav className='flex gap-2'>
        <SignedIn>
          <UserButton />

          <Drawer orientation='right'>
            <DrawerTrigger>
              <Image
                src='/assets/icons/menu.svg'
                alt='menu'
                width={32}
                height={32}
                className='cursor-pointer'
              />
            </DrawerTrigger>
            <DrawerContent className='justify-start'>
              <DrawerHeader>
                <Image 
                  src='/assets/images/logo-text.svg'
                  alt='logo'
                  width={152}
                  height={23}
                />
              </DrawerHeader>

              <div className='flex flex-col h-full justify-between'>
                <ul className='w-full flex-col items-start gap-2 flex'>
                  {navLinks.slice(0,6).map((link) => {
                    const isActive = link.route === pathname

                    return(
                      <li 
                        key={link.route} 
                        className='w-full'
                      >
                        <Button variant='solid' color='secondary' className='w-full bg-transparent'>
                          <Link className='p-16-semibold flex size-full gap-4 p-4' href={link.route}>
                            <Image 
                              src={link.icon}
                              alt='logo'
                              width={24}
                              height={24}
                            />
                            {link.label}
                          </Link>
                        </Button>
                      </li>
                    )
                  })}
                </ul>

                <DrawerFooter className='p-0'>
                  <ul className='w-full flex-col items-start gap-2 flex'>
                    {navLinks.slice(6).map((link) => {
                      const isActive = link.route === pathname

                      return(
                        <li 
                          key={link.route} 
                          className='w-full'
                        >
                          <Button variant='solid' color='secondary' className='w-full bg-transparent'>
                            <Link className='p-16-semibold flex size-full gap-4 p-4' href={link.route}>
                              <Image 
                                src={link.icon}
                                alt='logo'
                                width={24}
                                height={24}
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
                </DrawerFooter>
              </div>

              <DrawerCloseBtn size='sm' variant='solid' color='secondary' className='absolute top-4 right-4 bg-white'>
                X
              </DrawerCloseBtn>
            </DrawerContent>

          </Drawer>
        </SignedIn>

        <SignedOut>
            <Button variant='solid' color='primary' size='md' className='w-full' >
              <Link href='/sign-in'>Log In</Link>
            </Button>
        </SignedOut>
      </nav>

    </header>
  )
}

export default MobileNav