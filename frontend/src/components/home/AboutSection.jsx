import React, { useEffect, useState } from 'react'
import companySettingsService from '../../services/companySettingsService'
import assetService from '../../services/assetService'

function AboutSection() {
    const [settings, setSettings] = useState(null)
    const [asset, setAsset] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const settingsData = await companySettingsService.getCompanySettings()
                setSettings(settingsData)

                // Try to fetch about asset
                try {
                    const assets = await assetService.getAssetsByType('about')
                    if (assets.length > 0) {
                        setAsset(assets[0])
                    }
                } catch (err) {
                    console.error('Error loading about asset:', err)
                }
            } catch (error) {
                console.error('Error loading section data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    // Default values
    const companyName = settings?.companyName || 'Karwan-e-Arzoo-e-Tayba'
    const companyDescription = settings?.companyDescription || 'We pride ourselves on crafting experiences that allow you to focus entirely on your worship while we handle the logistics with precision, care, and deep respect for the sanctity of your pilgrimage.'
    const yearsExperience = settings?.yearsExperience || 20
    const happyPilgrims = settings?.happyPilgrims || 15000
    const aboutImage = asset?.imageUrl || 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1200&q=80'

    return (
        <>
            <section className='bg-background-light py-18'>
                <div className='mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2'>
                    <div>
                        <h2 className='font-serif text-3xl font-bold text-primary sm:text-4xl'>

                            A Legacy of Spiritual Service & Excellence
                        </h2>
                        <p className='mt-6 text-slate-700 leading-relaxed text-[17px]'>
                            Welcome to <span className='font-bold'>{companyName}</span>, where your spiritual journey is our sacred duty. For over {yearsExperience} decades, we have been the bridge between aspiring hearts and the Holy Lands.
                        </p>
                        <p className='mt-4 text-slate-700 leading-relaxed text-[17px]'>
                            {companyDescription}
                        </p>

                        <div className='mt-8 flex items-center gap-8'>
                            <div>
                                <h3 className='font-serif text-3xl font-bold text-secondary'>{yearsExperience}+</h3>
                                <p className='text-xs font-semibold uppercase tracking-wider text-slate-500'>Years Experience</p>
                            </div>
                            <div className='h-10 w-px bg-slate-300'></div>
                            <div>
                                <h3 className='font-serif text-3xl font-bold text-secondary'>{(happyPilgrims / 1000).toFixed(1)}k+</h3>
                                <p className='text-xs font-semibold uppercase tracking-wider text-slate-500'>Happy Pilgrims</p>
                            </div>
                        </div>
                    </div>

                    <div className='overflow-hidden rounded-2xl shadow-soft'>
                        <img
                            src={aboutImage}
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
