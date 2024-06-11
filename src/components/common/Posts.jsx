import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllPosts } from "../../redux/postSlice";
import axios from "axios";
import { postAPI } from "../../routes";

const Posts = ({ feedType, username, userId }) => {
	const getPostEndpoint = () => {
		switch (feedType) {
			case "forYou":
				return "/all";
			case "following":
				return "/following";
			case "posts":
				return `/user/${username}`;
			case "likes":
				return `/likes/${userId}`;
			default:
				return "/all";
		}
	};

	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();
	const { allPosts } = useSelector(store => store.post);

	const POST_ENDPOINT = getPostEndpoint();

	useEffect(() => {
		setIsLoading(true);
		const fetchAllPosts = async () => {
			try {
				const res = await axios.get(`${postAPI}${POST_ENDPOINT}`);
				dispatch(setAllPosts(res.data));
			} catch (err) {
				console.log(err);
			} finally {
				setIsLoading(false);
			}
		}

		fetchAllPosts();
	}, [feedType, username]);

	return (
		<>
			{(isLoading) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && allPosts?.length === 0 && (
				<p className='text-center my-4'>No posts in this tab. Switch 👻</p>
			)}
			{!isLoading && allPosts && (
				<div>
					{allPosts.map((post) => (
						<Post key={post?._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;