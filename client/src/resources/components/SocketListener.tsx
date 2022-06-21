import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useCallback, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { receiveMessage } from '../../app/actions/messageActions';
import { GameContext } from '../../app/context/GameContext';
import { SocketContext } from '../../app/context/SocketContext';
import { ChatRoom, ChatTypes, Command } from '../../app/interfaces/Chat';
import { Ball } from '../../app/interfaces/Game.interface';
import { User } from '../../app/interfaces/User';
import { PacketPlayInChatDel, PacketPlayInChatInit, PacketPlayInChatJoin, PacketPlayInChatMessage, PacketPlayInChatOperator, PacketPlayInChatRoomCreate, PacketPlayInChatUp } from '../../app/packets/chat/PacketPlayInChat';
import { PacketPlayInBallUpdate } from '../../app/packets/PacketPlayInBallUpdate';
import { PacketPlayInFriendsUpdate } from '../../app/packets/PacketPlayInFriendsUpdate';
import { PacketPlayInGameUpdate } from '../../app/packets/PacketPlayInGameUpdate';
import { PacketPlayInLeaderboard } from '../../app/packets/PacketPlayInLeaderboard';
import { PacketPlayInPlayerJoin } from '../../app/packets/PacketPlayInPlayerJoin';
import { PacketPlayInPlayerList } from '../../app/packets/PacketPlayInPlayerList';
import { PacketPlayInPlayerMove } from '../../app/packets/PacketPlayInPlayerMove';
import { PacketPlayInPlayerReady } from '../../app/packets/PacketPlayInPlayerReady';
import { PacketPlayInPlayerTeleport } from '../../app/packets/PacketPlayInPlayerTeleport';
import { PacketPlayInPlayerUpdate } from '../../app/packets/PacketPlayInPlayerUpdate';
import { PacketPlayInSearchUserResults } from '../../app/packets/PacketPlayInSearchUserResults';
import { PacketPlayInStatsUpdate } from '../../app/packets/PacketPlayInStatsUpdate';
import { PacketPlayInUserConnection } from '../../app/packets/PacketPlayInUserConnection';
import { PacketPlayInUserDisconnected } from '../../app/packets/PacketPlayInUserDisconnected';
import { PacketPlayInUserUpdate } from '../../app/packets/PacketPlayInUserUpdate';
import { PacketPlayOutFriends } from '../../app/packets/PacketPlayOutFriends';
import { Packet, PacketTypesBall, PacketTypesChat, PacketTypesGame, PacketTypesMisc, PacketTypesPlayer, PacketTypesUser } from '../../app/packets/packetTypes';
import { addRoom, addUserToRoom, delRoom, leaveRoom, setChatRooms, setOperator } from '../../app/slices/chatSlice';
import { updateGame } from '../../app/slices/gameSlice';
import { setBoard } from '../../app/slices/leaderboardSlice';
import { setUserStats } from '../../app/slices/statsSlice';
import { addOnlineUser, removeOnlineUser, setFriends, setResults, updateUser } from '../../app/slices/usersSlice';
import { RootState } from '../../app/store';
import { getUserByLogin } from '../pages/Chat';

interface Props { }

export const SocketListener = (props: Props) => {
	const socket = useContext(SocketContext);
	const {players, setPlayers, balls} = useContext(GameContext);
	const ready = useSelector((state: RootState) => state.socket.ready);

	const currentUser = useSelector((state: RootState) => state.users.current);
	const rooms = useSelector((state: RootState) => state.chat.rooms);

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
				default:
					break;
			}
		});
		
		socket?.off('stats').on('stats', (packet: Packet) => {
			if (packet.packet_id === PacketTypesMisc.STATS_UPDATE)
				stats(packet as PacketPlayInStatsUpdate);
			if (packet.packet_id === PacketTypesMisc.LEADERBOARD)
				board(packet as PacketPlayInLeaderboard);
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
			player.x = packet.x;
			player.y = packet.y;
		}
	}, [players]);

	const ballUpdate = useCallback((packet: PacketPlayInBallUpdate) => {
		let ball: Ball | undefined = balls.find(b => b.id === packet.ball);

		if (!ball) {
			ball = {
				id: packet.ball,
				direction: packet.direction!,
				radius: packet.size!,
				speed: packet.speed!,
				x: packet.x!,
				y: packet.y!,
				screenX: packet.x!,
				screenY: packet.y!,
			}
			balls.push(ball);
		} else {
			if (packet.direction) ball.direction = packet.direction;
			if (packet.size) ball.radius = packet.size;
			if (packet.speed) ball.speed = packet.speed;
			if (packet.x) ball.x = packet.x;
			if (packet.y) ball.y = packet.y;
		}
	}, [balls]);

	useEffect(() => {
		const gameUpdate = (packet: PacketPlayInGameUpdate) => {
			dispatch(updateGame(packet.data));
		}

		const playerList = (packet: PacketPlayInPlayerList) => {
			packet.players.forEach(p => p.screenY = p.y);
			setPlayers(players => packet.players);
		}

		const playerJoin = (packet: PacketPlayInPlayerJoin) => {
			packet.player.screenY = packet.player.y;
			setPlayers(players => [...players, packet.player]);
		}

		// const remove = (packet: PacketPlayInPlayerLeave) => {
		// 	dispatch(removePlayer(packet.player));
		// }

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

		socket?.off('game').on('game', (packet: Packet): void => {
			switch (packet.packet_id) {
				case PacketTypesPlayer.LIST:
					playerList(packet as PacketPlayInPlayerList);
					break;
				case PacketTypesPlayer.JOIN:
					playerJoin(packet as PacketPlayInPlayerJoin);
					break;
				case PacketTypesPlayer.READY:
					playerReady(packet as PacketPlayInPlayerReady);
					break;
				case PacketTypesGame.UPDATE:
					gameUpdate(packet as PacketPlayInGameUpdate);
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
				case PacketTypesBall.UPDATE:
					ballUpdate(packet as PacketPlayInBallUpdate);
					break;
				default:
					break;
			}
		});
	}, [socket, dispatch, playerMove, playerTeleport]);

	useEffect(() => {
	}, [socket, dispatch]);

	useEffect(() => {
		

		const commandHandler = async (packet: PacketPlayInChatMessage) => {
			let cmd = packet.message.text.split(" ", 1);
			switch (cmd[0]) {
				// EXIT
				case "/EXIT": {
					let user: User | undefined = getUserByLogin(packet.message.from);
					if (user?.id !== currentUser?.id)
						break;
					let room = rooms?.find(x => x.id === packet.room);
					if (user && room) {
						let command: Command = {
							user: user,
							room: room.id,
							cmd: cmd,
						};
						dispatch(leaveRoom(command));
						if (room.users.length === 1
							|| room.type === ChatTypes.PRIVATE_MESSAGE
							|| !room.visible) {
							dispatch(delRoom(room));
						}
					}
					break;
				}
				// OPERATOR login
				case "/OPERATOR": {
					break;
				}
				// PASSWORD *****
				case "/PASSWORD": {
					break;
				}
				// BAN login
				case "/BAN": {
					break;
				}
				// MUTE login
				case "/MUTE": {
					break;
				}
				//BLOCK login
				case "/BLOCK": {
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

		const createHandler = async (packet: PacketPlayInChatRoomCreate) => {
			dispatch(addRoom(packet))
		};

		const joinHandler = async (packet: PacketPlayInChatJoin) => {
			dispatch(addUserToRoom(packet));
		};

		const leaveHandler = async () => { };

		const upHandler = async (packet: PacketPlayInChatUp) => {
		};

		const initHandler = async (packet: PacketPlayInChatInit) => {
			let rooms = packet.rooms as Array<ChatRoom>
			rooms.forEach((r: ChatRoom) => { r.messages = []; });
			dispatch(setChatRooms(rooms));
		};

		const delHandler = async (packet: PacketPlayInChatDel) => {
			dispatch(delRoom(packet.room as ChatRoom));
		};

		const operatorHandler = async (packet: PacketPlayInChatOperator) => {
			dispatch(setOperator(packet));
		};

		socket?.off('chat').on('chat', (packet: Packet) => {
			switch (packet.packet_id) {
				case PacketTypesChat.MESSAGE: {
					messageHandler(packet as PacketPlayInChatMessage);
					break;
				}
				case PacketTypesChat.CREATE: {
					createHandler(packet as PacketPlayInChatRoomCreate);
					break;
				}
				case PacketTypesChat.JOIN: {
					joinHandler(packet as PacketPlayInChatJoin);
					break;
				}
				case PacketTypesChat.LEAVE: {
					leaveHandler();
					break;
				}
				case PacketTypesChat.UP: {
					upHandler(packet as PacketPlayInChatUp);
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
				case PacketTypesChat.OPERATOR: {
					operatorHandler(packet as PacketPlayInChatOperator);
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
