import React, {Component} from "react";
import Header from "../../Components/Header/Header";
import HotelIcon from '@material-ui/icons/Hotel';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import LocalParkingIcon from '@material-ui/icons/LocalParking';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import {Footer} from "../../Components/Footer/Footer";
import {connect} from "react-redux";
import {Room} from "../../actions/getRoom";
import Photo from '../../assets/westindtla.jpg'
import '../../Container/HomePage/HomePage.css'
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import BackgroundPhoto from '../../assets/IMG_5640RT.jpg'
import {DateRangePicker, SingleDatePicker,DayPickerRangeController} from 'react-dates'
import './RoomList.css'
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import * as PropTypes from "prop-types";

class RoomList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ShowCreateRoom: true,
            price: '',
            square: '',
            amount: '',
            nameRoom: '',
            about: '',
            park: '',
            fileName: null,
            errors: {},
            search: '',
            startDate: null,
            endDate: null,
            startDateId: PropTypes.string.isRequired  ,
            endDateId: PropTypes.string.isRequired
        };

        this.toggleDangerAlert = this.toggleDangerAlert.bind(this);
        this.toggleDangerAlertOff = this.toggleDangerAlertOff.bind(this);
        this.onChange = this.onChange.bind(this);
    }


    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    onChangeHandler = event => {
        this.setState({
            fileName: event.target.files[0],
            loaded: 0,
        })
    };

    componentDidMount() {
        this.props.fetchData("http://localhost:5000/room/findAll")
    }


    toggleDangerAlert() {
        const {toggleDangerAlert} = this.props;

        toggleDangerAlert && toggleDangerAlert();

        this.setState({
            ShowCreateRoom: false
        })
    }

    toggleDangerAlertOff() {
        const {toggleDangerAlertOff} = this.props;

        toggleDangerAlertOff && toggleDangerAlertOff();

        this.setState({
            ShowCreateRoom: true
        })
    }

    updateSearch(event) {
        this.setState({search: event.target.value.substr(0,20)})
    }

    createRoom = () => {

        const data = new FormData();
        data.append('fileName', this.state.fileName);
        data.append('price', this.state.price);
        data.append('square', this.state.square);
        data.append('amount', this.state.amount);
        data.append('nameRoom', this.state.nameRoom);
        data.append('about', this.state.about);
        data.append('park', this.state.park);

        axios.post("http://localhost:5000/room", data, {}).then(() => {
            console.log(22);
            return this.getAll()
        })
    };

    deleteRoom = id => {
        return axios
            .delete(`http://localhost:5000/room/${id}`)
            .catch(err => {
                console.error(err);
            });
    };

    getAll =  () => {
        this.props.fetchData(`http://localhost:5000/room/findAll`)
    };

    reserveRoom = id => {
        return axios
            .patch(`http://localhost:5000/room/reserve/${id}`)
            .catch(err => {
                console.error(err);
            });
    };

    render() {
        const pushHomePage = this.props.history;
        const {ShowCreateRoom} = this.state;
        const Admin = this.props.location.pathname;
        const Rooms = this.props.rooms.filter(
            (room)=>{
                return room.nameRoom.toLowerCase().indexOf(this.state.search.toLowerCase()) !==-1
            }
        );
        const HideBtnAddRoom = ShowCreateRoom ? 'addRoom' : 'Hide';
        const ShowBoxCreateRoom = ShowCreateRoom ? 'Hide' : 'createRoom';

        return (
            <div className={'boooody'}>
                <Header pushHomePage={pushHomePage}/>
                <input type="text" value={this.state.search} onChange={this.updateSearch.bind(this)} className="SearchInput"/>

                {
                    localStorage.token ? Rooms.map((room) => {
                        return (
                            <div className={'Main'} key={room.id} >
                                <li className={'RoomCart'}>
                                    {/*<DateRangePicker*/}
                                    {/*    startDate={this.state.startDate} // momentPropTypes.momentObj or null,*/}
                                    {/*    startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,*/}
                                    {/*    endDate={this.state.endDate} // momentPropTypes.momentObj or null,*/}
                                    {/*    endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,*/}
                                    {/*    onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })} // PropTypes.func.isRequired,*/}
                                    {/*    focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,*/}
                                    {/*    onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,*/}
                                    {/*/>*/}
                                    <div className={'Room-Photo'}>

                                        <img src={"http://localhost:5000/static/" + room.photo_path} alt=""/>
                                    </div>
                                    <div className={'Main_info_Room'}>
                                        <div className={'Name-Room'}>{room.nameRoom}</div>
                                        <div className={'Param_Room'}>Площа: {room.square} ( м2
                                            ) {10.764 * room.square} (
                                            фут2 )
                                        </div>
                                        <div className={'display-flex'}>
                                            <HotelIcon/>
                                            <div className={'Param_Room'}> {room.amount}</div>
                                            <LocalParkingIcon className={'margin'}/>
                                            <div className={'Param_Room'}> {room.park}</div>
                                        </div>
                                        <div className={'About_Room'}>
                                            {room.about}
                                        </div>
                                        <div className={'Some_Options'}>
                                            <div className={'display-flex'}>
                                                <CheckCircleOutlineIcon/>
                                                <div className={'Param_Room'}>Free Wifi</div>
                                            </div>
                                            <div className={'display-flex'}>
                                                <CheckCircleOutlineIcon/>
                                                <div className={'Param_Room'}>TV</div>
                                            </div>
                                            <div className={'display-flex'}>
                                                <CheckCircleOutlineIcon/>
                                                <div className={'Param_Room'}>Mini Bar</div>
                                            </div>

                                        </div>

                                    </div>
                                    <div>
                                        <div className={'Price-Box'}>
                                            24h from: <div className={'Price_Room'}>{room.price} UAH

                                        </div>

                                        </div>
                                        {
                                            localStorage.token && room.status_id === 2 ?
                                                <div
                                                    className={'Control_Btn Reserve'}
                                                    onClick={() => {
                                                        this.reserveRoom(room.id).then(() => {
                                                            return this.getAll()
                                                        });
                                                    }}
                                                >
                                                    Reserve
                                                </div> : <div
                                                    className={"Reserved"}
                                                >
                                                    This room is reserved

                                                </div>
                                        }

                                        {
                                            Admin === `/AdminRoomList` && localStorage.token  ?

                                                <div className={'Control_Room'}>
                                                    <button
                                                        className={`Control_Btn Delete`}
                                                        onClick={() => {
                                                            this.deleteRoom(room.id).then(() => {
                                                                return this.getAll()
                                                            });
                                                        }}
                                                    >
                                                        Delete {room.id}
                                                    </button>

                                                </div> : ''
                                        }
                                    </div>
                                </li>
                            </div>
                        )
                    }) : <div className={'loading_Room'}>
                        <CircularProgress/>
                    </div>
                }

                {
                    this.props.location.pathname === `/AdminRoomList`?
                        <div className={'ListRoom_Home_Page'}>
                            <button
                                className={`${HideBtnAddRoom}`}
                                onClick={this.toggleDangerAlert}
                            >
                                <div className={'lineAddRoomBtn correct'}/>
                                <div className={'lineAddRoomBtn transRot'}/>
                            </button>
                            <div className={`${ShowBoxCreateRoom}`}>

                                <input type="file"
                                       name="file"
                                       className={'Room-Photo'}
                                       accept=".png, .jpg"
                                       onChange={this.onChangeHandler}/>

                                <img src={this.fileName} alt=""/>

                                <div className={''}>

                                </div>
                                <div className={'Main_info_Room'}>
                                    <input type="text"
                                           name="nameRoom"
                                           placeholder="Name"
                                           className={'Name-Room default_input'}
                                           value={this.state.nameRoom}
                                           onChange={this.onChange}/>
                                    <div className={'Param_Room'}>Площа: ( м2 )
                                        <input type="int"
                                               name="square"
                                               placeholder="square"
                                               className={'default_input'}
                                               value={this.state.square}
                                               onChange={this.onChange}/>
                                    </div>
                                    <div className={'display-flex'}>
                                        <HotelIcon/>
                                        <div className={'Param_Room'}>
                                            <input type="int"
                                                   name="amount"
                                                   placeholder="amount"
                                                   className={'default_input'}
                                                   value={this.state.amount}
                                                   onChange={this.onChange}/>
                                        </div>
                                        <LocalParkingIcon className={'margin'}/>
                                        <div className={'Param_Room'}>
                                            <input type="text"
                                                   name="park"
                                                   placeholder="park"
                                                   className={'default_input'}
                                                   value={this.state.park}
                                                   onChange={this.onChange}/>
                                        </div>
                                    </div>
                                    <div className={'About_Room'}>
                                        <input type="int"
                                               name="about"
                                               placeholder="about"
                                               className={'default_input about'}
                                               value={this.state.about}
                                               onChange={this.onChange}/>
                                    </div>
                                    <div className={'Some_Options'}>
                                        <div className={'display-flex'}>
                                            <CheckCircleOutlineIcon/>
                                            <div className={'Param_Room'}>Free Wifi</div>
                                        </div>
                                        <div className={'display-flex'}>
                                            <CheckCircleOutlineIcon/>
                                            <div className={'Param_Room'}>TV</div>
                                        </div>
                                        <div className={'display-flex'}>
                                            <CheckCircleOutlineIcon/>
                                            <div className={'Param_Room'}>Mini Bar</div>
                                        </div>

                                    </div>
                                </div>
                                <div>
                                    <div className={'Price-Box'}>
                                        24h from: <div className={'Price_Room'}>

                                        <input type="int"
                                               name="price"
                                               className={'price default_input'}
                                               value={this.state.price}
                                               onChange={this.onChange}/>
                                    </div>
                                    </div>
                                    <div className={'Control_Room'}>
                                        <button
                                            onClick={() => {
                                                this.createRoom();
                                            }}
                                            type="submit"
                                            className="Control_Btn Reserve"> Add

                                        </button>

                                    </div>

                                </div>

                                <CancelOutlinedIcon
                                    onClick={this.toggleDangerAlertOff}
                                    className={'closeIcon'}
                                />


                            </div>
                        </div>
                        : ""
                }
                <Footer/>
            </div>
        )
    }
}


const mapStateToProps = (store) => {
    console.log(store.search);
    return {
        rooms: store.HotelReducer.rooms
    };
};

const mapDispatchToProps = (dispatch) => {

    return {
        fetchData: url => dispatch(Room(url))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(RoomList);


