import { Slider } from "@mui/material"
import { useContext, useState } from "react"
import { SocketContext } from "../../../app/context/SocketContext";
import { PacketPlayOutGameOptions } from "../../../app/packets/PacketPlayOutGameOptions";


export const GameOptions = () => {

	const socket = useContext(SocketContext);

	const [minimize, setMinimize] = useState(false);
	const [speedMin, setSpeedMin] = useState(20);
	const [speedMax, setSpeedMax] = useState(80);
	const [height, setHeight] = useState(50);
	const [min, setMin] = useState(50);
	const [dur, setDur] = useState(12);
	const [cool, setCool] = useState(15);

	const playersHeight = [
		{label: "Min", value: 0},
		{label: "Small", value: 25},
		{label: "Medium", value: 50},
		{label: "Big", value: 75},
		{label: "Max", value: 100},
	];

	function playersHeightValueLabelFormat(value: number) {
		return playersHeight[playersHeight.findIndex((mark) => mark.value === value)].label;
	}

	const minimization = [
		{label: "25%", value: 0},
		{label: "50%", value: 50},
		{label: "75%", value: 100},
	];

	function minimizationValueLabelFormat(value: number) {
		return minimization[minimization.findIndex((mark) => mark.value === value)].label;
	}

	const duration = [
		{label: "4s", value: 0},
		{label: "6s", value: 12},
		{label: "8s", value: 25},
		{label: "10s", value: 37},
		{label: "12s", value: 50},
		{label: "14s", value: 62},
		{label: "16s", value: 75},
		{label: "18s", value: 87},
		{label: "20s", value: 100},
	];

	function durationValueLabelFormat(value: number) {
		return duration[duration.findIndex((mark) => mark.value === value)].label;
	}

	const cooldown = [
		{label: "5s", value: 0},
		{label: "10s", value: 20},
		{label: "15s", value: 40},
		{label: "20s", value: 60},
		{label: "25s", value: 80},
		{label: "30s", value: 100},
	];

	function cooldownValueLabelFormat(value: number) {
		return cooldown[cooldown.findIndex((mark) => mark.value === value)].label;
	}

	function sendSettings() {
		
		socket?.emit('game', new PacketPlayOutGameOptions(
			speedMin,
			speedMax,
			height,
			minimize,
			min,
			dur,
			cool
		));
	}

	return (
		<div className="game-options">
			<div className = "sliders">
				<h4>Speed Range</h4>
				<Slider
					getAriaLabel={() => "Temperature range"}
					defaultValue={[
						20,
						80
					]}
					step={10}
					valueLabelDisplay="auto"
					color="secondary"
					onChange={(e : Event) => {
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
					onChange={(e : Event) => {
						const target = e.target as HTMLInputElement;
						setHeight(parseInt(target.value));
					}}
					/>
			<button onClick={() => setMinimize(!minimize)}>Minimizer Mode !</button>
			{minimize ? 
				<div className="minimise">
					<h3>Press Space to minimize your enemy !</h3>
					<h4>Minimization Percentage</h4>
					<Slider 
						defaultValue={50}
						step={null}
						valueLabelDisplay="auto"
						valueLabelFormat={minimizationValueLabelFormat}
						marks={minimization}
						color="secondary"
						onChange={(e : Event) => {
							const target = e.target as HTMLInputElement;
							setMin(
								parseInt(minimizationValueLabelFormat(parseInt(target.value)))
							);
						}}
					/>
					<h4>Duration</h4>
					<Slider 
						defaultValue={50}
						step={null}
						valueLabelDisplay="auto"
						valueLabelFormat={durationValueLabelFormat}
						marks={duration}
						color="secondary"
						onChange={(e : Event) => {
							const target = e.target as HTMLInputElement;
							setDur(
								parseInt(durationValueLabelFormat(parseInt(target.value)))
							)
						}}
					/>
					<h4>Cooldown</h4>
					<Slider 
						defaultValue={40}
						step={null}
						valueLabelDisplay="auto"
						valueLabelFormat={cooldownValueLabelFormat}
						marks={cooldown}
						color="secondary"
						onChange={(e : Event) => {
							const target = e.target as HTMLInputElement;
							setCool(
								parseInt(cooldownValueLabelFormat(parseInt(target.value)))
							);
						}}
					/>
				</div> 
				: 
				<></>}
				<button onClick={sendSettings}>Validate Game Settings</button>
			</div>
		</div>
	)
}