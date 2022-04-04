import { useEffect } from 'react';
import Navigation from '../components/Navigation';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../redux/actions/users.actions';

const Statistics = () => {

	const dispatch = useDispatch();
	const user = useSelector((state: any) => state.userReducer);
	//const users = useSelector((state: any) => state.usersReducer);
	
	useEffect(() => {
		window.addEventListener("beforeunload", function() {dispatch(updateUser(user.id, {online: false}));});
	}, []);

	return (
		<div>
			<Navigation userCard={user} />
			<div className='statistics'>

			</div>
		</div>
	);
};

export default Statistics;