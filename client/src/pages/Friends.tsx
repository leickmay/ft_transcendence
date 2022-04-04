import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import FriendCard from '../components/FriendCard';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, getUsers } from '../redux/actions/users.actions';
import { getUser } from '../redux/actions/user.actions';
import Popup from '../components/Popup';
import { TIMEOUT } from 'dns';
//import ChatSocket from '../components/ChatSocket';

const Friends = () => {
	const dispatch = useDispatch();
	const user = useSelector((state: any) => state.userReducer);
	const users = useSelector((state: any) => state.usersReducer);
	
	var inputName: string = "";
	var input: any = document.getElementById("input");

	const [popupData, setPopupData] = useState(["...............", "popupHide"]);
	
	useEffect(() => {
		refreshFriendsList();
		window.addEventListener("beforeunload", function() {dispatch(updateUser(user.id, {online: false}));});
	}, []);

	async function activePopup(message: string, isValid: boolean) {
		if (isValid)
			setPopupData([message, "popupShowValid"]);
		else
			setPopupData([message, "popupShowError"]);
		await new Promise(f => setTimeout(f, 1500));
		setPopupData([message, "popupHide"]);

	};

	const refreshFriendsList = () => {
		activePopup("Friends List has been reload !", true);
		dispatch(getUsers());
	};

	const handleInput = (input: string) => {
		inputName = input;
	};

	async function addFriend() {
		var find = false;
		var client: any;
		var newFriendsList = user.friends;
		input.value = "";
		if (!inputName) {
			activePopup("Input is Empty !", false);
			return;
		} else if (user.friends.indexOf(inputName) !== -1) {
			activePopup("Friend already add !", false);
			return;
		} else if (user.name === inputName)
		{
			activePopup("You can't add yourself !", false);
			return;
		}
		users.forEach((element: any) => (inputName && (element.name === inputName)) ? ((client = element) && (find = true)) : (null));
		if (!find)
		{
			activePopup("User not exist !", false);
			return;
		}
		else if (client)
		{
			activePopup(client.name + " has been added !", true);
			await newFriendsList.push(client.name)
			dispatch(updateUser(user.id, {friends: newFriendsList}));
			dispatch(getUser(user.name));
		}
	};

	async function delFriend(toDelete: string) {
		activePopup(toDelete + " has been deleted !", false);
		var newFriendsList: [] = await user.friends.filter((name: string) => name != toDelete);
		dispatch(updateUser(user.id, {friends: newFriendsList}));
		dispatch(getUser(user.name));
	};

	return (
		<div>
			<Navigation userCard={user}/>
			<Popup popupData={popupData}/>
			<div className="friends">
				<div className='friendsSearch'>
					Add Friend :
					<input id='input' onChange={(e) => handleInput(e.target.value)} placeholder='type name'></input>
					<button type='submit' onClick={() => {addFriend();}}>+</button>
					<button type='submit' onClick={() => {refreshFriendsList();}}>🗘</button>
				</div>
				<ul className='friendsList'>
				{
					users.map((friendCard: any) => {
						if (user.friends.indexOf(friendCard.name) > -1)
						{
							let props = {friendCard: friendCard, delFriend: delFriend };
							return ( <FriendCard key={friendCard.id} props={props}/>)}})
				}
				</ul>
			</div>
		</div>
	);
};

export default Friends;