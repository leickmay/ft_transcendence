import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useCallback, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { receiveMessage } from '../../app/actions/messageActions';
import { pushNotification } from '../../app/actions/notificationsActions';
import { GameContext } from '../../app/context/GameContext';
import { SocketContext } from '../../app/context/SocketContext';
import { ChatRoom, ChatTypes } from '../../app/interfaces/Chat';
import { Ball, Vector2 } from '../../app/interfaces/Game.interface';
import { User } from '../../app/interfaces/User';
import { PacketPlayInChatAdmin, PacketPlayInChatBlock, PacketPlayInChatDel, PacketPlayInChatInit, PacketPlayInChatJoin, PacketPlayInChatMessage, PacketPlayInChatOwner } from '../../app/packets/chat/PacketPlayInChat';
import { PacketPlayInAlreadyTaken } from '../../app/packets/PacketPlayInAlreadyTaken';
import { PacketPlayInBallUpdate } from '../../app/packets/PacketPlayInBallUpdate';
import { PacketPlayInFriendsUpdate } from '../../app/packets/PacketPlayInFriendsUpdate';
import { PacketPlayInGameDestroy } from '../../app/packets/PacketPlayInGameDestroy';
import { PacketPlayInGameInvitation } from '../../app/packets/PacketPlayInGameInvitation';
import { PacketPlayInGameUpdate } from '../../app/packets/PacketPlayInGameUpdate';
import { PacketPlayInLeaderboard } from '../../app/packets/PacketPlayInLeaderboard';
import { PacketPlayInPlayerJoin } from '../../app/packets/PacketPlayInPlayerJoin';
import { PacketPlayInPlayerLeave } from '../../app/packets/PacketPlayInPlayerLeave';
import { PacketPlayInPlayerList } from '../../app/packets/PacketPlayInPlayerList';
import { PacketPlayInPlayerMove } from '../../app/packets/PacketPlayInPlayerMove';
import { PacketPlayInPlayerReady } from '../../app/packets/PacketPlayInPlayerReady';
import { PacketPlayInPlayerTeleport } from '../../app/packets/PacketPlayInPlayerTeleport';
import { PacketPlayInPlayerUpdate } from '../../app/packets/PacketPlayInPlayerUpdate';
import { PacketPlayInProfile } from '../../app/packets/PacketPlayInProfile';
import { PacketPlayInSearchUserResults } from '../../app/packets/PacketPlayInSearchUserResults';
import { PacketPlayInStatsUpdate } from '../../app/packets/PacketPlayInStatsUpdate';
import { PacketPlayInUserConnection } from '../../app/packets/PacketPlayInUserConnection';
import { PacketPlayInUserDisconnected } from '../../app/packets/PacketPlayInUserDisconnected';
import { PacketPlayInUserUpdate } from '../../app/packets/PacketPlayInUserUpdate';
import { PacketPlayOutFriends } from '../../app/packets/PacketPlayOutFriends';
import { Packet, PacketTypesBall, PacketTypesChat, PacketTypesGame, PacketTypesMisc, PacketTypesPlayer, PacketTypesUser } from '../../app/packets/packetTypes';
import { delRoom, joinRoom, leaveRoom, setAdmins, setChatRooms, setOwner, upUsersBlocked } from '../../app/slices/chatSlice';
import { resetGame, updateGame } from '../../app/slices/gameSlice';
import { setBoard } from '../../app/slices/leaderboardSlice';
import { InvitationStates, setInvitation, setInvitationStatus, setProfile } from '../../app/slices/profileSlice';
import { setUserStats } from '../../app/slices/statsSlice';
import { addOnlineUser, removeOnlineUser, setFriends, setResults, updateUser } from '../../app/slices/usersSlice';
import { RootState } from '../../app/store';
import { getUserByLogin } from '../pages/Chat';

interface Props { }

export const SocketListener = (props: Props) => {
	const socket = useContext(SocketContext);
	const { players, setPlayers, balls, setBalls } = useContext(GameContext);
	const ready = useSelector((state: RootState) => state.socket.ready);

	const currentUser = useSelector((state: RootState) => state.users.current);
	const rooms = useSelector((state: RootState) => state.chat.rooms);

	const navigate = useNavigate();
	const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();

	useEffect(() => {
		const stats = (packet: PacketPlayInStatsUpdate) => {
			dispatch(setUserStats(packet));
		}

		const board = (packet: PacketPlayInLeaderboard) => {
			dispatch(setBoard(packet.users));
		}

		const online = (packet: PacketPlayInUserConnection) => {
			for (const user of packet.users)
				dispatch(addOnlineUser(user));
		}

		const offline = (packet: PacketPlayInUserDisconnected) => {
			dispatch(removeOnlineUser(packet.user));
		}

		const update = (packet: PacketPlayInUserUpdate) => {
			dispatch(updateUser(packet.user));
		}

		const friends = (packet: PacketPlayInFriendsUpdate) => {
			dispatch(setFriends(packet.friends));
		}

		const search = (packet: PacketPlayInSearchUserResults) => {
			dispatch(setResults(packet.results));
		}

		const profile = (packet: PacketPlayInProfile) => {
			dispatch(setProfile(packet));
		}

		const aleradyTaken = (packet: PacketPlayInAlreadyTaken) => {
			dispatch(pushNotification({ text: 'Error : ' + packet.name + ' is already taken' }));
		}

		socket?.off('user').on('user', (packet: Packet) => {
			switch (packet.packet_id) {
				case PacketTypesUser.CONNECTION:
					online(packet as PacketPlayInUserConnection);
					break;
				case PacketTypesUser.DISCONNECTED:
					offline(packet as PacketPlayInUserDisconnected);
					break;
				case PacketTypesUser.UPDATE:
					update(packet as PacketPlayInUserUpdate);
					break;
				case PacketTypesMisc.FRIENDS:
					friends(packet as PacketPlayInFriendsUpdate);
					break;
				case PacketTypesMisc.SEARCH_USER:
					search(packet as PacketPlayInSearchUserResults);
					break;
				case PacketTypesMisc.ALREADY_TAKEN:
					aleradyTaken(packet as PacketPlayInAlreadyTaken);
					break;
				default:
					break;
			}
		});

		socket?.off('stats').on('stats', (packet: Packet) => {
			if (packet.packet_id === PacketTypesMisc.STATS_UPDATE)
				stats(packet as PacketPlayInStatsUpdate);
			if (packet.packet_id === PacketTypesMisc.LEADERBOARD)
				board(packet as PacketPlayInLeaderboard);
			if ((packet.packet_id === PacketTypesMisc.PROFILE))
				profile(packet as PacketPlayInProfile);
		});
	}, [socket, dispatch]);

	const playerMove = useCallback((packet: PacketPlayInPlayerMove) => {
		let player = players.find(p => p.user.id === packet.player);

		if (player)
			player.direction = packet.direction;
	}, [players]);

	const playerTeleport = useCallback((packet: PacketPlayInPlayerTeleport) => {
		let player = players.find(p => p.user.id === packet.player);

		if (player) {
			player.direction = packet.direction;
			player.location = new Vector2(packet.location);
		}
	}, [players]);

	const ballUpdate = useCallback((packet: PacketPlayInBallUpdate) => {
		let ball: Ball | undefined = balls.find(b => b.id === packet.ball);

		if (!ball) {
			ball = {
				id: packet.ball,
				location: new Vector2(packet.location!),
				direction: new Vector2(packet.direction!),
				radius: packet.size!,
				speed: packet.speed!,
				screen: {
					location: new Vector2(packet.location!),
					direction: new Vector2(packet.direction!),
				},
			}
			balls.push(ball);
		} else {
			if (packet.direction) ball.direction = new Vector2(packet.direction);
			if (packet.size) ball.radius = packet.size;
			if (packet.speed) ball.speed = packet.speed;
			if (packet.location) ball.location = new Vector2(packet.location);
		}
	}, [balls]);

	useEffect(() => {
		const gameUpdate = (packet: PacketPlayInGameUpdate) => {
			dispatch(updateGame(packet.data));
		}

		const gameDestroy = (packet: PacketPlayInGameDestroy) => {
			setPlayers([]);
			setBalls([]);
			dispatch(resetGame());
			dispatch(setInvitation({
				status: InvitationStates.NO_INVITATION,
				target: -1,
			}));
		}

		const playerList = (packet: PacketPlayInPlayerList) => {
			packet.players.forEach(p => p.screenY = p.location.y);
			setPlayers(players => packet.players);
			navigate('/', {replace: true});
		}

		const playerJoin = (packet: PacketPlayInPlayerJoin) => {
			packet.player.screenY = packet.player.location.y;
			setPlayers(players => [...players, packet.player]);
			dispatch(setInvitationStatus(
				InvitationStates.IN_GAME,
			));
		}

		const playerLeave = (packet: PacketPlayInPlayerLeave) => {
			setPlayers(players => players.filter(p => p.user.id !== packet.id));
		}

		const playerReady = (packet: PacketPlayInPlayerReady) => {
			setPlayers(players => players.map(p => {
				if (!p.ready && p.user.id === packet.player)
					return { ...p, ready: true };
				return p;
			}));
		}

		const playerUpdate = (packet: PacketPlayInPlayerUpdate) => {
			setPlayers(players => players.map(p => {
				if (p.user.id === packet.data.id)
					return { ...p, ...packet.data };
				return p;
			}));
		}
		const handleInvitation = (packet: PacketPlayInGameInvitation) => {
			console.log(packet);
			dispatch(pushNotification({
				text:"/Game Invitation by " + packet.user.login,
				duration: 30000,
				button: {
					text: 'Accept',
					action: 'ACCEPT_GAME_INVITATION',
					data: {
						id: packet.room.id,
					},
				},
			}));
		}

		socket?.off('game').on('game', (packet: Packet): void => {
			switch (packet.packet_id) {
				case PacketTypesPlayer.LIST:
					playerList(packet as PacketPlayInPlayerList);
					break;
				case PacketTypesPlayer.JOIN:
					playerJoin(packet as PacketPlayInPlayerJoin);
					break;
				case PacketTypesPlayer.LEAVE:
					playerLeave(packet as PacketPlayInPlayerLeave);
					break;
				case PacketTypesPlayer.READY:
					playerReady(packet as PacketPlayInPlayerReady);
					break;
				case PacketTypesGame.UPDATE:
					gameUpdate(packet as PacketPlayInGameUpdate);
					break;
				case PacketTypesGame.DESTROY:
					gameDestroy(packet as PacketPlayInGameDestroy);
					break;
				case PacketTypesPlayer.MOVE:
					playerMove(packet as PacketPlayInPlayerMove);
					break;
				case PacketTypesPlayer.TELEPORT:
					playerTeleport(packet as PacketPlayInPlayerTeleport);
					break;
				case PacketTypesPlayer.UPDATE:
					playerUpdate(packet as PacketPlayInPlayerUpdate);
					break;
				case PacketTypesGame.INVITATION:
					handleInvitation(packet as PacketPlayInGameInvitation);
					break;
				case PacketTypesBall.UPDATE:
					ballUpdate(packet as PacketPlayInBallUpdate);
					break;
				default:
					break;
			}
		});
	}, [socket, dispatch, playerMove, playerTeleport, ballUpdate, setPlayers, setBalls]);

	useEffect(() => {
	}, [socket, dispatch]);

	useEffect(() => {
		const commandHandler = async (packet: PacketPlayInChatMessage) => {
			let cmd = packet.message.text.split(" ");
			switch (cmd[0]) {
				case "/EXIT": {
					let user: User | undefined = getUserByLogin(packet.message.from);
					if (user?.id !== currentUser?.id)
						break;
					let room = rooms?.find(x => x.id === packet.room);
					if (user && room) {
						dispatch(leaveRoom({
							user: user,
							room: room.id,
							cmd: cmd,
						}));
						if (room.users.length === 0
							|| room.type === ChatTypes.PRIVATE_MESSAGE
							|| !room.visible) {
							dispatch(delRoom(room));
						}
					}
					break;
				}
				case "/BAN": {
					let user: User | undefined = getUserByLogin(cmd[1]);
					if (user === undefined)
						break;
					let room = rooms?.find(x => x.id === packet.room);
					if (user.id === currentUser?.id && room) {
						dispatch(leaveRoom({
							user: user,
							room: room.id,
							cmd: cmd,
						}));
						if (!room.visible) {
							dispatch(delRoom(room));
						}
					}
					break;
				}
				case "/KICK": {
					let user: User | undefined = getUserByLogin(cmd[1]);
					if (user === undefined)
						break;
					let room = rooms?.find(x => x.id === packet.room);
					if (user.id === currentUser?.id && room) {
						dispatch(leaveRoom({
							user: user,
							room: room.id,
							cmd: cmd,
						}));
						if (!room.visible) {
							dispatch(delRoom(room));
						}
					}
					break;
				}
				default:
					break;
			}
		};

		const messageHandler = async (packet: PacketPlayInChatMessage) => {
			if (packet.message.cmd)
				commandHandler(packet);
			dispatch(receiveMessage(packet));
		};

		const joinHandler = async (packet: PacketPlayInChatJoin) => {
			dispatch(joinRoom(packet));
		};

		const initHandler = async (packet: PacketPlayInChatInit) => {
			let rooms = packet.rooms as Array<ChatRoom>
			rooms.forEach((r: ChatRoom) => {
				r.messages = [];
			});
			dispatch(setChatRooms(rooms));
			dispatch(upUsersBlocked(packet.usersBlocked));
		};

		const delHandler = async (packet: PacketPlayInChatDel) => {
			dispatch(delRoom(packet.room as ChatRoom));
		};

		const ownerHandler = async (packet: PacketPlayInChatOwner) => {
			dispatch(setOwner(packet));
		};

		const adminHandler = async (packet: PacketPlayInChatAdmin) => {
			dispatch(setAdmins(packet));
		};

		const blockHandler = async (packet: PacketPlayInChatBlock) => {
			dispatch(upUsersBlocked(packet.usersBlocked));
		};

		socket?.off('chat').on('chat', (packet: Packet) => {
			switch (packet.packet_id) {
				case PacketTypesChat.MESSAGE: {
					messageHandler(packet as PacketPlayInChatMessage);
					break;
				}
				case PacketTypesChat.JOIN: {
					joinHandler(packet as PacketPlayInChatJoin);
					break;
				}
				case PacketTypesChat.INIT: {
					initHandler(packet as PacketPlayInChatInit);
					break;
				}
				case PacketTypesChat.DEL: {
					delHandler(packet as PacketPlayInChatDel);
					break;
				}
				case PacketTypesChat.OWNER: {
					ownerHandler(packet as PacketPlayInChatOwner);
					break;
				}
				case PacketTypesChat.ADMIN: {
					adminHandler(packet as PacketPlayInChatAdmin);
					break;
				}
				case PacketTypesChat.BLOCK: {
					blockHandler(packet as PacketPlayInChatBlock);
					break;
				}
				default: {
					break;
				}
			}
		});
	}, [socket, dispatch, currentUser, rooms]);

	useEffect(() => {
		if (ready)
			socket?.emit('user', new PacketPlayOutFriends('get'));
	}, [socket, ready]);

	return (
		<></>
	);
};
