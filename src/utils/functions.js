export const validame = (type, value) => {
  switch (type) {
    case "name":
    case "nombre":
    case "surname":
    case "cognom":
      if (value.length < 3) {
        return "Name must have at least 3 characters";
      }

      return "";

    case "email":
    case "e-mail":
    case "correo":
    case "mail":
      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

      if (!emailRegex.test(value)) {
        return "Email format not valid";
      }

      return "";

    case "password":
    case "contraseña":
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,14}$/;
      //if (!passwordRegex.test(value)) {
      if (value.length < 3) {
        return "The password must have at least 3 characters";
      }

      return "";
    default:
      console.log("whattttttttttt???");
  }
};
