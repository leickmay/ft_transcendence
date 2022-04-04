import React, { useContext, useEffect, useState } from 'react';
/*import { useDispatch, useSelector } from 'react-redux';
import { SocketContext } from '..';
import { getChannel } from '../redux/actions/channel.actions';
import { getChannels, updateChannel } from '../redux/actions/channels.actions';


const ChatSocket = () => {
	const dispatch = useDispatch();
	const user = useSelector((state: any) => state.userReducer);
	const socket = useContext(SocketContext);
	const chan = useSelector((state: any) => state.channelReducer);
	const chans = useSelector((state: any) => state.channelsReducer);
	var objDiv = document.getElementById("chatMsgs");
	const [chanCN, setChanCN] = useState(Array(999).fill('chan'));
	const [chanSelected, setChanSelected] = useState(0);
	const [chanOpen, setChanOpen] = useState(false);
	var inputMsg: string = "";

	useEffect(() => {
		dispatch(getChannels());
	}, []);
	
	const selectChan = (e:any, index:number) => {
		e.preventDefault();
		if (index !== chanSelected)
		{
			dispatch(getChannel(index));
			setChanCN(Array(Object.keys(chans).length + 1).fill('chan'));
			setChanCN(existingItems => {
				return [
					...existingItems.slice(0, index),
					existingItems[index] = "chan-active",
					...existingItems.slice(index + 1), ]
				})
			setChanSelected(index)
			if (objDiv)
				objDiv.scrollTop = objDiv.scrollHeight;
		}
	};

	const selectHomeChat = (e: any) => {
		e.preventDefault();
		setChanCN(Array(Object.keys(chans).length + 1).fill('chan'));
		setChanSelected(0);

	};

	async function updateChat(msg: string) {
		var newMsgs = chan.msgs;
		await newMsgs.push(msg);
		dispatch(updateChannel(chan.id, {msgs: newMsgs}));
		dispatch(getChannel(chanSelected));
		if (objDiv)
			objDiv.scrollTop = objDiv.scrollHeight;
		socket.removeAllListeners();
	};

	socket.off('msgForCli').on('msgForCli', (msg: string)  => {
		updateChat(msg);
		socket.removeAllListeners();
	});
	
	socket.once('connect', () => {
		console.log("connected");
	});

	const handleKeyDown = (e: any) => {
		e.preventDefault();
		if (e.key === 'Enter' && inputMsg.trim().length !== 0 && chanSelected !== 0)
		{
			e.target.value = "";
			socket.emit('msgForServ', {cliName: user.name, msg: inputMsg});
		}
		else if (chanSelected === 0)
			e.target.value = "";
		else
			inputMsg = e.target.value;
	};
	if (chanOpen)
	return (
		<>
		<div className='chatButton' onClick={() => {setChanOpen(!chanOpen)}}></div>
		<div className='chatSocket'>
			<div className='chatWindow'>
				<div className='chatChannels'>
					<button onClick={(e) => {selectHomeChat(e)}}></button>
					{
						chans !== null && 'map' in chans &&
						chans.map((chn: any) => {
							return(<li className={chanCN[chn.id]} key={chn.id} onClick={(e) => {selectChan(e, chn.id)}}>{chn.name}</li>);
						})
					}
				</div>
				<div id='chatMsgs' className='chatMsgs'>
				{
					chanSelected !== 0 && chan !== null && 'map' in chan.msgs &&
					chan.msgs.map((msg: string, i: number) => {
						return(<li key={i}>{msg}</li>);
					})
				}
				{
					chanSelected === 0 
					? <div className='chatHome'>
						<input></input>
						<button></button>
					  </div> 
					: <li></li>
				}
				</div>
			</div>
			<div className='chatForm'>
				<textarea id='input' className='textarea' onKeyUp={(e) => handleKeyDown(e)} placeholder='type msg'></textarea>
			</div>
		</div>
		</>
	);
	else
	return (
		<div className='chatButton' onClick={() => {setChanOpen(!chanOpen)}}></div>
	);
};

export default ChatSocket;*/