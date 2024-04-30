import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import { Navigation } from "swiper/modules";
//import { url } from "inspector";
export default function Listing() {
	SwiperCore.use([Navigation]);
	const params = useParams();
	const [listing, setListing] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const url = window.location.href;
	useEffect(() => {
		setLoading(true);
		const fetchListing = async () => {
			try {
				const res = await fetch(`/api/listing/get/${params.listingId}`);
				const data = await res.json();
				if (data.success === false) {
					setError(true);
					setLoading(false);
					return;
				}
				setListing(data);
				setLoading(false);
				setError(false);
			} catch (error) {
				setError(true);
				setLoading(false);
			}
		};
		fetchListing();
	}, [params?.listingId]);
	return (
		<main>
			{loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
			{error && (
				<p className='text-center my-7 text-2xl'>
					Something Went Wrong!...
				</p>
			)}

			{listing && (
				<div>
					<Swiper navigation>
						{listing.imageUrls.map((url) => (
							<SwiperSlide key={url}>
								<div
									className='h-[550px]'
									style={{
										background: `url(${url}) center no-repeat`,
									}}></div>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			)}
		</main>
	);
}
