import { useSelector } from "react-redux";
import { GameStatus, Player, Sides } from "../../app/interfaces/Game.interface";
import { RootState } from "../../app/store";

interface Props {
	player: Player;
}

export const PlayerCard = (props: Props) => {
	const game = useSelector((state: RootState) => state.game);

	return (
		<div className='user-card' data-direction={props.player && Sides[props.player.side]}>
			<div className='avatar'>
				<img className="playerAvatar" src={props.player.user.avatar} width="50px" height="50px" alt=""></img>
				{props.player.ready && game.status < GameStatus.RUNNING && (
					<div className='overlay'>
						<p className='text-neon2-secondary text-stroke-1'>Ready</p>
					</div>
				)}
			</div>
			<div className="text">
				<p><strong>{props.player.user.name}</strong></p>
				<p><small>{props.player.user.login}</small></p>
			</div>
		</div>
	);
};
