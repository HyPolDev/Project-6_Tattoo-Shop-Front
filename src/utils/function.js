export const validame = (type, value) => {
  switch (type) {

    case "name":
    case "nombre":
    case "first_name":
    case "firstName":
    case "surname":
    case "cognom":
    case "last_name":
    case "lastName":
      if (value.length < 3) {
        return "Please, the name must have at least three characters."
      }
      return "";

    case "email":
    case "e-mail":
    case "correo":
    case "mail":
      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

      if (!emailRegex.test(value)) {
        return "The email format must be correct."
      }
      return "";

    case "password":
    case "contraseña":
    case "password":
      if (value.length < 3 || value.length > 20) {
        return "The password must have a minimum of 3 characters and a maximum of 20"
      }

      return "";
    default:
      console.log("Something went wrong!")
  }
}