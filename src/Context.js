import React, { Component } from "react";

// import items from "./data";
// import FeaturedRooms from "./components/FeaturedRooms";

import Client from "./Contentful";

// Client.getEntries().then((res) => console.log(res));

const RoomContext = React.createContext();

// <RoomContext.Provider value={'hello'}
class RoomProvider extends Component {
	state = {
		rooms: [],
		sortedRooms: [],
		featuredRooms: [],
		loading: true,
		type: "all",
		capacity: 1,
		price: 0,
		minPrice: 0,
		maxPrice: 0,
		minSize: 0,
		maxSize: 0,
		breakfast: false,
		pets: false,
	};

	getData = async () => {
		try {
			let res = await Client.getEntries({
				content_type: "beachResortRoom",
				order: "sys.createdAt",
			});
			console.log(res.items);

			let rooms = this.formatData(res.items);
			let featuredRooms = rooms.filter((room) => room.featured === true);
			let maxPrice = Math.max(...rooms.map((item) => item.price));
			let maxSize = Math.max(...rooms.map((item) => item.size));
			this.setState({
				rooms,
				featuredRooms,
				sortedRooms: rooms,
				loading: false,
				price: maxPrice,
				maxPrice: maxPrice,
				maxSize,
			});
		} catch (error) {
			console.log(error);
		}
	};

	componentDidMount() {
		this.getData();
	}

	formatData(items) {
		let tempItems = items.map((item) => {
			let id = item.sys.id;
			let images = item.fields.images.map((image) => image.fields.file.url);
			let room = { ...item.fields, images, id };
			return room;
		});
		return tempItems;
	}

	getRoom = (slug) => {
		let tempRooms = [...this.state.rooms];
		const room = tempRooms.find((room) => room.slug === slug);
		return room;
	};
	handleChange = (event) => {
		const target = event.target;
		const value = target.type === "checkbox" ? target.checked : target.value;
		const name = event.target.name;
		console.log(event.target);

		this.setState(
			{
				[name]: value,
			},
			this.filterRooms
		);
	};

	filterRooms = () => {
		let {
			rooms,
			type,
			capacity,
			price,
			maxPrice,
			minSize,
			maxSize,
			breakfast,
			pets,
		} = this.state;

		let sortedRooms = [...rooms].filter(
			(item) => item.type === type || type === "all"
		);
		sortedRooms = sortedRooms.filter((item) => item.capacity >= +capacity);
		sortedRooms = sortedRooms.filter(
			(item) => item.price <= (+maxPrice * price) / 100
		);
		sortedRooms = sortedRooms.filter(
			(item) => item.size <= maxSize && item.size >= minSize
		);
		sortedRooms = sortedRooms.filter(
			(item) => item.breakfast === true || !breakfast
		);
		sortedRooms = sortedRooms.filter((item) => item.pets === true || !pets);
		this.setState({
			sortedRooms,
		});
	};
	render() {
		return (
			<RoomContext.Provider
				value={{
					...this.state,
					getRoom: this.getRoom,
					handleChange: this.handleChange,
				}}
			>
				{this.props.children}
			</RoomContext.Provider>
		);
	}
}

const RoomConsumer = RoomContext.Consumer;

export function withRoomConsumer(Component) {
	return function ConsumerWrapper(props) {
		return (
			<RoomConsumer>
				{(value) => <Component {...props} context={value} />}
			</RoomConsumer>
		);
	};
}

export { RoomProvider, RoomConsumer, RoomContext };
