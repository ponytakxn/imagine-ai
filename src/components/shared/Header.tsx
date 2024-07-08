'use client'
import React from 'react'
import { Label } from 'rewind-uikit'

const Header = ({ title, subtitle }: { title: string, subtitle?: string}) => {
  return (
    <>
      <Label className='h2-bold'>{title}</Label>
      {subtitle && <p className='p-16-regular mt-4 text-primary/60'>{subtitle}</p>}
    </>
  )
}

export default Header