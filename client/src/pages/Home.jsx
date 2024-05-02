import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
export default function Home() {
	const [offerListingins, setOfferListings] = useState([]);
	const [saleListings, setSaleListings] = useState([]);
	const [rentListings, setRentListings] = useState([]);
	SwiperCore.use([Navigation]);
	useEffect(() => {
		const fetchOfferListings = async () => {
			try {
				const res = await fetch(`/api/listing/get?offer=true&limit=4`);
				const data = await res.json();
				setOfferListings(data);
				fetchRentListings();
			} catch (error) {
				console.log(error);
			}
		};
		const fetchRentListings = async () => {
			try {
				const res = await fetch(`/api/listing/get?type=rent&limit=4`);
				const data = await res.json();
				setRentListings(data);
				fetchSaleListings();
			} catch (error) {
				console.log(error);
			}
		};
		const fetchSaleListings = async () => {
			try {
				const res = await fetch(`/api/listing/get?type=sale&limit=4`);
				const data = await res.json();
				setSaleListings(data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchOfferListings();
	}, []);
	return (
		<div>
			{/* top */}
			<div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
				<h1 className='text-slate-700mfont-bold text-3xl lg:text-6xl'>
					Find your <span className='text-slate-500'>perfect </span>
					<br />
					place with ease
				</h1>
				<div className='text-grey-400 text-xs sm:text-sm'>
					<span>Nest</span> will help you to find a comfortable place. Our
					experts can help you.
					<br />
					We have a wide variety of properties for you to choose from.
				</div>
				<Link
					to={"/search"}
					className='text-xs sm:text-blue-800 font-bold hover:underline'>
					<p>Let's get started...</p>
				</Link>
			</div>
			{/* swiper */}
			<Swiper navigation>
				{offerListingins &&
					offerListingins.length > 0 &&
					offerListingins.map((listing) => (
						<SwiperSlide key={listing._id}>
							<div
								style={{
									background: `url(${listing.imageUrls[0]})center no-repeat`,
									backgroundSize: "cover",
								}}
								className='h-[500px]'
								key={listing._id}></div>
						</SwiperSlide>
					))}
			</Swiper>
			{/* listing results for offer , sale and rent */}
			<div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
				{offerListingins && offerListingins.length > 0 && (
					<div className=''>
						<div className='my-3'>
							<h2 className='text-2xl font-semibold text-slate-600'>
								Recent Offers
							</h2>
							<Link
								className='text-sm text-blue-800 hover:underline'
								to={`/search?offer=true`}>
								Show more offers
							</Link>
						</div>
						<div className='flex  gap-4'>
							{offerListingins.map((listing) => (
								<ListingItem listing={listing} key={listing._id} />
							))}
						</div>
					</div>
				)}
				{rentListings && rentListings.length > 0 && (
					<div className=''>
						<div className='my-3'>
							<h2 className='text-2xl font-semibold text-slate-600'>
								Recent Places For Rent
							</h2>
							<Link
								className='text-sm text-blue-800 hover:underline'
								to={`/search?type=rent`}>
								Show more places for Rent
							</Link>
						</div>
						<div className='flex  gap-4'>
							{rentListings.map((listing) => (
								<ListingItem listing={listing} key={listing._id} />
							))}
						</div>
					</div>
				)}
				{saleListings && saleListings.length > 0 && (
					<div className=''>
						<div className='my-3'>
							<h2 className='text-2xl font-semibold text-slate-600'>
								Recent Sale Listings
							</h2>
							<Link
								className='text-sm text-blue-800 hover:underline'
								to={`/search?offer=true`}>
								Show more sales
							</Link>
						</div>
						<div className='flex  gap-4'>
							{saleListings.map((listing) => (
								<ListingItem listing={listing} key={listing._id} />
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
