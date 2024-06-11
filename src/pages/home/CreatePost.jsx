import { FaImage } from "react-icons/fa6";
import { BsEmojiSmile } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import toast from "react-hot-toast";
import { setAllPosts } from "../../redux/postSlice";
import { postAPI } from "../../routes";

const CreatePost = () => {
	const [openEmoji, setOpenEmoji] = useState(false);
	const [text, setText] = useState("");
	const [image, setImage] = useState(null);
	const [isPending, setIsPending] = useState(false);
	const [isError, setIsError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const imageRef = useRef(null);
	const { authUser } = useSelector(store => store.user);
	const { allPosts } = useSelector(store => store.post);
	const dispatch = useDispatch();

	const handleCreatePost = async (e) => {
		e.preventDefault();
		setIsPending(true);

		try {
			const res = await axios.post(`${postAPI}/create`, {
				text: text,
				image: image
			})
			dispatch(setAllPosts([res.data, ...allPosts]));
			toast.success("Post created successfully");
		} catch (err) {
			setIsError(true);
			setErrorMessage(err.response.data.error || "Internal Server Error")
			setTimeout(() => {
				setIsError(false);
				setErrorMessage("");
			}, 5000);
		} finally {
			setText("");
			setImage("");
			setIsPending(false);
		}
	};

	const handleimageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImage(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleEmoji = (e) => {
		setText((prev) => prev + e.emoji);
		setOpenEmoji(false);
	}

	return (
		<div className='flex p-4 items-start gap-4 border-b border-gray-700'>
			<div className='avatar'>
				<div className='w-10 h-10 rounded-full'>
					<img src={authUser?.profileImg || "/avatar-placeholder.png"} />
				</div>
			</div>
			<form className='flex flex-col gap-2 w-full' onSubmit={handleCreatePost}>
				<textarea
					className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none border-gray-800'
					placeholder='What is happening?!'
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				{image && (
					<div className='relative w-80 mx-auto'>
						<IoCloseSharp
							className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
							onClick={() => {
								setImage(null);
								imageRef.current.value = null;
							}}
						/>
						<img src={image} className='w-full mx-auto h-72 object-contain rounded' />
					</div>
				)}

				<div className='flex justify-between border-t py-2 border-t-gray-700'>
					<div className='flex gap-3 items-center relative'>
						<FaImage
							className='fill-primary w-6 h-6 cursor-pointer'
							onClick={() => imageRef.current.click()}
						/>
						<BsEmojiSmile className='fill-primary w-6 h-6 cursor-pointer' onClick={() => setOpenEmoji((prev) => !prev)} />
						<div className="absolute top-10 left-10">
							<EmojiPicker width={320} height={320} searchDisabled={true} emojiStyle="google" open={openEmoji} onEmojiClick={handleEmoji} />
						</div>
					</div>
					<input type='file' accept='image/*' hidden ref={imageRef} onChange={handleimageChange} />
					<button className='btn btn-primary rounded-full btn-sm text-white px-5'>
						{isPending ? "Posting..." : "Post"}
					</button>
				</div>
				{isError && <div className='text-red-500'>{errorMessage}</div>}
			</form>
		</div>
	);
};
export default CreatePost;
