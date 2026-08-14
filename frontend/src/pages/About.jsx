import React from 'react'
import Title from "../components/Title.jsx"
import {assets} from "../assets/frontend_assets/assets.js"
import NewsletterBox from '../components/NewsletterBox.jsx'

const About = () => {
	return (
		<div className='px-5'>
			<div className='text-center text-2xl pt-8 border-t'>
				<Title text1={"ABOUT"} text2={"US"} />
			</div>

			<div className="my-10 flex flex-col md:flex-row gap-16">
				<img className='w-full md:max-w-[450px]  ' src={assets.about_img} alt="" />
				<div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
					<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio adipisci dolor nostrum reprehenderit aliquam rem libero molestiae rerum commodi voluptate repellat, quos maiores nesciunt numquam vero modi consectetur fugiat pariatur!</p>
					<p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Porro, est soluta, iure nesciunt rem possimus ea error quibusdam.</p>
					<b className='text-gray-800'>Our Mission</b>
					<p>Our mission at Forever is to empower Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero, asperiores vitae illo quibusdam, odit incidunt molestias ipsam voluptas architecto in.</p>
				</div>
			</div>

			<div className='text-4xl py-4'>
				<Title text1={"WHY"} text2={"CHOOSE US?"} />
			</div>

			<div className='flex flex-col md:flex-row text-sm mb-20 gap-8'>
				<div className='border px-10 md:px-10 py-8 sm:py-12 flex flex-col gap-5 '>
					<b className='text-xl  text-gray-800'>Quality Assurance :</b>
					<p  className='text-gray-600'>We meticulously select and vet each product to ensure it meets the best standards. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reprehenderit doloribus, totam error ab tenetur natus reiciendis, illum dignissimos </p>
				</div>
				<div className='border px-10 md:px-10 py-8 sm:py-12 flex flex-col gap-5'>
					<b className='text-xl text-gray-800'>Convenience :</b>
					<p className='text-gray-600'>With our user-friendly interface and hassle free ordering process, Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reprehenderit doloribus, totam error ab tenetur natus reiciendis, illum dignissimos </p>
				</div>
				<div className='border px-10 md:px-10 py-8 sm:py-12 flex flex-col gap-5'>
					<b className='text-xl text-gray-800'>Exceptional Customer Service :</b>
					<p className='text-gray-600'>Our team of dedicated professionals are here to help anytime. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reprehenderit doloribus, totam error ab tenetur natus reiciendis, illum dignissimos </p>
				</div>

			</div>
			<NewsletterBox />

		</div>
	)
}

export default About

