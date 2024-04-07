import "./AppoinmentsCard.css"

export const AppointmentsCard = ({ service_id, appointmentDate, appointmentId, onDelete }) => {

    let services = [
        "Tatuajes personalizados",
        "Tatuajes de catalogo",
        "Restauración",
        "Piercings y dilataciones",
        "Venta"
    ]

    return (
        <div className="appoinmentsCardDesign">
            <div>{services[service_id - 1]}</div>
            <div>Appointment Date: {appointmentDate.split("T")[0]}</div>
            <button className="deleteDesign" onClick={() => onDelete(appointmentId)}>Cancel</button>
        </div>
    )
}

