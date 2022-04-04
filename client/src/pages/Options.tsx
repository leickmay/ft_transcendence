import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../redux/actions/users.actions';
import { url } from 'inspector';
import { getUser } from '../redux/actions/user.actions';

const Options = () => {

	const dispatch = useDispatch();
	const user = useSelector((state: any) => state.userReducer);
	//const users = useSelector((state: any) => state.usersReducer);
	
	var avatarSrc = [
		"./assets/avatars/avatar1.png", "./assets/avatars/avatar2.png", "./assets/avatars/avatar3.png", "./assets/avatars/avatar4.png",
		"./assets/avatars/avatar5.png", "./assets/avatars/avatar6.png", "./assets/avatars/avatar7.png", "./assets/avatars/avatar8.png"];
	const [avatarCN, setAvatarCN] = useState(["avatar", "avatar", "avatar", "avatar", "avatar", "avatar", "avatar", "avatar"]);
		
	useEffect(() => {
		selectAvatar(avatarSrc.indexOf(user.avatar), true);
		window.addEventListener("beforeunload", function() {dispatch(updateUser(user.id, {online: false}));});
	}, []);

	const selectAvatar = (index: number, force: boolean) => {
		if (avatarSrc.indexOf(user.avatar) !== index || force)
		{
			setAvatarCN(["avatar", "avatar", "avatar", "avatar", "avatar", "avatar", "avatar", "avatar"]);
			setAvatarCN(existingItems => {
				return [
				  ...existingItems.slice(0, index),
				  existingItems[index] = "avatarActive",
				  ...existingItems.slice(index + 1), ]
				})
			dispatch(updateUser(user.id, {avatar: avatarSrc[index]}))
			dispatch(getUser(user.name));
		}
	};

	return (
		<div>
			<Navigation userCard={user} />
			<div className='options'>
				<div className='optionsWindow'>
					<div className='optionsAvatar'>
						<div className='title'> 
							Choose your Avatar 
						</div>
						<ul className='avatarList'>
						{
							avatarSrc.map((src) => {
								let index = avatarSrc.indexOf(src);
								return(<img key= {index} className={avatarCN[index]} src={avatarSrc[index]} width="120px" alt="" onClick={() => {selectAvatar(index, false)}} />);})
						}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Options;