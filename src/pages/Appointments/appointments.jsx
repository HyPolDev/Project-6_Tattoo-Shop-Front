import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./appointments.css"
import { DeleteUserAppointments, GetAppointments, PostAppointments } from "../../services/apiCalls";
import { CInput } from "../../common/CInput/CInput";
import { validame } from "../../utils/function";
import { CButton } from "../../common/CButton/CButton";
import { AppointmentsCard } from "../../components/AppointmentsCard/AppoinmentsCard";
import { Header } from "../../common/Header/Header";

export const Appointments = () => {
    const navigate = useNavigate()
    const datosUser = JSON.parse(localStorage.getItem("passport"))
    const [tokenStorage, setTokenStorage] = useState(datosUser?.token)
    const [appointments, setAppointments] = useState([])
    const [appointmentsData, setAppointmentsData] = useState({
        service_id: "",
        appointment_date: ""
    })

    const [appointmentsDataError, setAppointmentsDataError] = useState({
        service_idError: "",
        appointmentDateError: "",
        appointmentIdError: "",
    })

    const [msgError, setMsgError] = useState("")


    const InputHandler = (e) => {


        setAppointmentsData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const checkError = (e) => {
        const error = validame(e.target.name, e.target.value)

        setAppointmentsDataError((prevState) => ({
            ...prevState,
            [e.target.name + "Error"]: error,
        }))
    }

    const [write, setWrite] = useState("disabled")
    const [loadedData, setLoadedData] = useState(true)
    useEffect(() => {
        const RecoverData = async () => {
            try {
                const fetched = await GetAppointments(tokenStorage);
                setAppointments(fetched.data);
            } catch (error) {
                setMsgError(error.message);
            }
        };
        if (appointments?.length === 0) {
            RecoverData();
        }
    }, [appointments, tokenStorage]);

    const putAppointment = async () => {
        try {
            const fetched = await PostAppointments(tokenStorage, appointmentsData);

            if (fetched.success) {
                window.location.reload()
                navigate("/appointments");
            } else {
                console.error(fetched.message);
            }
        } catch (error) {
            console.error(error);
            setMsgError(error.message);
        }
    };

    const deleteAppointment = async (tokenStorage, appointmentId) => {
        try {
            const fetched = await DeleteUserAppointments(tokenStorage, appointmentId)
            setAppointments(fetched.data)
        } catch (error) {
            setMsgError(error.message);
        } const updatedAppointments = appointments.filter(appointment => appointment.id !== appointmentId);
        setAppointments(updatedAppointments);
    }



    return (
        <>
            <Header />
            <div className="appointmentsDesign">

                {!loadedData
                    ? (<div>LOADING</div>)
                    : (<div>
                        <p>Book now:</p>
                        <CInput
                            className={`inputDesign ${appointmentsDataError.appointmentDateError !== "" ? "inputDesignError" : ""}`}
                            type={"date"}
                            placeholder={""}
                            name={"appointment_date"}
                            value={appointmentsData.appointment_date || ""}
                            onChangeFunction={(e) => InputHandler(e)}
                            onBlurFunction={(e) => checkError(e)}
                        />
                        <CInput
                            className={`inputDesign ${appointmentsDataError.service_idError !== "" ? "inputDesignError" : ""}`}
                            type={"text"}
                            placeholder={"Service name"}
                            name={"service_id"}
                            value={appointmentsData.service_id || ""}
                            onChangeFunction={(e) => InputHandler(e)}
                            onBlurFunction={(e) => checkError(e)}
                        />
                        <CButton
                            className={write === "" ? "cButtonGreen cButtonDesign" : "cButtonDesign"}
                            title={write === "" ? "Confirmar" : "Book"}
                            functionEmit={write === "" ? putAppointment : () => setWrite("")}
                        />
                    </div>)
                }
                {appointments?.length > 0 ? (
                    <>
                        <p>Your appointments:</p>
                        {appointments.map(appointment => (
                            <AppointmentsCard
                                key={appointment.id}
                                service_id={appointment.serviceId}
                                appointmentDate={appointment.appointmentDate}
                                appointmentId={appointment.id}
                                onDelete={() => deleteAppointment(tokenStorage, appointment.id)}
                            />
                        ))}
                    </>
                ) : (
                    <p>No tienes citas programadas.</p>
                )}
            </div>
        </>
    );
}