import { useCallback, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GameContext } from '../../app/context/GameContext';
import { SocketContext } from '../../app/context/SocketContext';
import { PacketPlayInFriendsUpdate } from '../../app/packets/PacketPlayInFriendsUpdate';
import { PacketPlayInGameBallMove as PacketPlayInBallUpdate } from '../../app/packets/PacketPlayInBallUpdate';
import { PacketPlayInGameUpdate } from '../../app/packets/PacketPlayInGameUpdate';
import { PacketPlayInPlayerJoin } from '../../app/packets/PacketPlayInPlayerJoin';
import { PacketPlayInPlayerList } from '../../app/packets/PacketPlayInPlayerList';
import { PacketPlayInPlayerMove } from '../../app/packets/PacketPlayInPlayerMove';
import { PacketPlayInPlayerReady } from '../../app/packets/PacketPlayInPlayerReady';
import { PacketPlayInPlayerTeleport } from '../../app/packets/PacketPlayInPlayerTeleport';
import { PacketPlayInStatsUpdate } from '../../app/packets/PacketPlayInStatsUpdate';
import { PacketPlayInUserConnection } from '../../app/packets/PacketPlayInUserConnection';
import { PacketPlayInUserDisconnected } from '../../app/packets/PacketPlayInUserDisconnected';
import { PacketPlayInUserUpdate } from '../../app/packets/PacketPlayInUserUpdate';
import { PacketPlayOutFriends } from '../../app/packets/PacketPlayOutFriends';
import { Packet, PacketTypesBall, PacketTypesGame, PacketTypesMisc, PacketTypesPlayer, PacketTypesUser } from '../../app/packets/packetTypes';
import { updateGame } from '../../app/slices/gameSlice';
import { setStats } from '../../app/slices/statsSlice';
import { addOnlineUser, removeOnlineUser, setFriends, updateUser } from '../../app/slices/usersSlice';
import { RootState } from '../../app/store';
import { Ball } from '../../app/interfaces/Game.interface';

interface Props { }

export const SocketListener = (props: Props) => {
	const socket = useContext(SocketContext);
	const {players, setPlayers, balls} = useContext(GameContext);
	const ready = useSelector((state: RootState) => state.socket.ready);

	const dispatch = useDispatch();

	useEffect(() => {
		const stats = (packet: PacketPlayInStatsUpdate) => {
			dispatch(setStats(packet.stats));
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
				default:
					break;
			}
		});

		socket?.off('stats').on('stats', (packet: Packet) => {
			if (packet.packet_id === PacketTypesMisc.STATS_UPDATE)
				stats(packet as PacketPlayInStatsUpdate);
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
		socket?.off('game').on('game', (packet: Packet): void => {
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
		socket?.off('chat').on('chat', (packet: Packet) => {
			console.log(packet);
		});
	}, [socket, dispatch]);

	useEffect(() => {
		if (ready)
			socket?.emit('user', new PacketPlayOutFriends('get'));
	}, [socket, ready]);

	return (
		<></>
	);
};
