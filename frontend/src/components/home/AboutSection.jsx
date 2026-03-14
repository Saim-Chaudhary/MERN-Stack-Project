import React from 'react'

function AboutSection() {
    return (
        <>
            <section className='bg-background-light py-18'>
                <div className='mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2'>
                    <div>
                        <h2 className='font-serif text-3xl font-bold text-primary sm:text-4xl'>

                            A Legacy of Spiritual Service & Excellence
                        </h2>
                        <p className='mt-6 text-slate-700 leading-relaxed text-[17px]'>
                            Welcome to <span className='font-bold'>Karwan-e-Arzoo-e-Tayba</span>, where your spiritual journey is our sacred duty. For over two decades, we have been the bridge between aspiring hearts and the Holy Lands.
                        </p>
                        <p className='mt-4 text-slate-700 leading-relaxed text-[17px]'>
                            We pride ourselves on crafting experiences that allow you to focus entirely on your worship while we handle the logistics with precision, care, and deep respect for the sanctity of your pilgrimage.
                        </p>

                        <div className='mt-8 flex items-center gap-8'>
                            <div>
                                <h3 className='font-serif text-3xl font-bold text-secondary'>20+</h3>
                                <p className='text-xs font-semibold uppercase tracking-wider text-slate-500'>Years Experience</p>
                            </div>
                            <div className='h-10 w-px bg-slate-300'></div>
                            <div>
                                <h3 className='font-serif text-3xl font-bold text-secondary'>15k+</h3>
                                <p className='text-xs font-semibold uppercase tracking-wider text-slate-500'>Happy Pilgrims</p>
                            </div>
                        </div>
                    </div>

                    <div className='overflow-hidden rounded-2xl shadow-soft'>
                        <img
                            src='https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1200&q=80'
                            alt='Pilgrims in Makkah'
                            className='h-70 w-full object-cover sm:h-72 lg:h-80'
                        />
                    </div>
                </div>
            </section>
        </>
    )
}

export default AboutSection
