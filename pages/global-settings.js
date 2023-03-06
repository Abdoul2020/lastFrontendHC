import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import GlobalLayout from '../layouts/global-layout'
import StartPageLayout from '../layouts/start-page-layout'
import Link from 'next/link'



function GlobalSettings() {



    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
                
                <link rel="icon" href="/favicon.ico" />

            </Head>

            <GlobalLayout>
                <StartPageLayout imagePath={'/images/hibritcard-white-logo.svg'} headerTitle="Hesap Ayarları">



                    {/*  <div className='content-input-row'>
                        <div className='content-input-item '>
                            <input type="text" placeholder='İsim'></input>
                        </div>
                        <span className='content-input-space'>

                        </span>
                        <div className='content-input-item '>
                            <input type="text" placeholder='Soyisim'></input>
                        </div>

                    </div>*/}
                    <div className='content-input'>
                        <input type="text" placeholder='İsim'></input>
                        <input type="text" placeholder='Soyisim'></input>
                        <input type="text" placeholder='Kullanıcı Adı'></input>
                        <input type="date" placeholder='Doğum günü tarihi'></input>
                        <input type="text" placeholder='E-Posta'></input>
                        <select>
                            <option>Cinsiyetinizi Seçiniz</option>
                            <option>Erkek</option>
                            <option>Kadın</option>

                        </select>
                        <input type="text" placeholder='Telefon Numarası'></input>


                    </div>


                    <div className='content-buttons'>
                        <div className='global-button content-buttons-item primary-button'>
                            Kaydet
                        </div>

                    </div>

                </StartPageLayout>
            </GlobalLayout>
        </>
    )
}

export default GlobalSettings