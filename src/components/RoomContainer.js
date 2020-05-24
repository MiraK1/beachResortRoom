import React, { Component } from "react";
// import { RoomContext } from "../Context";
import { withRoomConsumer, RoomConsumer, RoomContext } from "../Context";
import RoomsFilter from "./RoomsFilter";
import RoomsList from "./RoomsList";
import Loading from "./Loading";

// export default class RoomContainer extends Component {
// 	static contextType = RoomContext;
// 	render() {
// 		let { loading, sortedRooms, rooms } = this.context;
// 		if (loading) {
// 			return <Loading />;
// 		}
// 		return (
// 			<div>
// 				<RoomsFilter rooms={rooms} />
// 				<RoomsList rooms={sortedRooms} />
// 			</div>
// 		);
// 	}
// }

function RoomContainer({ context }) {
	const { loading, sortedRooms, rooms } = context;
	if (loading) {
		return <Loading />;
	}
	return (
		<div>
			<RoomsFilter rooms={rooms} />
			<RoomsList rooms={sortedRooms} />
		</div>
	);
}

export default withRoomConsumer(RoomContainer);

// export default function RoomContainer() {
// 	return (
// 		<RoomConsumer>
// 			{(value) => {
// 				const { loading, sortedRooms, rooms } = value;
// 				if (loading) {
// 					return <Loading />;
// 				}
// 				return (
// 					<div>
// 						<RoomsFilter rooms={rooms} />
// 						<RoomsList rooms={sortedRooms} />
// 					</div>
// 				);
// 			}}
// 		</RoomConsumer>
// 	);
// }
