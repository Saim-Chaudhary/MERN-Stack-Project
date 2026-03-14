import React from 'react'
import HeroSection from '../../components/home/HeroSection'
import AboutSection from '../../components/home/AboutSection'
import PackagesSection from '../../components/home/PackagesSection'
import WhyChooseSection from '../../components/home/WhyChooseSection'
import TestimonialsSection from '../../components/home/TestimonialsSection'
import CTASection from '../../components/home/CTASection'

function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <PackagesSection />
      <WhyChooseSection />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}

export default Home