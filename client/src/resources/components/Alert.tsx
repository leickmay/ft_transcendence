import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import store from "../../app/store";
import { alertType } from '../../app/slices/alertSlice';

export default function Alert() {
    const [topi, settop] = useState(-100)
    const [isUsed, setUsed] = useState(false);
    const [message, setMessage] = useState("")
    const alert = useSelector(() => store.getState().alertType.alertType);

    useEffect(() => {
        setMessage(alert);
        if (alert != "")
            showMessage();
    }, [alert])
    
    async function sleep(ms : number) {
        return await new Promise(resolve => setTimeout(resolve, ms));
    }

    async function showMessage (){
        if (isUsed)
            return (null);
        setUsed(true);
        var i = -200;
        while (i < 10)
        {
            i++;
            settop(i);
            await sleep(5);
        }
        await sleep(1000);
        while (i > -200)
        {
            i--;
            settop(i);
            await sleep(8);
        }
        setUsed(false);
        store.dispatch(alertType(""));
    }

    return (
        <div className="alertBase">
            <div id="alertBox" style={{ top : topi.toString() + "px" }}>
                {message}
            </div>
        </div>
    )
}