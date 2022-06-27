import { Slider } from "@mui/material"
import { useCallback, useContext, useState } from "react"
import { SocketContext } from "../../../app/context/SocketContext";
import { PacketPlayOutGameOptions } from "../../../app/packets/PacketPlayOutGameOptions";
import { PacketPlayOutPlayerJoin } from "../../../app/packets/PacketPlayOutPlayerJoin";
import moohUrl from "../../../assets/sounds/Cow.mp3"

export const GameOptions = () => {

	const socket = useContext(SocketContext);

	const [speedMin, setSpeedMin] = useState(20);
	const [speedMax, setSpeedMax] = useState(80);
	const [height, setHeight] = useState(50);
	const [cowMode, setCowMode] = useState(false);

	const playersHeight = [
		{ label: "Min", value: 0 },
		{ label: "Small", value: 25 },
		{ label: "Medium", value: 50 },
		{ label: "Big", value: 75 },
		{ label: "Max", value: 100 },
	];

	function playersHeightValueLabelFormat(value: number) {
		return playersHeight[playersHeight.findIndex((mark) => mark.value === value)].label;
	}

	function sendSettings() {
		socket?.emit('game', new PacketPlayOutGameOptions(
			speedMin,
			speedMax,
			height,
			cowMode,
		));
	}

	const handleChange = () => {
		setCowMode(!cowMode);
		if (!cowMode)
		{
			const audio = new Audio(moohUrl);
			audio.play();
		}
	};

	const search = useCallback(() => {
		socket?.emit('game', new PacketPlayOutPlayerJoin());
	}, [socket]);

	return (
		<div id="game-options" className='container border-primary'>
			<h2>Join a public game</h2>
			<div className="config">
				<button onClick={search}>Search Game</button>
			</div>
			<h2>Configure private game</h2>
			<div className="config">
				<h4>Ball Speed</h4>
				<Slider
					getAriaLabel={() => "Temperature range"}
					defaultValue={[
						20,
						80
					]}
					step={10}
					valueLabelDisplay="auto"
					color="secondary"
					onChange={(e: Event) => {
						const target = e.target as HTMLInputElement;
						setSpeedMin(parseInt(target.value[0]));
						setSpeedMax(parseInt(target.value[1]));
					}
					}
				/>
				<h4>Players Height</h4>
				<Slider
					defaultValue={50}
					step={null}
					valueLabelDisplay="auto"
					valueLabelFormat={playersHeightValueLabelFormat}
					marks={playersHeight}
					color="secondary"
					onChange={(e: Event) => {
						const target = e.target as HTMLInputElement;
						setHeight(parseInt(target.value));
					}}
				/>
				<div className="cowmode">
					<label className="h1" htmlFor="cowmode">❤️‍🔥 COW MODE ❤️‍🔥 {cowMode ? '✅' : '❌'}</label>
					<input id="cowmode"
						type="checkbox"
						style={{ display: 'none' }}
						checked={cowMode}
						onChange={handleChange} 
						/>
				</div>
				<button onClick={sendSettings}>Create custom game</button>
			</div>
		</div>
	)
}