import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import store from "../../app/store";
import { alertType } from '../../app/slices/alertSlice';

interface Props {
    message: string
};

export default function Alert() {
    const [top, settop] = useState(-100)
    const [lol, setlol] = useState("")
    const alert = useSelector(() => store.getState().alertType.alertType);

    function initAlert() {
        store.dispatch(alertType(""));
    }

    useEffect(() => {
        console.log("alertType : ", alert);
        //store.dispatch(alertType(""));
        setlol(alert);
    }, [alert])
    
    function sleep(ms : number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

 
    return (
        <div className="alert">
            <div id="chepa">
                {lol}
            </div>
        </div>
    )
}