import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./appointments.css";
import { GetAppointments, GetServices, GetProfile, DeleteAppointment, UpdateProfile } from "../../services/apiCalls";
import { PopUpAppointment } from "../../common/PopUpAppointment/PopUpAppointment";
import { Table } from "react-bootstrap";
import { EntryActionButton } from "../../common/EntryActionButton/EntryActionButton";
import { PopUpVerifyAction } from "../../common/PopUpVerifyAction/PopUpVerifyAction";
import { FormatDate } from "../../utils/formatDate";

export const UserAppointments = () => {
    const passport = JSON.parse(localStorage.getItem("passport"));
    const [tokenStorage, setTokenStorage] = useState(passport?.token);
    const [userAppointments, setUserAppointments] = useState(undefined);
    const [loadedData, setLoadedData] = useState(false);
    const [loadedServicesData, setLoadedServicesData] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [verificationModal, setVerificationModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [services, setServices] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [idAppInteracted, setIdAppInteracted] = useState(0);
    const [indexAppToDelete, setIndexAppToDelete] = useState(0);
    const [itemToUpdate, setItemToUpdate] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        if (!tokenStorage) {
            navigate("/")
        }
    }, [tokenStorage])

    useEffect(() => {
        const getUserAppointments = async () => {
            try {
                const fetched = await GetAppointments(tokenStorage)
                setLoadedData(true)
                setUserAppointments(fetched.data)
                if (fetched.data.length > 0) {
                    setAppointments(fetched.data)
                }
            } catch (error) {
                console.log(error)
            }
        }

        const getServicesData = async () => {
            try {
                const fetchedServices = await GetServices();
                setLoadedServicesData(true);
                setServices(fetchedServices.data)
            } catch (error) {
                console.log(error)
            }
        }

        const getTattooersData = async () => {
            try {
                const fetchedTattoers = await GetTattoers(tokenStorage)
                setLoadedTattoersData(true)
                setTattoers(fetchedTattoers.data)
            } catch (error) {
                console.log(error)
            }
        }

        const getEstablishmentsData = async () => {
            try {
                const fetchedServices = await GetEstablishments()
                setLoadedEstablishmentsData(true)
                setEstablishments(fetchedServices.data)
            } catch (error) {
                console.log(error)
            }
        }

        if (!loadedData) { getUserAppointments() }
        if (!loadedServicesData) { getServicesData() }
        if (!loadedTattoersData) { getTattooersData() }
        if (!loadedEstablishmentsData) { getEstablishmentsData() }
    }, [])

    const popupAddAppointment = () => {
        setModalShow(true)
    }

    const closingAddAppointment = () => {
        setModalShow(false)
        if (localStorage.getItem("createdAppointment")) {
            const newAppointment = JSON.parse(localStorage.getItem("createdAppointment"))
            let newAppointmentDate = newAppointment.appointmentDate
            newAppointmentDate += "Z"
            newAppointment.appointmentDate = newAppointmentDate
            if (newAppointment) {
                if (appointments.length > 0) {
                    const allAppointments = appointments
                    let pushed = false
                    for (let i = 0; i < allAppointments.length; i++) {
                        const dateToCompare = allAppointments[i].appointmentDate
                        if (dateToCompare >= newAppointmentDate) {
                            allAppointments.splice(i, 0, newAppointment)
                            setAppointments(allAppointments)
                            localStorage.removeItem("createdAppointment")
                            pushed = true
                            break
                        }
                    }
                    if (!pushed) {
                        allAppointments.push(newAppointment)
                        setAppointments(allAppointments)
                        localStorage.removeItem("createdAppointment")
                        pushed = true
                    }
                } else {
                    const allAppointments = appointments
                    allAppointments.push(newAppointment)
                    setAppointments(allAppointments)
                    localStorage.removeItem("createdAppointment")
                }
            }
        }
    }

    const closingVerifyDelete = () => {
        setIdAppInteracted(0)
        setIndexAppToDelete(0)
        setVerificationModal(false)
    }

    const verifyDeleteAction = (id, index) => {
        setIdAppInteracted(id)
        setIndexAppToDelete(index)
        setVerificationModal(true)
    }

    const deleteAppointment = async () => {
        if (idAppInteracted !== 0) {
            try {
                const fetched = await DeleteAppointment(tokenStorage, idAppInteracted)
                if (fetched.success === false) {
                    throw new Error(fetched.error)
                }
                setAppointments(appointments.filter((item, i) => i !== indexAppToDelete))
                setIdAppInteracted(0)
                setIndexAppToDelete(0)
                setVerificationModal(false)
            } catch (error) {
                console.log(error)
            }
        }
    }

    const activateUpdateAction = (item) => {
        setItemToUpdate(item)
        setUpdateModal(true)
    }

    const closingUpdateAppointment = () => {
        setUpdateModal(false)
        if (localStorage.getItem("updatedAppointment")) {
            const appointmentUpdated = JSON.parse(localStorage.getItem("updatedAppointment"))
            appointmentUpdated.appointmentDate += "Z"
            appointments.map((item, index) => {
                if (item === itemToUpdate) {
                    appointments[index] = appointmentUpdated
                }
            })
            localStorage.removeItem("updatedAppointment")
        }
    }

    return (
        <div className="userAppointmentsDesign">
            <div className="userAppointmentsContent">

                <>
                    <div className="buttonsSectionApp">
                        <button className="newAppointmentBtn" onClick={popupAddAppointment}>
                            New <i className="bi bi-calendar-plus calendarIcon"></i>
                        </button>
                    </div>
                    <div className="appointmentsContent">
                        <Table responsive striped variant="dark">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Date</th>
                                    <th>Establishment</th>
                                    <th>Service</th>
                                    <th>Tattooer</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.length === 0 ? (
                                    <tr key={"no-values"}>
                                        <td colSpan={6}>No appointments for this user</td>
                                    </tr>
                                ) : (
                                    appointments.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index}</td>
                                                <td>{FormatDate(item.appointmentDate)}</td>
                                                <td>{item.establishment.address}</td>
                                                <td>{item.service.serviceName}</td>
                                                <td>{item.tattooer.fullname}</td>
                                                <td className="buttonSection">
                                                    <EntryActionButton
                                                        className={"editButton"}
                                                        buttonIcon={"pencil-square"}
                                                        onClickFunction={() => activateUpdateAction(item)}
                                                    />
                                                    <EntryActionButton
                                                        className={"deleteButton"}
                                                        buttonIcon={"trash"}
                                                        onClickFunction={() => verifyDeleteAction(item.id, index)}
                                                    />
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </Table>
                    </div>
                </>
            </div>
            {modalShow && (
                <PopUpAppointment
                    show={modalShow}
                    onHide={closingAddAppointment}
                    services={services}
                    tattooers={tattooers}
                    establishments={establishments}
                    type={"Create"}
                />
            )}
            {verificationModal && (
                <PopUpVerifyAction
                    show={verificationModal}
                    onHide={closingVerifyDelete}
                    confirm={deleteAppointment}
                    entity={"appointment"}
                />
            )}
            {updateModal && (
                <PopUpAppointment
                    show={updateModal}
                    onHide={closingUpdateAppointment}
                    services={services}
                    tattooers={tattooers}
                    establishments={establishments}
                    item={itemToUpdate}
                    type={"Update"}
                />
            )}
        </div>
    )
}